/**
 * 📁 RUTA: routes/configuracion.routes.js
 * ⚙️ MÓDULO: Configuración del sistema TianguiStore
 *
 * 🔐 Requiere autenticación y verificación de permisos granulares por recurso y acción.
 * 📥 Incluye validación de entrada (schemas) y controladores especializados.
 *
 * 🧠 Controladores: configuracionController.js
 * 🛡️ Middlewares: authMiddleware.js, validacion/, express-validator
 * 🗂️ Modelo: configuracion.model.js (tabla: configuracion_fiscal)
 */

const express = require("express");
const router = express.Router();

const {
  obtenerTodasConfiguraciones,
  obtenerConfiguracionPorClave,
  actualizarConfiguracion
} = require("../controllers/configuracionController");

const {
  verificarAutenticacion,
  verificarPermiso
} = require("../middlewares/authMiddleware");

const validarResultados = require("../middlewares/validacion/validarResultados");
const { configuracionSchema } = require("../middlewares/validacion/configuracionSchema");
const { configuracionGetSchema } = require("../middlewares/validacion/configuracionGetSchema");

// ───────────────────────────────────────────────
// 🔐 Rutas protegidas — Requieren token y permisos
// ───────────────────────────────────────────────

/**
 * 📋 GET /configuracion
 * Obtener todas las configuraciones activas del sistema.
 * Solo accesible a roles con permiso: configuracion → leer
 */
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("configuracion", "leer"),
  configuracionGetSchema, // Validación opcional por query (paginación, filtros)
  validarResultados,
  obtenerTodasConfiguraciones
);

/**
 * 🔍 GET /configuracion/:clave
 * Obtener configuración específica por clave única.
 */
router.get(
  "/:clave",
  verificarAutenticacion,
  verificarPermiso("configuracion", "leer"),
  obtenerConfiguracionPorClave
);

/**
 * ✏️ PUT /configuracion/:clave
 * Actualizar (o insertar si no existe) una configuración específica.
 */
router.put(
  "/:clave",
  verificarAutenticacion,
  verificarPermiso("configuracion", "modificar"),
  configuracionSchema,       // Validación del cuerpo de la petición
  validarResultados,
  actualizarConfiguracion
);

// ───────────────────────────────────────────────
module.exports = router;
