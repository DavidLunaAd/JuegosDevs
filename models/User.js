const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  favoriteAvatar: String,
  favoriteRoom: String,
  victories: Number,
});

module.exports = mongoose.model("user", userSchema, "users");
