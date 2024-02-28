const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
