import { useState, useEffect } from "react";

import NotesAPI from "../services/api";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => fetchNotes(), []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await NotesAPI.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title, description) => {
    try {
      const newNote = await NotesAPI.createNote(title, description);

      setNotes((prevNotes) => [newNote, ...prevNotes]); // add to beginning
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
  };
};
