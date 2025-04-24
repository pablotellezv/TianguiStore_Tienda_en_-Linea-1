const express = require("express");
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoPorId,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productosController");

const {
    verificarAutenticacion,
    permitirRoles
} = require("../middlewares/authMiddleware");

/**
 * 🛍️ Rutas de productos protegidas con JWT
 * - Lectura abierta (GET)
 * - Escritura protegida por token + rol
 */

// 📌 Obtener todos los productos
router.get("/", obtenerProductos);

// 📌 Obtener un producto específico
router.get("/:id", obtenerProductoPorId);

// 📌 Agregar nuevo producto (requiere autenticación y rol adecuado)
router.post(
    "/",
    verificarAutenticacion,
    permitirRoles(1, 2, 3), // Admin, Gerente, Supervisor
    agregarProducto
);

// 📌 Actualizar producto (requiere autenticación y rol adecuado)
router.put(
    "/:id",
    verificarAutenticacion,
    permitirRoles(1, 2, 3), // Admin, Gerente, Supervisor
    actualizarProducto
);

// 📌 Eliminar producto (requiere autenticación y rol adecuado)
router.delete(
    "/:id",
    verificarAutenticacion,
    permitirRoles(1, 3), // Admin, Supervisor
    eliminarProducto
);

module.exports = router;
