import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct
} from "../controllers/products.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (lectura)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rutas protegidas con Bearer Token JWT (escritura y borrado)
router.post("/create", auth, createProduct);
router.delete("/:id", auth, deleteProduct);

export default router;
