const db = require("../db/connection");

/* =============== PUNTOS DEL USUARIO =============== */

/**
 * 📋 Obtener puntos acumulados de un usuario (activos y no expirados).
 */
async function obtenerPuntosActivos(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM puntos_usuario
    WHERE usuario_id = ? AND estado = 'activos'
      AND (fecha_expiracion IS NULL OR CURDATE() <= fecha_expiracion)
    ORDER BY fecha_obtenido DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 📊 Obtener resumen total de puntos (por estado).
 */
async function resumenPuntosUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT estado, SUM(puntos) AS total
    FROM puntos_usuario
    WHERE usuario_id = ?
    GROUP BY estado
  `, [parseInt(usuario_id)]);

  const resumen = { activos: 0, redimidos: 0, expirados: 0 };
  for (const row of rows) {
    resumen[row.estado] = row.total;
  }
  return resumen;
}

/**
 * ➕ Registrar puntos para un usuario.
 */
async function otorgarPuntos({
  usuario_id,
  tipo_evento,
  puntos,
  fecha_expiracion = null
}) {
  await db.query(`
    INSERT INTO puntos_usuario (
      usuario_id, tipo_evento, puntos, fecha_obtenido, fecha_expiracion, estado
    ) VALUES (?, ?, ?, NOW(), ?, 'activos')
  `, [
    parseInt(usuario_id),
    tipo_evento?.trim(),
    parseInt(puntos),
    fecha_expiracion
  ]);
}

/**
 * ✏️ Marcar puntos como expirados (puede usarse en evento programado).
 */
async function expirarPuntos() {
  await db.query(`
    UPDATE puntos_usuario
    SET estado = 'expirados'
    WHERE estado = 'activos' 
      AND fecha_expiracion IS NOT NULL
      AND CURDATE() > fecha_expiracion
  `);
}

/* =============== CANJE DE PUNTOS =============== */

/**
 * 📦 Registrar canje de puntos por cupón.
 */
async function canjearPuntos({
  usuario_id,
  cupon_id = null,
  puntos_utilizados,
  puntos_id = null
}) {
  await db.query(`
    INSERT INTO canjes_puntos (
      usuario_id, puntos_id, cupon_id, puntos_utilizados, fecha_canje
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    parseInt(usuario_id),
    puntos_id ? parseInt(puntos_id) : null,
    cupon_id ? parseInt(cupon_id) : null,
    parseInt(puntos_utilizados)
  ]);

  if (puntos_id) {
    await db.query(`
      UPDATE puntos_usuario SET estado = 'redimidos' WHERE puntos_id = ?
    `, [parseInt(puntos_id)]);
  }
}

/**
 * 📋 Obtener historial de canjes por usuario.
 */
async function obtenerCanjesPorUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT c.*, cu.codigo AS codigo_cupon
    FROM canjes_puntos c
    LEFT JOIN cupones cu ON c.cupon_id = cu.cupon_id
    WHERE c.usuario_id = ?
    ORDER BY fecha_canje DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

module.exports = {
  obtenerPuntosActivos,
  resumenPuntosUsuario,
  otorgarPuntos,
  expirarPuntos,
  canjearPuntos,
  obtenerCanjesPorUsuario
};
