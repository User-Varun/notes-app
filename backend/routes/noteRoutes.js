const express = require("express");

const Router = express.Router();
const noteController = require("../controllers/noteControllers");

Router.route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNote);

// get => get all notes , post => create new note

module.exports = Router;
