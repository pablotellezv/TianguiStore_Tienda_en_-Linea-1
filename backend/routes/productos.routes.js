/**
 * 📁 RUTA: routes/productos.routes.js
 * 📦 Descripción: Rutas del catálogo de productos en TianguiStore.
 * 🔐 Reglas de acceso:
 *   - Lectura: pública
 *   - Escritura: autenticación + roles autorizados
 * 💾 Soporte para carga de archivos (form-data) vía multer
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
const upload = require("../middlewares/uploadMiddleware"); // Configuración de multer

// ─────────────────────────────────────────────
// 📂 RUTAS PÚBLICAS — No requieren autenticación
// ─────────────────────────────────────────────

/**
 * 📦 GET /api/productos
 * Lista todos los productos disponibles para el catálogo.
 */
router.get("/", obtenerProductos);

/**
 * 🔍 GET /api/productos/:id
 * Obtiene un producto específico por ID.
 * Se utiliza en detalles de producto o validación de stock.
 */
router.get("/:id", obtenerProductoPorId);

// ─────────────────────────────────────────────
// 🔐 RUTAS PROTEGIDAS — Requieren login y rol
// ─────────────────────────────────────────────

/**
 * ➕ POST /api/productos
 * Crea un producto nuevo sin imágenes ni archivos.
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
 * Crea un producto con imágenes y modelo 3D usando form-data.
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
 * Actualiza parcialmente los datos de un producto.
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
 * Elimina un producto del sistema (requiere rol admin).
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"),
  eliminarProducto
);

module.exports = router;
