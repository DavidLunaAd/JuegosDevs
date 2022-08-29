// Display Winner Div alert
document.getElementById("winnerDiv").style.display = "none";

let gameTable = {};
let turn = 0;
let pitch = [];

//Para ver si está logeado o no
const logged = localStorage.getItem("logged");
if (!logged) {
  alert("No estás logeado");
  window.location.replace("http://localhost:3001/");
}

const socket = io("http://localhost:3002", {
  forceNew: true,
});
socket.on("connection");

socket.on("game", (data) => {
  gameTable = data;
  document.getElementById("waiting-player").style.display = "none";

  if (gameTable.player1 === newGame.username) {
    gameTable.game.map((element, index) => {
      if (element === 1) {
        document.getElementById(`game-button-${index}`).style.backgroundColor =
          "#d76262";
      }
    });
  }

  if (gameTable.player2 === newGame.username) {
    gameTable.game.map((element, index) => {
      if (element === 0) {
        document.getElementById(`game-button-${index}`).style.backgroundColor =
          "#62d397";
      }
    });
  }
});

class Game {
  constructor() {
    this.username = localStorage.getItem("user");
    this.room = localStorage.getItem("room");

    document.getElementById("username").innerHTML = this.username;
    document.getElementById("gameRoom").innerHTML = this.room;

    this.init();
  }

  async init(ev) {
    //Activate game
    document
      .querySelectorAll(".gameButton")
      .forEach((button, i) =>
        button.addEventListener("click", (e) => this.setSquareGame(e, i))
      );

    document.querySelectorAll(".gameButton").forEach((button, i) =>
      button.addEventListener("click", async () => {
        let game = {
          id: gameTable._id, // cargar la id de la partida actual
          username: this.username,
          position: i,
        };

        // Request to save game table
        let gameTableUpdated = await this.updateGameTable(game);
        socket.emit("game", gameTableUpdated);
      })
    );

    let roomRes = await this.getRoom();
    let room = roomRes.room;

    if (
      room.player1 === this.username &&
      (room.player2 === null || room.player2 === "")
    ) {
      document.getElementById("waiting-player").style.display = "block";
      localStorage.setItem("colorButton", "#d76262");
    }

    if (
      room.player1 !== null &&
      room.player1 !== "" &&
      room.player2 != null &&
      room.player2 !== ""
    ) {
      // Crear partida
      let gameTableRes = await this.createGameTable(room.player1, room.player2);
      let gameTable = gameTableRes.gameTable;

      localStorage.setItem("colorButton", "#62d397");

      // Obtener id partida

      socket.emit("game", gameTable);
      // Enviar id partida por socket al otro jugador
    }
  }

  createGameTable(player1, player2) {
    return fetch("/create-game-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ player1, player2 }),
    })
      .then((res) => res.json())
      .then((data) => data);
  }

  getRoom() {
    let roomName = localStorage.getItem("room");

    return fetch(`/get-room-by-name/${roomName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => data);
  }

  updateGameTable(game) {
    return fetch("/update-game-table", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(game),
    })
      .then((res) => res.json())
      .then((data) => data);
  }

  setSquareGame(event, position) {
    //change color squares for the game
    // Game usability
    turn++;
    const btn = event.target;
    const color = localStorage.getItem("colorButton");
    btn.style.backgroundColor = color;

    pitch[position] = color;

    if (this.winner(pitch)) {
      const jugadorGanador = turn % 2 ? this.username : "Jugador 2";
      this.addWintoUser(jugadorGanador);
      setTimeout(() => {
        localStorage.setItem("ganador", `${jugadorGanador}`);
        this.deleteUser();
        return (window.location.href = "/final");
        //this.resetGame();
      }, 1);
    }
  }

  winner(pitch) {
    if (pitch[0] === pitch[1] && pitch[1] === pitch[2] && pitch[0]) {
      return true;
    } else if (pitch[3] === pitch[4] && pitch[3] === pitch[5] && pitch[3]) {
      return true;
    } else if (pitch[6] === pitch[7] && pitch[6] === pitch[8] && pitch[6]) {
      return true;
    } else if (pitch[0] === pitch[3] && pitch[0] === pitch[6] && pitch[0]) {
      return true;
    } else if (pitch[1] === pitch[4] && pitch[1] === pitch[7] && pitch[1]) {
      return true;
    } else if (pitch[2] === pitch[5] && pitch[2] === pitch[8] && pitch[2]) {
      return true;
    } else if (pitch[0] === pitch[4] && pitch[0] === pitch[8] && pitch[0]) {
      return true;
    } else if (pitch[2] === pitch[4] && pitch[2] === pitch[6] && pitch[2]) {
      return true;
    }

    return false;
  }

  resetGame() {
    turn = 0;
    pitch = [];

    //Resetear colores botones
    document
      .querySelectorAll(".gameButton")
      .forEach((button) => (button.style.backgroundColor = "grey"));
  }

  logout() {
    this.deleteUser().then((r) => {
      localStorage.clear();
      window.location.replace("http://localhost:3001/");
    });
  }

  async deleteUser() {
    let body = JSON.stringify({
      room: localStorage.getItem("room"),
      user: localStorage.getItem("user"),
    });

    await fetch("/delete-player-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body,
    });
  }

  async addWintoUser(username) {
    const body = JSON.stringify({
      room: localStorage.getItem("room"),
      username: username,
    });

    await fetch(`/add-win`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body,
    })
      .then((res) => res.json())
      .then((data) => data);
  }
}

const newGame = new Game();
