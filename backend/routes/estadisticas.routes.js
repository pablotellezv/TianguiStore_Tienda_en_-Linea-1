/**
 * 📁 RUTA: routes/estadisticas.routes.js
 * 📊 API REST para estadísticas del sistema TianguiStore
 * 🔐 Todas las rutas requieren autenticación y permisos administrativos
 */

const express = require("express");
const router = express.Router();

const estadisticasController = require("../controllers/estadisticasController"); // Asegúrate de que la ruta sea correcta

const { 
  verificarAutenticacion, 
  verificarPermiso 
} = require("../middlewares/authMiddleware");

// ───────────────────────────────────────────────
// 📊 RUTAS — Panel de métricas del sistema
// ───────────────────────────────────────────────

/**
 * 📦 GET /estadisticas/resumen
 * Retorna estadísticas globales: usuarios, productos, pedidos, ingresos
 */
router.get(
  "/resumen",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.obtenerEstadisticasVentas // Asegúrate de que esta función esté correctamente definida en el controlador
);

/**
 * 📈 GET /estadisticas/ingresos-mensuales
 * Devuelve los ingresos agrupados por mes (últimos 6 meses)
 */
router.get(
  "/ingresos-mensuales",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.obtenerIngresosMensuales // Asegúrate de que esta función esté correctamente definida en el controlador
);

/**
 * 🏆 GET /estadisticas/top-productos
 * Devuelve los 5 productos más vendidos por cantidad total
 */
router.get(
  "/top-productos",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.obtenerTopProductosVendidos // Asegúrate de que esta función esté correctamente definida en el controlador
);

/**
 * 📅 GET /estadisticas/estadisticas-personalizadas
 * Devuelve estadísticas de ventas personalizadas según un rango de fechas
 */
router.get(
  "/estadisticas-personalizadas",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.calcularEstadisticasPersonalizadas // Asegúrate de que esta función esté correctamente definida en el controlador
);

module.exports = router; // Exportar el router correctamente
