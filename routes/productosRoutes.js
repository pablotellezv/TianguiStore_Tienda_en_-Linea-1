const express = require("express");
const router = express.Router();
const { obtenerProductos, obtenerProductoPorId, agregarProducto } = require("../controllers/productosController");

// Obtener todos los productos
router.get("/", obtenerProductos);

// Obtener un producto por su ID
router.get("/:id", obtenerProductoPorId);

// Agregar un nuevo producto
router.post("/", agregarProducto);

module.exports = router;
