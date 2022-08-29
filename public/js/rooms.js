window.onload = function onLoad() {
  const logged = localStorage.getItem("logged");

  //Para ver si está logeado o no
  if (!logged) {
    alert("No estás logeado");
    window.location.replace("http://localhost:3001/");
  }
  document.getElementById("NombreJugador").innerHTML = localStorage.getItem(
    "user"
  );
  document.getElementById("avatarImage").src = localStorage.getItem("avatar");
};

// Funciones para poder hacer el drag & drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(ev) {
  let fullRoom = null;
  ev.preventDefault();

  const data = ev.dataTransfer.getData("text");

  ev.target.appendChild(document.getElementById(data));

  // We look if the room is full
  try {
    fetch("/api-rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        room: ev.target.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(
        await async function (data) {
          console.log(data);
          if (data.quantityUsers >= 2) {
            alert("The room is full. Choose another.");
            fullRoom = true;
          } else {
            alert("The room has space.");
            fullRoom = false;
          }

          if (!fullRoom) {
            document.getElementById("submit").disabled =
              ev.target.id === "home";
            localStorage.setItem("room", ev.target.id);
          } else {
            document.getElementById("submit").disabled = true;
          }
        }
      )
      .catch(function (err) {
        // There was an error
        console.warn("Something went wrong.", err);
      });
  } catch (error) {
    console.error(error);
  }
}

async function submit() {
  window.location.href = "/game";

  let body = JSON.stringify({
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
}
