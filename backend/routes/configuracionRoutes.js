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

/**
 * ⚙️ Rutas para configuración del sistema
 */

// 🔐 Obtener TODAS las configuraciones (admin, soporte, analista)
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("configuracion", "leer"),
  configuracionGetSchema,
  validarResultados,
  obtenerTodasConfiguraciones
);

// 🔐 Obtener configuración por clave
router.get(
  "/:clave",
  verificarAutenticacion,
  verificarPermiso("configuracion", "leer"),
  obtenerConfiguracionPorClave
);

// 🔐 Actualizar configuración específica
router.put(
  "/:clave",
  verificarAutenticacion,
  verificarPermiso("configuracion", "modificar"),
  configuracionSchema,
  validarResultados,
  actualizarConfiguracion
);

module.exports = router;
