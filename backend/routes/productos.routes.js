/**
 * 📁 RUTA: routes/productos.routes.js
 * 📦 Descripción: Rutas de productos (catálogo).
 * 🔐 Reglas de acceso:
 *   - Lectura: pública
 *   - Escritura: requiere autenticación y roles permitidos
 * 💾 Incluye manejo de archivos (form-data) vía multer
 */

const express = require("express");
const router = express.Router();

// 🧠 Controladores
const {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  agregarProductoConArchivos,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/productosController");

// 🛡️ Middlewares
const { verificarAutenticacion, permitirRoles } = require("../middlewares/authMiddleware");
const validarResultados = require("../middlewares/validacion/validarResultados");
const { productosSchema } = require("../middlewares/validacion/productosSchema");
const { productosUpdateSchema } = require("../middlewares/validacion/productosUpdateSchema");
const upload = require("../middlewares/uploadMiddleware"); // Multer configurado

// ───────────────────────────────────────────────
// 🔓 Rutas públicas — No requieren autenticación
// ───────────────────────────────────────────────

/**
 * 📦 GET /productos
 * Obtener todos los productos publicados
 */
router.get("/", obtenerProductos);

/**
 * 🔍 GET /productos/:id
 * Obtener un producto específico (con imágenes y modelo 3D)
 */
router.get("/:id", obtenerProductoPorId);

// ───────────────────────────────────────────────
// 🔐 Rutas protegidas — Requieren autenticación + permisos
// ───────────────────────────────────────────────

/**
 * ➕ POST /productos
 * Crear nuevo producto sin archivos
 */
router.post(
  "/",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"),
  productosSchema,
  validarResultados,
  agregarProducto
);

/**
 * 🖼️ POST /productos/archivos
 * Crear nuevo producto con imágenes y modelo 3D (form-data)
 */
router.post(
  "/archivos",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"),
  upload.fields([
    { name: "imagenes", maxCount: 10 },
    { name: "modelo3d", maxCount: 1 }
  ]),
  agregarProductoConArchivos
);

/**
 * ✏️ PUT /productos/:id
 * Actualizar producto existente (validación parcial)
 */
router.put(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin", "vendedor"),
  productosUpdateSchema,
  validarResultados,
  actualizarProducto
);

/**
 * 🗑️ DELETE /productos/:id
 * Eliminar un producto (solo admin)
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"),
  eliminarProducto
);

module.exports = router;
