const db = require("../db/connection");

/**
 * 📋 Obtener el ranking completo de promotores.
 */
async function obtenerRankingPromotores(limit = 20) {
  const [rows] = await db.query(`
    SELECT rp.*, u.nombre, u.correo_electronico
    FROM ranking_promotores rp
    JOIN usuarios u ON rp.promotor_id = u.usuario_id
    ORDER BY rp.total_ventas DESC
    LIMIT ?
  `, [parseInt(limit)]);
  return rows;
}

/**
 * 🔍 Obtener datos de ranking de un promotor específico.
 */
async function obtenerPromotorPorId(promotor_id) {
  const [rows] = await db.query(`
    SELECT rp.*, u.nombre, u.correo_electronico
    FROM ranking_promotores rp
    JOIN usuarios u ON rp.promotor_id = u.usuario_id
    WHERE rp.promotor_id = ?
  `, [parseInt(promotor_id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear o actualizar información de un promotor.
 */
async function actualizarRankingPromotor({
  promotor_id,
  total_ventas,
  pedidos_referidos,
  clientes_referidos,
  nivel_promotor
}) {
  await db.query(`
    INSERT INTO ranking_promotores (
      promotor_id, total_ventas, pedidos_referidos, 
      clientes_referidos, nivel_promotor, ultima_actualizacion
    ) VALUES (?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      total_ventas = VALUES(total_ventas),
      pedidos_referidos = VALUES(pedidos_referidos),
      clientes_referidos = VALUES(clientes_referidos),
      nivel_promotor = VALUES(nivel_promotor),
      ultima_actualizacion = NOW()
  `, [
    parseInt(promotor_id),
    parseFloat(total_ventas),
    parseInt(pedidos_referidos),
    parseInt(clientes_referidos),
    nivel_promotor?.trim()
  ]);
}

/**
 * ✏️ Incrementar métricas de promotor (ventas, clientes).
 */
async function incrementarMetricasPromotor({
  promotor_id,
  venta = 0,
  pedido = 0,
  cliente = 0
}) {
  await db.query(`
    UPDATE ranking_promotores
    SET 
      total_ventas = total_ventas + ?,
      pedidos_referidos = pedidos_referidos + ?,
      clientes_referidos = clientes_referidos + ?,
      ultima_actualizacion = NOW()
    WHERE promotor_id = ?
  `, [
    parseFloat(venta),
    parseInt(pedido),
    parseInt(cliente),
    parseInt(promotor_id)
  ]);
}

module.exports = {
  obtenerRankingPromotores,
  obtenerPromotorPorId,
  actualizarRankingPromotor,
  incrementarMetricasPromotor
};
