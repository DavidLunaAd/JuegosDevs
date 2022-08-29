const path = require("path");
const User = require("../models/User");

module.exports = {
  get: (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "login.html"));
  },
  post: (req, res) => {
    const reqUsername = req.body.user;
    const reqPassword = req.body.password;
    const avatar = req.body.avatar;

    User.findOneAndUpdate(
      { username: reqUsername, password: reqPassword },
      { $set: { favoriteAvatar: avatar } },
      function (err, user) {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }
        if (!user) {
          return res
            .status(401)
            .send({
              Server: "Invalid credentials, try again!",
            })
            .end();
        }
        if (user) {
          console.log(avatar);
          res.status(202);
          //res.sendFile(path.join(__dirname, "../views", "game.html"));
          res.send("Login correct!");
        }
      }
    );
  },
};
