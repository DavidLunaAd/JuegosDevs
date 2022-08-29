const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: String,
  quantityUsers: Number,
  usersRoom: Array,
  player1: String,
  player2: String
});

module.exports = mongoose.model("room", roomSchema, "rooms");
