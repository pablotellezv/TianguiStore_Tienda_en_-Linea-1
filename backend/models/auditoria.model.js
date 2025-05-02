const db = require("../db/connection");

/* =============== AUDITORÍA DE BORRADO =============== */

/**
 * 📋 Obtener registros de auditoría por entidad.
 */
async function obtenerAuditoriaPorEntidad(entidad) {
  const [rows] = await db.query(`
    SELECT * FROM auditoria_borrado
    WHERE entidad = ?
    ORDER BY fecha DESC
  `, [entidad?.trim()]);
  return rows;
}

/**
 * ➕ Registrar acción de auditoría (por eliminación lógica/física).
 */
async function registrarAuditoriaBorrado({
  entidad,
  entidad_id,
  accion,
  comentario = ""
}) {
  await db.query(`
    INSERT INTO auditoria_borrado (
      entidad, entidad_id, accion, fecha, comentario
    ) VALUES (?, ?, ?, NOW(), ?)
  `, [
    entidad?.trim(),
    parseInt(entidad_id),
    accion?.trim(),
    comentario?.trim()
  ]);
}

/* =============== LOG DE ACTIVIDAD =============== */

/**
 * 📋 Obtener logs recientes por usuario.
 */
async function obtenerLogActividadPorUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM log_actividad
    WHERE usuario_id = ?
    ORDER BY fecha DESC
    LIMIT 100
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * ➕ Registrar acción en el log de actividad.
 */
async function registrarLogActividad({
  usuario_id,
  accion,
  detalle = "",
  ip_origen = "",
  user_agent = ""
}) {
  await db.query(`
    INSERT INTO log_actividad (
      usuario_id, accion, detalle, ip_origen, user_agent, fecha
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `, [
    parseInt(usuario_id),
    accion?.trim(),
    detalle?.trim(),
    ip_origen,
    user_agent
  ]);
}

module.exports = {
  obtenerAuditoriaPorEntidad,
  registrarAuditoriaBorrado,
  obtenerLogActividadPorUsuario,
  registrarLogActividad
};
