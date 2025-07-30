const BASE_URL = "http://127.0.0.1:3000/api/v1";

class NotesAPI {
  async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) throw new Error("Failed to fetch notes");

      return await response.json();
    } catch (err) {
      console.log("Error fetching notes💥💥💥: ", err);
    }
  }

  async createNote(title, description) {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to create Note");
      return await response.json();
    } catch (err) {
      console.error("Error creating note💥💥💥:", err);
    }
  }
}

export default new NotesAPI();
