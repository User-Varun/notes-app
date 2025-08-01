const express = require("express");
const notesRouter = require("./routes/noteRoutes");
const app = express();
const cors = require("cors");

app.use(cors());

// body parser , reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use("/api/v1/notes", notesRouter);

module.exports = app;
