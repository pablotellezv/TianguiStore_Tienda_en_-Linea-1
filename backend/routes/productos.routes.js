/**
 * 📁 RUTA: productos.routes.js
 * 📦 Gestión de productos: públicas y protegidas con validación robusta
 * Compatibilidad: Todas las rutas existentes se mantienen tal como están.
 */

const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");

// 🛡️ Middlewares
const { verificarAutenticacion, permitirRoles } = require("../middlewares/authMiddleware");
const validarResultados = require("../middlewares/validacion/validarResultados");
const upload = require("../middlewares/uploadMiddleware");

// ✅ Esquemas de validación
const { productosSchema } = require("../middlewares/validacion/productosSchema");
const { productosUpdateSchema } = require("../middlewares/validacion/productosUpdateSchema");

// ─────────────────────────────────────────────
// 🌐 RUTAS PÚBLICAS
// ─────────────────────────────────────────────

/**
 * @route   GET /productos
 * @desc    Obtener listado de productos visibles (paginado desde frontend)
 * @access  Público
 */
router.get("/", productosController.obtenerProductos);

/**
 * @route   GET /productos/:id
 * @desc    Obtener producto básico por ID (uso general)
 * @access  Público
 */
router.get("/:id", productosController.obtenerProductoPorId);

/**
 * @route   GET /productos/detalle/:id
 * @desc    Obtener detalle enriquecido de producto (para vista detalleProducto)
 * @access  Público
 */
router.get("/detalle/:id", productosController.obtenerDetalleProducto);

// ─────────────────────────────────────────────
// 🔐 RUTAS PROTEGIDAS (Requiere autenticación y rol)
// ─────────────────────────────────────────────

/**
 * @route   POST /productos
 * @desc    Crear nuevo producto desde JSON (sin archivos)
 * @access  Admin | Soporte
 */
router.post(
  "/",
  verificarAutenticacion,
  permitirRoles("admin", "soporte"),
  productosSchema,
  validarResultados,
  productosController.agregarProducto
);

/**
 * @route   POST /productos/archivos
 * @desc    Crear producto con imágenes y/o modelo 3D
 * @access  Admin | Soporte
 */
router.post(
  "/archivos",
  verificarAutenticacion,
  permitirRoles("admin", "soporte"),
  upload,
  productosSchema,
  validarResultados,
  productosController.agregarProductoConArchivos
);

/**
 * @route   PUT /productos/:id
 * @desc    Actualizar producto por ID
 * @access  Admin | Soporte
 */
router.put(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin", "soporte"),
  productosUpdateSchema,
  validarResultados,
  productosController.actualizarProducto
);

/**
 * @route   DELETE /productos/:id
 * @desc    Eliminar producto por ID
 * @access  Admin
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  permitirRoles("admin"),
  productosController.eliminarProducto
);

module.exports = router;
