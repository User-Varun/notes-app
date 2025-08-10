const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// Build Mongo connection string
const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

// Helpful diagnostics for Render deployment issues
console.log("Raw DATABASE env:", JSON.stringify(process.env.DATABASE));
if (!process.env.DATABASE_PASSWORD) {
  console.warn("DATABASE_PASSWORD env var is missing.");
}

// Validate URI basic shape (quick sanity check)
if (!/^mongodb(\+srv)?:\/\//.test(DB)) {
  console.warn(
    "The DATABASE connection string does not look like a valid MongoDB URI."
  );
}

mongoose
  .connect(DB)
  .then(() => {
    console.log(
      "DB connected succesfully! Database:",
      mongoose.connection.name,
      "Host:",
      mongoose.connection.host
    );
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    console.error("Full error object:", err);
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection 💥💥💥, shuting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
