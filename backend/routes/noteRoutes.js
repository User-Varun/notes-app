const express = require("express");

const Router = express.Router();
const noteController = require("../controllers/noteControllers");

Router.route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNote);

Router.patch("/updateNote", noteController.updateNote);
Router.delete("/deleteNote", noteController.deleteNote);

module.exports = Router;
