import * as productsService from "../services/products.service.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productsService.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsService.getById(id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const created = await productsService.create(req.body);
        res.status(201).json(created);
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Error al crear el producto";
        res.status(status).json({ error: message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productsService.remove(id);
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Error al eliminar el producto";
        res.status(status).json({ error: message });
    }
};
