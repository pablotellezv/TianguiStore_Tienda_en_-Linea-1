const express = require("express");
const router = express.Router();

// 🧠 Controladores
const {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/productosController");

// 🛡️ Middlewares
const { verificarAutenticacion, permitirRoles } = require("../middlewares/authMiddleware");
const validarResultados = require("../middlewares/validacion/validarResultados");
const { productosSchema } = require("../middlewares/validacion/productosSchema");
const { productosUpdateSchema } = require("../middlewares/validacion/productosUpdateSchema");

/**
 * 🛍️ Rutas de productos:
 * - Lectura: públicas (GET)
 * - Escritura: autenticadas y protegidas por rol (POST, PUT, DELETE)
 */

// 📦 Obtener todos los productos (público)
router.get("/", obtenerProductos);

// 🔍 Obtener producto por ID (público)
router.get("/:id", obtenerProductoPorId);

// ➕ Crear nuevo producto (solo admin o vendedor)
router.post(
  "/",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"),
  productosSchema,
  validarResultados,
  agregarProducto
);

// ✏️ Actualizar producto (admin o vendedor) — validación parcial
router.put(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"),
  productosUpdateSchema,
  validarResultados,
  actualizarProducto
);

// 🗑️ Eliminar producto (solo admin)
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"),
  eliminarProducto
);

module.exports = router;
