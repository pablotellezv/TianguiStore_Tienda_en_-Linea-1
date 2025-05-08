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

// **Importación de controladores**
const { 
  obtenerTodasConfiguraciones, 
  obtenerConfiguracionPorClave, 
  actualizarConfiguracion 
} = require("../controllers/configuracionController");

// **Importación de middlewares para autenticación y permisos**
const { 
  verificarAutenticacion, 
  verificarPermiso 
} = require("../middlewares/authMiddleware");

// **Middleware para la validación de resultados después de las validaciones**
const validarResultados = require("../middlewares/validacion/validarResultados");

// **Schemas de validación** para configuraciones
const { 
  configuracionSchema, 
  configuracionGetSchema 
} = require("../middlewares/validacion/configuracionSchema");  // Ajusta la ruta para que apunte correctamente a los archivos en 'validacion'




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
  verificarAutenticacion,                           // Verifica que el usuario esté autenticado
  verificarPermiso("configuracion", "leer"),        // Verifica que el usuario tenga permiso para leer configuraciones
  configuracionGetSchema,                           // Validación opcional por query (paginación, filtros)
  validarResultados,                                // Verifica si los datos de la solicitud son válidos
  obtenerTodasConfiguraciones                       // Controlador para obtener todas las configuraciones activas
);

/**
 * 🔍 GET /configuracion/:clave
 * Obtener configuración específica por clave única.
 * Requiere autenticación y permiso de lectura.
 */
router.get(
  "/:clave",
  verificarAutenticacion,                           // Verifica que el usuario esté autenticado
  verificarPermiso("configuracion", "leer"),        // Verifica que el usuario tenga permiso para leer configuraciones
  obtenerConfiguracionPorClave                      // Controlador para obtener configuración por clave
);

/**
 * ✏️ PUT /configuracion/:clave
 * Actualizar (o insertar si no existe) una configuración específica.
 * Requiere autenticación, permisos de modificación y validación del cuerpo de la petición.
 */
router.put(
  "/:clave",
  verificarAutenticacion,                           // Verifica que el usuario esté autenticado
  verificarPermiso("configuracion", "modificar"),   // Verifica que el usuario tenga permiso para modificar configuraciones
  configuracionSchema,                              // Validación del cuerpo de la petición para actualización
  validarResultados,                                // Verifica si los datos de la solicitud son válidos
  actualizarConfiguracion                           // Controlador para actualizar la configuración
);

// ───────────────────────────────────────────────
module.exports = router;
