const db = require("../db/connection");

//
// 📈 MÉTRICAS DE USUARIOS
//

/**
 * Top usuarios por puntos y nivel.
 */
async function obtenerVistaTopUsuarios(limit = 10) {
  const [rows] = await db.query(`
    SELECT * FROM vista_top_usuarios
    ORDER BY nivel DESC, puntos DESC
    LIMIT ?
  `, [parseInt(limit)]);
  return rows;
}

/**
 * Usuarios con mayor fidelidad o influencia.
 */
async function obtenerVistaUsuariosInfluyentes(limit = 10) {
  const [rows] = await db.query(`
    SELECT * FROM reporte_usuarios_influyentes
    ORDER BY indice_influencia DESC
    LIMIT ?
  `, [parseInt(limit)]);
  return rows;
}

//
// 🛍️ MÉTRICAS DE PRODUCTOS Y VENTAS
//

/**
 * Total de ventas agrupadas por categoría.
 */
async function obtenerVentasPorCategoria() {
  const [rows] = await db.query(`
    SELECT * FROM vista_ventas_por_categoria
    ORDER BY total_ventas DESC
  `);
  return rows;
}

/**
 * Ventas agrupadas por método de pago.
 */
async function obtenerVentasPorMetodoPago() {
  const [rows] = await db.query(`
    SELECT * FROM reporte_ventas_por_metodo_pago
  `);
  return rows;
}

/**
 * Campañas activas y su desempeño.
 */
async function obtenerVistaCampanasActivas() {
  const [rows] = await db.query(`
    SELECT * FROM vista_campanas_activas
    ORDER BY fecha_inicio DESC
  `);
  return rows;
}

/**
 * Resumen de ventas por campaña.
 */
async function obtenerVentasPorCampana() {
  const [rows] = await db.query(`
    SELECT * FROM vista_ventas_por_campana
  `);
  return rows;
}

//
// 🎮 GAMIFICACIÓN Y MISIONES
//

/**
 * Vista de progreso de misiones por usuario.
 */
async function obtenerProgresoMisionesUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM vista_progreso_misiones
    WHERE usuario_id = ?
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * Logros más obtenidos por usuarios.
 */
async function obtenerVistaLogrosComunes() {
  const [rows] = await db.query(`
    SELECT * FROM vista_logros_comunes
    ORDER BY veces_obtenido DESC
  `);
  return rows;
}

//
// 📦 INVENTARIO Y STOCK
//

/**
 * Vista de stock actual por producto.
 */
async function obtenerVistaStockActual() {
  const [rows] = await db.query(`
    SELECT * FROM vista_stock_actual
    ORDER BY producto_id ASC
  `);
  return rows;
}

//
// 🧾 FINANZAS Y CONTABILIDAD
//

/**
 * Balance general contable (activo vs pasivo).
 */
async function obtenerBalanceGeneral() {
  const [rows] = await db.query(`
    SELECT * FROM vista_balance_general
  `);
  return rows;
}

/**
 * Estado de resultados del sistema.
 */
async function obtenerEstadoResultados() {
  const [rows] = await db.query(`
    SELECT * FROM vista_estado_resultados
  `);
  return rows;
}

//
// 🎁 PUNTOS Y CANJES
//

/**
 * Vista de puntos expirados por usuario.
 */
async function obtenerVistaPuntosExpirados() {
  const [rows] = await db.query(`
    SELECT * FROM vista_puntos_expirados
    ORDER BY dias_vencidos DESC
  `);
  return rows;
}

/**
 * Historial de canjes realizados.
 */
async function obtenerVistaHistorialCanjes() {
  const [rows] = await db.query(`
    SELECT * FROM vista_historial_canjes
    ORDER BY fecha_canje DESC
  `);
  return rows;
}

module.exports = {
  // Usuarios
  obtenerVistaTopUsuarios,
  obtenerVistaUsuariosInfluyentes,

  // Productos y ventas
  obtenerVentasPorCategoria,
  obtenerVentasPorMetodoPago,
  obtenerVistaCampanasActivas,
  obtenerVentasPorCampana,

  // Gamificación
  obtenerProgresoMisionesUsuario,
  obtenerVistaLogrosComunes,

  // Inventario
  obtenerVistaStockActual,

  // Finanzas
  obtenerBalanceGeneral,
  obtenerEstadoResultados,

  // Puntos
  obtenerVistaPuntosExpirados,
  obtenerVistaHistorialCanjes
};
