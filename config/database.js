const mongoose = require("mongoose"); // Utilizamos la librería de mongoose

//Creamos la conexión con mongo
const connection =
  "mongodb+srv://test_p9:game_P9@cluster0.ht9bz.mongodb.net/game_P9?retryWrites=true&w=majority";

//conexion a MongoDB

mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = connection;
