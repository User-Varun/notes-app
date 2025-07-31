import { useState, useEffect } from "react";

const BASE_URL = "https://notes-app-api-u247.onrender.com/api/v1";
import NotesAPI from "../services/api";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []); // will only run one on component mount

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await NotesAPI.getAllNotes();

      const transformedNotes = result.map((note) => ({
        id: note._id,
        title: note.title,
        description: note.description,
      }));

      setNotes(transformedNotes);
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
