const express = require("express");
const router = express.Router();

const {
    obtenerCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    vaciarCarrito
} = require("../controllers/carritoController");

const {
    verificarAutenticacion
} = require("../middlewares/authMiddleware");

/**
 * 📦 Rutas para el carrito de compras (requiere autenticación)
 * Todas las acciones están asociadas a un usuario autenticado con sesión activa vía JWT.
 */

// 📌 Obtener el contenido del carrito del usuario autenticado
router.get("/", verificarAutenticacion, obtenerCarrito);

// 📌 Agregar un producto al carrito
router.post("/", verificarAutenticacion, agregarAlCarrito);

// 📌 Eliminar un producto específico del carrito
router.delete("/:id", verificarAutenticacion, eliminarDelCarrito);

// 📌 Vaciar todo el carrito del usuario
router.delete("/", verificarAutenticacion, vaciarCarrito);

module.exports = router;
