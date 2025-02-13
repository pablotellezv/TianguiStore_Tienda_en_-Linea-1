const express = require("express");
const router = express.Router();
const { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito } = require("../controllers/carritoController");

// Obtener los productos en el carrito
router.get("/", obtenerCarrito);

// Agregar un producto al carrito
router.post("/", agregarAlCarrito);

// Eliminar un producto del carrito
router.delete("/:id", eliminarDelCarrito);

module.exports = router;
