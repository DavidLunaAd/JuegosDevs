/*const fs = require("fs");

const usersData = fs.readFileSync("./data/users.json", "utf8");
const roomsData = fs.readFileSync("./data/rooms.json", "utf8");
let usersDataParse = JSON.parse(usersData);
let roomsDataParse = JSON.parse(roomsData);

exports.init = (req, res) => {
  res.statusCode = 200;

  const path = req.url;

  console.log("path ", path);

  switch (path) {
    case "/":
      getStaticFileContent(res, "public/login/login.html", "text/html");
      break;
    case "/login.css":
      getStaticFileContent(res, "public/login/login.css", "text/css");
      break;
    case "/login.js":
      getStaticFileContent(res, "public/login/login.js", "text/javascript");
      break;
    case "/game":
      getStaticFileContent(res, "public/game/game.html", "text/html");
      break;
    case "/game.js":
      getStaticFileContent(res, "public/game/game.js", "text/javascript");
      break;
    case "/game.css":
      getStaticFileContent(res, "public/game/game.css", "text/css");
      break;
      case "/rooms":
      getStaticFileContent(res, "public/rooms/rooms.html", "text/html");
      break;
    case "/rooms.js":
      getStaticFileContent(res, "public/rooms/rooms.js", "text/javascript");
      break;
    case "/rooms.css":
      getStaticFileContent(res, "public/rooms/rooms.css", "text/css");
      break;
    case "/api-users":
      getData("GET", usersDataParse);
      break;
    case "/api-rooms":
      getData("GET", roomsDataParse);
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - Page not Found");
  }

  //function to serve static files like html, css and js
  function getStaticFileContent(response, filepath, contentType) {
    fs.readFile(filepath, function (error, data) {
      if (error) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("500 - Internal Server Error");
      }
      if (data) {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(data);
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  }

  //function to get JSON data
  function getData(callType, data) {
    switch (callType) {
      case "GET":
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
        break;
      default:
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write("There is no info");
        res.end();
    }
  }
};*/
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const gameController = require("../controllers/gameController");
const roomController = require("../controllers/roomController");
const finalController = require("../controllers/finalController");
const apiController = require("../controllers/apiController");

// Static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "/public/css"));
router.use("/js", express.static(__dirname + "/public/js"));

// Login
router.get("/", loginController.get);

// Game
router.get("/game", gameController.get);

// Room
router.get("/rooms", roomController.get);

// Final
router.get("/final", finalController.get);

// REST API
router.post("/login", loginController.post); // Documentar API
router.post("/api-rooms", roomController.post);
router.post("/add-player-room", roomController.addUserRoom);
router.post("/delete-player-room", roomController.deleteUserRoom);
router.get("/get-room-by-name/:roomName", roomController.getRoomByName);
router.post("/create-game-table", gameController.createGameTable);
router.post("/add-win", gameController.addWinUser);
router.put("/update-game-table", gameController.updateGameTable);
router.get("/users-list", gameController.ranking);

module.exports = router;
