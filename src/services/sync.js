import NotesAPI from "./api";
import SQLiteDB_API from "./sqlite-db";

// simple listener set for status updates
const listeners = new Set();
function notify(event) {
  for (const cb of listeners) {
    try {
      cb(event);
    } catch {}
  }
}

export function subscribeSyncStatus(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function getLastSyncAt() {
  return await SQLiteDB_API.getLastSyncAt();
}

let isSyncing = false;
let intervalHandle = null;

function normalizeCreatedResponse(json) {
  if (!json) return null;
  const note = json.result || json.data || json;
  return note;
}

function normalizeUpdatedResponse(json) {
  const note = json.data || json.result || json;
  return note;
}

export async function syncNow() {
  if (isSyncing) return;
  isSyncing = true;
  notify({ type: "sync:start", at: Date.now() });

  try {
    // Ensure DB is initialized before any queries
    await SQLiteDB_API.initDB();

    const pending = await SQLiteDB_API.getPendingChanges();
    console.log("[sync] pending changes:", pending?.length || 0);

    for (const row of pending) {
      const op = row.op;

      if (op === "create" && !row.remoteId && row.isDeleted !== 1) {
        console.log("[sync] pushing create localId=", row.id);
        const created = await NotesAPI.createNote(row.title, row.description);
        const remote = normalizeCreatedResponse(created);
        if (remote && (remote._id || remote.id)) {
          await SQLiteDB_API.markSynced(row.id, {
            remoteId: remote._id || remote.id,
            serverUpdatedAt: Date.now(),
          });
        }
        continue;
      }

      if (op === "update" && row.remoteId && row.isDeleted !== 1) {
        console.log("[sync] pushing update remoteId=", row.remoteId);
        const updated = await NotesAPI.updateNote(
          row.remoteId,
          row.title,
          row.description
        );
        const remote = normalizeUpdatedResponse(updated);
        await SQLiteDB_API.markSynced(row.id, {
          remoteId: row.remoteId,
          serverUpdatedAt: Date.now(),
        });
        continue;
      }

      if (op === "delete") {
        console.log(
          "[sync] pushing delete localId=",
          row.id,
          "remoteId=",
          row.remoteId
        );
        if (!row.remoteId) {
          await SQLiteDB_API.hardDelete(row.id);
          continue;
        }

        await NotesAPI.deleteNote(row.remoteId);
        await SQLiteDB_API.hardDelete(row.id);
        continue;
      }
    }

    const remoteList = await NotesAPI.getAllNotes();
    console.log("[sync] pulled remote count:", remoteList?.length || 0);
    for (const r of remoteList || []) {
      const remoteId = r._id || r.id;
      await SQLiteDB_API.upsertFromServer({
        remoteId,
        title: r.title,
        description: r.description,
        serverUpdatedAt: Date.now(),
      });
    }

    await SQLiteDB_API.setLastSyncAt(Date.now());
    notify({ type: "sync:success", at: Date.now() });
  } catch (e) {
    console.log("Sync error:", e?.message || e);
    notify({
      type: "sync:error",
      at: Date.now(),
      error: e?.message || String(e),
    });
  } finally {
    isSyncing = false;
  }
}

export function startForegroundSync(everyMs = 5 * 60 * 1000) {
  if (intervalHandle) clearInterval(intervalHandle);
  intervalHandle = setInterval(() => {
    // Avoid overlapping syncs
    if (!isSyncing) syncNow();
  }, everyMs);
  syncNow();
  return () => {
    clearInterval(intervalHandle);
    intervalHandle = null;
  };
}

// Temporary: easy way to inspect local DB state in console
export async function debugDumpLocalDB() {
  return await SQLiteDB_API.logDump();
}
