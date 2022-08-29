const path = require("path");

const GameTable = require("../models/GameTable");
const User = require("../models/User");
const Room = require("../models/Room");

module.exports = {
  get: (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "game.html"));
  },
  updateGameTable: async (req, res) => {
    let reqId = req.body.id;
    let reqUsername = req.body.username;
    let reqPosition = req.body.position;

    console.log("reqposition ", reqPosition);
    console.log("reqId", reqId);

    let gameTable = await GameTable.findOne({ _id: reqId });

    console.log("gameTable-backend", gameTable);

    gameTable.game[reqPosition] = gameTable.player1 === reqUsername ? 0 : 1;

    console.log("gameTable ", gameTable.game);
    gameTable.save().then(
      () => {
        res.status(200);
        res.json(gameTable);
      },
      (error) => {
        return res.status(500).end();
      }
    );
  },
  createGameTable: (req, res) => {
    let player1 = req.body.player1;
    let player2 = req.body.player2;

    GameTable.create(
      {
        player1,
        player2,
        game: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
      },
      function (err, gameTable) {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }
        if (!gameTable) {
          return res
            .status(401)
            .send({
              Server: "Something get wrong",
            })
            .end();
        }
        if (gameTable) {
          console.log("gameTable created", gameTable);
          res.status(202);
          res.json({ gameTable });
        }
      }
    );
  },
  addWinUser: async (req, res) => {
    const reqUsername = req.body.username;
    const reqRoom = req.body.room;

    let playerWin;

    if (reqUsername === "Jugador 2") {
      let room = await Room.findOne({ name: reqRoom });

      playerWin = room.player2;
    } else {
      playerWin = reqUsername;
    }

    console.log(playerWin);
    User.findOneAndUpdate(
      { username: playerWin },
      { $inc: { victories: +1 } },
      function (err, user) {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }
        if (!user) {
          return res
            .status(401)
            .send({
              Server: "Invalid user, try again!",
            })
            .end();
        }
        if (user) {
          res.status(202);
          res.send("Added victory correctly!");
        }
      }
    );
  },
  ranking: async (req, res) => {
    const usersList = await User.find({}).sort({ victories: -1 });

    let users = [];
    usersList.forEach((e) => {
      users.push({ username: e.username, victories: e.victories });
    });

    console.log(users);

    if (usersList) {
      res.status(200);
      return res.json(users);
    }
  },
};
