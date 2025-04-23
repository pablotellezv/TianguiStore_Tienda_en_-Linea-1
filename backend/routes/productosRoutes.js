const express = require("express");
const router = express.Router();
const {
    obtenerProductos,
    obtenerProductoPorId,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productosController");

// 📌 Obtener todos los productos publicados
router.get("/", obtenerProductos);

// 📌 Obtener un producto por ID
router.get("/:id", obtenerProductoPorId);

// 📌 Agregar un nuevo producto
router.post("/", agregarProducto);

// 📌 Actualizar un producto existente
router.put("/:id", actualizarProducto);

// 📌 Eliminar un producto
router.delete("/:id", eliminarProducto);

module.exports = router;
