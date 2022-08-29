const path = require("path");
const fs = require("fs");
const usersData = fs.readFileSync("./data/users.json", "utf8");
const roomsData = fs.readFileSync("./data/rooms.json", "utf8");
let usersDataParse = JSON.parse(usersData);
let roomsDataParse = JSON.parse(roomsData);

module.exports = {
  getRooms: async (req, res) => {
    res.json(roomsDataParse);
  },
  getUsers: async (req, res) => {
    res.json(usersDataParse);
  },
};
