import { useState, useEffect } from "react";

const BASE_URL = "https://notes-app-api-u247.onrender.com/api/v1";

import NotesAPI from "../services/api";

import SQLiteDB_API from "../services/sqlite-db";

/*

ofline first system 

 - all data is fetched from the local db.
 - if case of (local DB empty) data will we inserted into localDB
 - if still local DB is empty then there is not data available

*/

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const notes = await SQLiteDB_API.getAllNotes(); // coming from SQLite DB

      setNotes(notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title, description) => {
    try {
      const newNote = await SQLiteDB_API.createNote(title, description);

      setNotes((prevNotes) => [newNote, ...prevNotes]); // add to beginning
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (id, title, description) => {
    try {
      const updatedNote = await SQLiteDB_API.updateNote(id, title, description);

      setNotes((prevNotes) => [updateNote, ...prevNotes]); // add to beginning

      console.log("Note Updated Successfully!", updateNote);
      return updateNote;
    } catch (err) {
      setError(err.message);
    }
  };

  const removeNote = async (id) => {
    try {
      const deletedNote = await SQLiteDB_API.deleteNote(id);

      console.log("Note Removed Successfully!", deletedNote);
      return deletedNote;
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    updateNote,
    removeNote,
  };
};
