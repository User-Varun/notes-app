const BASE_URL = "http://192.168.29.59:3000/api/v1";

class NotesAPI {
  async getAllNotes() {
    try {
      const response = await fetch(`${BASE_URL}/notes`);

      if (!response.ok) throw new Error("Failed to fetch notes");

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.log("Error fetching notes💥💥💥: ", err);
      throw err; //
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

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error("Error creating note💥💥💥:", err);
      throw err;
    }
  }
}

export default new NotesAPI();
