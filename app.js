const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});
