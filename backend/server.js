const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(console.log("DB connected succesfully!"))
  .catch((err) => console.log(err));

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
