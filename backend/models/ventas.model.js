/**
 * 📁 MODELO: ventas.model.js
 * 📊 TABLAS: pedidos, detalle_pedido, productos
 *
 * Este modelo obtiene indicadores clave de ventas para productos individuales
 * o múltiples, útil para dashboards, recomendaciones o badges (más vendido).
 *
 * Mejores prácticas:
 * - Solo cuenta pedidos completados o entregados.
 * - Excluye productos eliminados o con status 'inactivo'.
 * - Compatible con promociones y calificaciones.
 */

const db = require("../db/connection");

// ─────────────────────────────────────────────
// 📊 Obtener estadísticas de un producto
// ─────────────────────────────────────────────
async function obtenerEstadisticasProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT 
      COUNT(dp.detalle_id) AS veces_vendido,
      SUM(dp.cantidad) AS unidades_totales,
      SUM(dp.cantidad * dp.precio_unitario) AS ingresos_totales,
      ROUND(AVG(dp.calificacion), 2) AS calificacion_promedio
    FROM detalle_pedido dp
    INNER JOIN pedidos p ON dp.pedido_id = p.pedido_id
    INNER JOIN estados_pedido ep ON p.estado_id = ep.estado_id
    INNER JOIN productos pr ON dp.producto_id = pr.producto_id
    WHERE dp.producto_id = ?
      AND ep.estado_nombre IN ('completado', 'entregado')
      AND pr.status = 'activo'
  `, [parseInt(producto_id)]);

  const resultado = rows[0] || {};

  return {
    veces_vendido: resultado.veces_vendido || 0,
    unidades_totales: resultado.unidades_totales || 0,
    ingresos_totales: parseFloat(resultado.ingresos_totales || 0),
    calificacion_promedio: resultado.calificacion_promedio !== null
      ? parseFloat(resultado.calificacion_promedio)
      : null
  };
}


// ─────────────────────────────────────────────
// 📈 Obtener ranking de productos más vendidos
// (opcional para carrousel, dashboard o badges)
// ─────────────────────────────────────────────
async function obtenerTopVendidos(limit = 10) {
  const [rows] = await db.query(`
    SELECT 
      dp.producto_id,
      pr.nombre,
      pr.imagen_url,
      SUM(dp.cantidad) AS unidades_totales,
      COUNT(dp.detalle_id) AS veces_vendido,
      ROUND(AVG(dp.calificacion), 2) AS calificacion_promedio
    FROM detalle_pedido dp
    INNER JOIN pedidos p ON dp.pedido_id = p.pedido_id
    INNER JOIN productos pr ON dp.producto_id = pr.producto_id
    WHERE p.estado IN ('completado', 'entregado')
      AND pr.status = 'activo'
    GROUP BY dp.producto_id
    ORDER BY unidades_totales DESC
    LIMIT ?
  `, [parseInt(limit)]);

  return rows;
}

// ─────────────────────────────────────────────
// 🛍️ Obtener resumen global de ventas del sistema
// (puede usarse en el panel admin general)
// ─────────────────────────────────────────────
async function obtenerResumenVentasGlobal() {
  const [rows] = await db.query(`
    SELECT 
      COUNT(DISTINCT p.pedido_id) AS pedidos_completados,
      SUM(dp.cantidad) AS total_unidades,
      SUM(dp.cantidad * dp.precio_unitario) AS total_ingresos,
      ROUND(AVG(dp.calificacion), 2) AS calificacion_promedio
    FROM detalle_pedido dp
    INNER JOIN pedidos p ON dp.pedido_id = p.pedido_id
    WHERE p.estado IN ('completado', 'entregado')
  `);

  return {
    pedidos_completados: rows[0]?.pedidos_completados || 0,
    total_unidades: rows[0]?.total_unidades || 0,
    total_ingresos: parseFloat(rows[0]?.total_ingresos || 0),
    calificacion_promedio: rows[0]?.calificacion_promedio || null
  };
}

// ─────────────────────────────────────────────
// 📤 EXPORTACIÓN
// ─────────────────────────────────────────────
module.exports = {
  obtenerEstadisticasProducto,
  obtenerTopVendidos,
  obtenerResumenVentasGlobal
};
