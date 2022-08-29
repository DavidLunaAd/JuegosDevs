class Login {
  //We will save in variables the users info
  constructor() {
    this.username = document.querySelector("#username");
    this.password = document.querySelector("#password");
    this.avatar = this.getAvatar();
  }

  // Para seleccionar el avatar que el usuario tiene
  getAvatar() {
    let avatarSelected;

    let avatar1 = document.getElementById("avatar1");
    avatar1.addEventListener("click", function () {
      localStorage.setItem("avatar", avatar1.children[0].currentSrc);
      avatarSelected = avatar1.children[0].currentSrc;
    });

    let avatar2 = document.getElementById("avatar2");
    avatar2.addEventListener("click", function () {
      localStorage.setItem("avatar", avatar2.children[0].currentSrc);
      avatarSelected = avatar2.children[0].currentSrc;
    });

    let avatar3 = document.getElementById("avatar3");
    avatar3.addEventListener("click", function () {
      localStorage.setItem("avatar", avatar3.children[0].currentSrc);
      avatarSelected = avatar3.children[0].currentSrc;
    });

    let avatar4 = document.getElementById("avatar4");
    avatar4.addEventListener("click", function (event) {
      localStorage.setItem("avatar", avatar4.children[0].currentSrc);
      avatarSelected = avatar4.children[0].currentSrc;
    });

    return avatarSelected;
  }

  async validateUser(username, password, avatar) {
    // We validate if the user exist, if it does the user will be redirected
    if (username !== null && password !== null) {
      try {
        fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            user: username,
            password: password,
            avatar: avatar,
          }),
        })
          .then(
            await function (res) {
              if (res.status === 202) {
                localStorage.setItem("logged", true);
                localStorage.setItem("user", username);
                window.location.href = "/rooms";
              } else {
                alert("THIS USER DOES NOT EXIST");
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
    } else {
      alert("YOU NEED TO FILL ALL THE FORM");
    }
  }

  async onSubmit() {
    event.preventDefault();
    await this.validateUser(
      this.username.value,
      this.password.value,
      this.avatar
    );
  }
}

const newLogin = new Login();
