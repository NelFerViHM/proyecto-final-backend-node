import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.router.js";
import productsRouter from "./routes/products.router.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// Ruta raíz de bienvenida
app.get("/", (req, res) => {
    res.status(200).json({
        message: "API REST de Productos - Proyecto Final Talento Tech",
        status: "OK"
    });
});

// Rutas de la API
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

// Middleware para manejo de rutas desconocidas (Error 404)
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

export default app;
