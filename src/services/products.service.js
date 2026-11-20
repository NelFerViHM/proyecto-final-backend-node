import * as productsModel from "../models/products.model.js";

export const getAll = async () => {
    return await productsModel.getAllProducts();
};

export const getById = async (id) => {
    return await productsModel.getProductById(id);
};

export const create = async (data) => {
    const { name, price, category, description, stock } = data;

    if (!name || typeof name !== "string" || name.trim() === "") {
        throw { status: 400, message: "El nombre del producto es obligatorio" };
    }

    if (price === undefined || typeof price !== "number" || price <= 0) {
        throw { status: 400, message: "El precio debe ser un número mayor a 0" };
    }

    const newProduct = {
        name: name.trim(),
        price,
        category: category ? category.trim() : "General",
        description: description ? description.trim() : "",
        stock: typeof stock === "number" ? stock : 0
    };

    return await productsModel.createProduct(newProduct);
};

export const remove = async (id) => {
    const deleted = await productsModel.deleteProduct(id);
    if (!deleted) {
        throw { status: 404, message: "Producto no encontrado" };
    }
    return true;
};
