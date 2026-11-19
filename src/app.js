import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// Ruta raíz de bienvenida (verificación de estado)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API REST de Productos - Proyecto Final Talento Tech",
    status: "OK"
  });
});

// Middleware para manejo de rutas desconocidas (Error 404)
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

export default app;
