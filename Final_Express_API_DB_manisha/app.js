const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./Router/index");

const port = 8989;
const hostname = "localhost";
const serverDB =
  "mongodb+srv://db_user:X0PJEOqUYq4Qh4sg@cluster0.0htzs.mongodb.net/TestDB?retryWrites=true&w=majority";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", router);


mongoose
  .connect(serverDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(port, () => {
      console.log(`Server is running at ${hostname}: ${port}`);
    });
  })
  .catch((err) => console.log(err));
