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
 * - Escritura protegida por token + rol textual
 */

// 📌 Obtener todos los productos (abierto)
router.get("/", obtenerProductos);

// 📌 Obtener un producto específico (abierto)
router.get("/:id", obtenerProductoPorId);

// 📌 Agregar nuevo producto (requiere autenticación y rol admin o vendedor)
router.post(
  "/",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"), // ✅ Correcto ahora
  agregarProducto
);

// 📌 Actualizar producto (requiere autenticación y rol admin o vendedor)
router.put(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"), // ✅
  actualizarProducto
);

// 📌 Eliminar producto (requiere autenticación y rol admin)
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"), // ✅ Solo admin puede eliminar
  eliminarProducto
);

module.exports = router;
