const path = require("path");
const Room = require("../models/Room");

module.exports = {
  get: (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "rooms.html"));
  },
  post: (req, res) => {
    let reqRoom = req.body.room;

    Room.findOne({ name: reqRoom }, function (err, room) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      if (!room) {
        return res
          .status(401)
          .send({
            Server: "Invalid room, try again!",
          })
          .end();
      }

      if (room) {
        res.status(202);
        //res.sendFile(path.join(__dirname, "../views", "game.html"));
        return res.send({ quantityUsers: room.quantityUsers });
      }
    });
  },
  getRoomByName: (req, res) => {
    let reqRoom = req.params.roomName;

    Room.findOne({ name: reqRoom }, function (err, room) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      if (!room) {
        return res
          .status(401)
          .send({
            Server: "Invalid room, try again!",
          })
          .end();
      }

      if (room) {
        res.status(200);
        //res.sendFile(path.join(__dirname, "../views", "game.html"));
        return res.json({ room });
      }
    });
  },
  addUserRoom: async (req, res) => {
    let reqRoom = req.body.room;
    let userRoom = req.body.user;

    let room = await Room.findOne({ name: reqRoom });

    if (!room) {
      return res
        .status(401)
        .send({
          Server: "Invalid room, try again!",
        })
        .end();
    }

    if (room.player1 == "") {
      room.player1 = userRoom;
    } else {
      room.player2 = userRoom;
    }

    room.quantityUsers = room.quantityUsers + 1;

    room.save().then(
      () => {
        res.status(200);
        res.json("User added");
      },
      (error) => {
        return res.status(500).end();
      }
    );
  },
  deleteUserRoom: async (req, res) => {
    let reqRoom = req.body.room;
    let userRoom = req.body.user;

    console.log(req.body);
    let room = await Room.findOne({ name: reqRoom });

    if (!room) {
      return res
        .status(401)
        .send({
          Server: "Invalid room, try again!",
        })
        .end();
    }

    console.log("player ", room.player1, room.player2);
    if (room.player1 === userRoom) {
      room.player1 = "";
    } else {
      room.player2 = "";
    }

    room.quantityUsers = room.quantityUsers - 1;

    room.save().then(
      () => {
        res.status(200);
        res.json("User eliminated");
      },
      (error) => {
        return res.status(500).end();
      }
    );
  },
};
