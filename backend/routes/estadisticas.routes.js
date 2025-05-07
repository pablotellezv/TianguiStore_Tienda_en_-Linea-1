/**
 * 📁 RUTA: routes/estadisticas.routes.js
 * 📊 API REST para estadísticas del sistema TianguiStore
 * 🔐 Todas las rutas requieren autenticación y permisos administrativos
 */

const express = require("express");
const router = express.Router();

const estadisticasController = require("../controllers/estadisticas.controller");

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
  estadisticasController.obtenerResumenGlobal
);

/**
 * 📈 GET /estadisticas/ingresos-mensuales
 * Devuelve los ingresos agrupados por mes (últimos 6 meses)
 */
router.get(
  "/ingresos-mensuales",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.obtenerIngresosMensuales
);

/**
 * 🏆 GET /estadisticas/top-productos
 * Devuelve los 5 productos más vendidos por cantidad total
 */
router.get(
  "/top-productos",
  verificarAutenticacion,
  verificarPermiso("metricas", "leer"),
  estadisticasController.obtenerTopProductosVendidos
);

module.exports = router;
