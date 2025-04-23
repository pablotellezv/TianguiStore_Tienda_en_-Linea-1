const express = require("express");
const router = express.Router();
const {
    obtenerCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito
} = require("../controllers/carritoController");


// 📌 Obtener el contenido del carrito del usuario autenticado
router.get("/", obtenerCarrito);

// 📌 Agregar un producto al carrito
router.post("/", agregarAlCarrito);

// 📌 Eliminar un producto del carrito por ID
router.delete("/:id", eliminarDelCarrito);

// 📌 Vaciar todo el carrito del usuario
router.delete("/", vaciarCarrito);


module.exports = router;
