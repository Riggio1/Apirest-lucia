import express from "express";
import mongoose from "mongoose";
import excursiones from "./routes/excursiones.js"
import usuarios from "./routes/usuarios.js";
import auth from "./routes/auth.js";
import "dotenv/config";

mongoose
    .connect('mongodb://127.0.0.1:27017/visitway', {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
  .then(() => {
    console.log("Conectado con la DB");
  })
  .catch(() => {
    console.log("Error al conectar con la DB");
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/login", auth);
app.use("/usuarios", usuarios);
app.use('/excursiones', excursiones)

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log("server running...");
});
