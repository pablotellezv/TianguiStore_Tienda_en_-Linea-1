/**
 * 📁 RUTA: routes/productos.routes.js
 * 📦 Descripción: Rutas del catálogo de productos en TianguiStore.
 * 
 * 🔐 Reglas de acceso:
 *   - Lectura general: pública
 *   - Creación/actualización/eliminación: requiere autenticación + roles específicos
 * 
 * 💾 Soporte para carga de archivos (form-data) vía multer.
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
const upload = require("../middlewares/uploadMiddleware");

// ─────────────────────────────────────────────
// 📂 RUTAS PÚBLICAS — Lectura sin autenticación
// ─────────────────────────────────────────────

/**
 * 📦 GET /api/productos
 * Obtiene todos los productos disponibles (catálogo general).
 */
router.get("/", obtenerProductos);

/**
 * 🔍 GET /api/productos/:id
 * Obtiene un producto específico por ID (uso en detalles, validaciones, etc.).
 */
router.get("/:id", obtenerProductoPorId);

// ─────────────────────────────────────────────
// 🔐 RUTAS PROTEGIDAS — Requieren autenticación y rol
// ─────────────────────────────────────────────

/**
 * ➕ POST /api/productos
 * Crea un nuevo producto (sin imágenes ni archivos adjuntos).
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
 * 🖼️ POST /api/productos/archivos
 * Crea un nuevo producto con imágenes y/o modelo 3D (form-data).
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
 * ✏️ PUT /api/productos/:id
 * Actualiza la información de un producto específico.
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
 * 🗑️ DELETE /api/productos/:id
 * Elimina lógicamente un producto (solo admins).
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"),
  eliminarProducto
);

module.exports = router;
