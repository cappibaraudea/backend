import app from "./app.js";
import { db } from "./db.js";

const PORT = process.env.port || 3000;
if (db) {
  console.log("Conectado a la base de datos de firebase");
} else {
  console.log("Error al conectar la base de datos");
}

app.listen(PORT);

console.log(`app escuchando en el puerto ${PORT}`);
