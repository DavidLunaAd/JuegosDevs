const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameTableSchema = new Schema({
    player1: String,
    player2: String,
    game: [Number]
});

module.exports = mongoose.model("gameTable", gameTableSchema, "gameTable");