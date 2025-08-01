const noteModel = require("../models/noteModel");

exports.getAllNotes = async (req, res) => {
  const data = await noteModel.find();

  if (!data) return;

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
};

exports.createNote = async (req, res) => {
  try {
    const note = await noteModel.create(req.body);

    res.status(201).json({
      status: "success",
      result: note,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateNote = async (req, res) => {
  try {
    // find the note
    const id = req.body.id;

    const updatedNote = await noteModel.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
    });

    if (!updatedNote) return;

    res.status(201).json({
      status: "success",
      data: updatedNote,
    });
  } catch (err) {
    console.error("error updating note💥💥💥 notecontroller.js", err);
  }
};

exports.deleteNote = async (req, res) => {
  try {
    // find the note
    const id = req.body.id;

    if (!id) return;

    await noteModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.error("error deleting note💥💥💥 notecontroller.js", err);
  }
};
