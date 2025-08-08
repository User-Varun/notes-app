const BASE_URL = "https://notes-app-api-u247.onrender.com/api/v1";

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
      // backend returns { status, result: note }
      return result.result;
    } catch (err) {
      console.error("Error creating note💥💥💥:", err);
      throw err;
    }
  }

  async updateNote(id, title, description) {
    try {
      const response = await fetch(`${BASE_URL}/notes/updateNote`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, description }),
      });

      if (!response.ok) throw new Error("Failed to update Note");

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error("Error updating Note💥💥💥 api.js", err);
    }
  }

  async deleteNote(id) {
    try {
      const response = await fetch(`${BASE_URL}/notes/deleteNote`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      // 🔥 Add response validation
      if (!response.ok) {
        throw new Error(`Failed to delete note. Status: ${response.status}`);
      }

      // 🔥 Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Delete response:", result);
        return result;
      }
    } catch (err) {
      console.error("Error Deleting Note api.js💥💥💥", err);
      throw err;
    }
  }
}

export default new NotesAPI();
