import * as SQLite from "expo-sqlite";

class SQLiteDB_API {
  constructor() {
    this._db = null;
    this._initPromise = null;
  }

  async initDB() {
    // Return existing DB if already initialized
    if (this._db) return this._db;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("notesApp.db");

      // base table
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      );
    `);

      // ensure sync columns exist (idempotent)
      await this.ensureColumn(db, "notes", "remoteId", "TEXT");
      await this.ensureColumn(db, "notes", "updatedAt", "INTEGER");
      await this.ensureColumn(db, "notes", "dirty", "INTEGER DEFAULT 0");
      await this.ensureColumn(db, "notes", "isDeleted", "INTEGER DEFAULT 0");
      await this.ensureColumn(db, "notes", "op", "TEXT"); // create | update | delete

      // meta table for last sync if needed later
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
      this._db = db;
      const ready = db; // alias for clarity
      this._initPromise = null;
      return ready;
    })();

    return this._initPromise;
  }

  async ensureColumn(db, table, column, typeDDL) {
    const cols = await db.getAllAsync(`PRAGMA table_info(${table});`);
    const has = cols.some((c) => c.name === column);
    if (!has) {
      await db.execAsync(
        `ALTER TABLE ${table} ADD COLUMN ${column} ${typeDDL};`
      );
    }
  }

  // CRUD used by UI (offline-first)
  async createNote(title, description) {
    const db = await this.initDB();
    const now = Date.now();

    const result = await db.runAsync(
      "INSERT INTO notes (title, description, updatedAt, dirty, isDeleted, op) VALUES (?, ?, ?, 1, 0, 'create')",
      [title, description, now]
    );

    const row = await db.getFirstAsync("SELECT * FROM notes WHERE id = ?", [
      result.lastInsertRowId,
    ]);
    return row;
  }

  async getAllNotes() {
    const db = await this.initDB();
    // hide locally-deleted rows
    return await db.getAllAsync(
      "SELECT * FROM notes WHERE IFNULL(isDeleted, 0) = 0 ORDER BY id DESC"
    );
  }

  async updateNote(id, title, description) {
    const db = await this.initDB();
    const now = Date.now();

    // preserve 'create' op if not yet pushed
    await db.runAsync(
      `
      UPDATE notes
      SET title = ?, description = ?, updatedAt = ?, dirty = 1,
          op = CASE WHEN op = 'create' THEN 'create' ELSE 'update' END
      WHERE id = ?
      `,
      [title, description, now, id]
    );

    const updated = await db.getFirstAsync("SELECT * FROM notes WHERE id = ?", [
      id,
    ]);
    return updated;
  }

  // soft-delete; actual delete after push success
  async deleteNote(id) {
    const db = await this.initDB();
    const now = Date.now();

    await db.runAsync(
      `
      UPDATE notes
      SET isDeleted = 1, dirty = 1, updatedAt = ?, 
          op = CASE WHEN remoteId IS NULL AND IFNULL(op, '') = 'create' THEN 'create' ELSE 'delete' END
      WHERE id = ?
      `,
      [now, id]
    );

    const deleted = await db.getFirstAsync("SELECT * FROM notes WHERE id = ?", [
      id,
    ]);
    return deleted;
  }

  // Sync helpers
  async getPendingChanges() {
    const db = await this.initDB();
    return await db.getAllAsync(
      "SELECT * FROM notes WHERE dirty = 1 ORDER BY updatedAt ASC"
    );
  }

  async markSynced(localId, { remoteId, serverUpdatedAt }) {
    const db = await this.initDB();
    await db.runAsync(
      `
      UPDATE notes
      SET dirty = 0, op = NULL, 
          remoteId = COALESCE(?, remoteId),
          updatedAt = COALESCE(?, updatedAt)
      WHERE id = ?
      `,
      [remoteId ?? null, serverUpdatedAt ?? null, localId]
    );
  }

  async hardDelete(localId) {
    const db = await this.initDB();
    await db.runAsync("DELETE FROM notes WHERE id = ?", [localId]);
  }

  // Upsert from server; only update if not dirty locally
  async upsertFromServer({ remoteId, title, description, serverUpdatedAt }) {
    const db = await this.initDB();

    const row = await db.getFirstAsync(
      "SELECT * FROM notes WHERE remoteId = ?",
      [remoteId]
    );

    if (!row) {
      await db.runAsync(
        `
        INSERT INTO notes (title, description, remoteId, updatedAt, dirty, isDeleted)
        VALUES (?, ?, ?, ?, 0, 0)
        `,
        [title, description, remoteId, serverUpdatedAt ?? Date.now()]
      );
      return;
    }

    // Do not overwrite local dirty changes
    if (row.dirty === 1) return;

    await db.runAsync(
      `
      UPDATE notes
      SET title = ?, description = ?, updatedAt = ?, isDeleted = 0
      WHERE remoteId = ?
      `,
      [title, description, serverUpdatedAt ?? Date.now(), remoteId]
    );
  }

  // --- Meta helpers for sync status ---
  async setMeta(key, value) {
    const db = await this.initDB();
    await db.runAsync(
      `INSERT INTO sync_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, String(value)]
    );
  }

  async getMeta(key) {
    const db = await this.initDB();
    const row = await db.getFirstAsync(
      "SELECT value FROM sync_meta WHERE key = ?",
      [key]
    );
    return row ? row.value : null;
  }

  async setLastSyncAt(ts) {
    await this.setMeta("lastSyncAt", ts);
  }

  async getLastSyncAt() {
    const v = await this.getMeta("lastSyncAt");
    const n = v != null ? Number(v) : null;
    return Number.isFinite(n) ? n : null;
  }

  // --- Debug helpers (temporary) ---
  async getAllNotesRaw() {
    const db = await this.getDB();
    return await db.getAllAsync("SELECT * FROM notes ORDER BY id DESC");
  }

  async dumpAll() {
    const db = await this.initDB();
    const notes = await db.getAllAsync("SELECT * FROM notes ORDER BY id DESC");
    const pending = await db.getAllAsync(
      "SELECT * FROM notes WHERE dirty = 1 ORDER BY updatedAt ASC"
    );
    const syncMeta = await db.getAllAsync(
      "SELECT key, value FROM sync_meta ORDER BY key"
    );
    return { notes, pending, syncMeta };
  }

  async logDump() {
    try {
      const dump = await this.dumpAll();
      console.log("\n===== Local SQLite Dump =====\n");
      console.log(JSON.stringify(dump, null, 2));
      console.log("\n===== End Dump =====\n");
      return dump;
    } catch (e) {
      console.log("Dump error:", e?.message || e);
      throw e;
    }
  }
}

export default new SQLiteDB_API();
