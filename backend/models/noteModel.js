const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please specify your note title!"],
  },
  description: {
    type: String,
    required: [true, "please specify your note description!"],
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
