class Final {
  constructor() {
    this.ganador = localStorage.getItem("ganador");
    document.getElementById("ganador").innerHTML = this.ganador;
    localStorage.removeItem("ganador");

    this.init();
  }

  async init() {
    await this.ranking();
  }

  async repeatGame() {
    const body = JSON.stringify({
      room: localStorage.getItem("room"),
      user: localStorage.getItem("user"),
    });

    await fetch("/add-player-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body,
    });

    await window.location.replace("http://localhost:3001/rooms");
  }

  logout() {
    localStorage.clear();
    window.location.replace("http://localhost:3001/");
  }

  async ranking() {
    await fetch("/users-list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        const div = document.createElement("div");
        div.classList.add("ranking-wrapper");
        const ul = document.createElement("ul");
        div.appendChild(ul);
        console.log(data);
        data.map((e) => {
          console.log("user", e);
          const li = document.createElement("li");
          li.innerHTML = `<p>${e.username}  -  Victorias: ${e.victories}</p>`;
          ul.appendChild(li);
        });

        const gameWrapper = document.getElementById("game-wrapper");
        gameWrapper.appendChild(div);

        if (data) {
          const ranking = document.getElementById("rankingUpload");
          ranking.classList.add("hide");
        }
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
}

const newFinal = new Final();
