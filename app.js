const socketio = require("socket.io");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const server = require("http").createServer(app);
const router = require("./router/router");
const io = socketio(server, { cors: { origin: "*" } });
require("./config/database");

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  app.use("/", router);
  app.use("/", express.static("public"));
});

// Express utilities
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Socket io server
server.listen(3002, () => {
  console.log("Socket server running on 3002");
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("game", (data) => {
    const { player } = data;

    if (player === 1) {
      socket.broadcast.emit("game", data);
    }
    if (player === 2) {
      socket.broadcast.emit("game", data);
    }
    io.emit("game", data);
  });
});
