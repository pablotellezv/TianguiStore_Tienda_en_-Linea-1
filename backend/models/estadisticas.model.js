/**
 * 📁 MODELO: estadisticas.model.js
 * 📦 FUNCIONES: Métricas globales del sistema TianguiStore
 * 🔍 Este módulo proporciona funciones estadísticas para dashboards.
 * 🔐 Todas las funciones asumen conexión segura con MySQL desde `db/connection`.
 */

const db = require("../db/connection");

/**
 * 👥 Cuenta total de usuarios activos (sin borrado lógico).
 */
async function contarUsuariosActivos() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM usuarios
    WHERE activo = 1 AND borrado_logico = 0
  `);
  return rows[0]?.total || 0;
}

/**
 * 🛒 Cuenta total de productos publicados.
 */
async function contarProductosPublicados() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM productos
    WHERE publicado = 1
  `);
  return rows[0]?.total || 0;
}

/**
 * 📦 Total de pedidos realizados en la plataforma.
 */
async function contarPedidos() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM pedidos
  `);
  return rows[0]?.total || 0;
}

/**
 * 💰 Suma de ingresos generados por pedidos pagados.
 */
async function calcularTotalIngresos() {
  const [rows] = await db.query(`
    SELECT SUM(total) AS ingresos
    FROM pedidos
    WHERE estado_pago = 'pagado'
  `);
  return rows[0]?.ingresos || 0;
}

/**
 * 📊 Ingresos por mes (últimos 6 meses), para gráficos.
 */
async function obtenerIngresosMensuales() {
  const [rows] = await db.query(`
    SELECT 
      DATE_FORMAT(fecha_creacion, '%Y-%m') AS mes,
      SUM(total) AS ingresos
    FROM pedidos
    WHERE estado_pago = 'pagado'
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 6
  `);
  return rows;
}

/**
 * 🏆 TOP 5 productos más vendidos por cantidad total.
 */
async function obtenerTopProductosVendidos() {
  const [rows] = await db.query(`
    SELECT 
      p.nombre AS producto,
      SUM(dp.cantidad) AS total_vendidos
    FROM detalle_pedido dp
    JOIN productos p ON dp.producto_id = p.producto_id
    GROUP BY dp.producto_id
    ORDER BY total_vendidos DESC
    LIMIT 5
  `);
  return rows;
}

module.exports = {
  contarUsuariosActivos,
  contarProductosPublicados,
  contarPedidos,
  calcularTotalIngresos,
  obtenerIngresosMensuales,
  obtenerTopProductosVendidos
};
