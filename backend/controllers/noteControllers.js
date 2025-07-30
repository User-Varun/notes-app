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
