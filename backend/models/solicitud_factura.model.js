const db = require("../db/connection");

/**
 * 📋 Obtener solicitudes de factura por usuario.
 */
async function obtenerSolicitudesPorUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM solicitudes_factura
    WHERE usuario_id = ?
    ORDER BY fecha_solicitud DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 📋 Obtener todas las solicitudes pendientes (admin).
 */
async function obtenerSolicitudesPendientes() {
  const [rows] = await db.query(`
    SELECT sf.*, u.nombre, p.total
    FROM solicitudes_factura sf
    JOIN usuarios u ON sf.usuario_id = u.usuario_id
    JOIN pedidos p ON sf.pedido_id = p.pedido_id
    WHERE sf.estado = 'pendiente'
    ORDER BY sf.fecha_solicitud DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener una solicitud por ID.
 */
async function obtenerSolicitudPorId(solicitud_id) {
  const [rows] = await db.query(`
    SELECT * FROM solicitudes_factura WHERE solicitud_id = ?
  `, [parseInt(solicitud_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar nueva solicitud de factura.
 */
async function registrarSolicitud({
  pedido_id,
  usuario_id,
  rfc,
  razon_social,
  uso_cfdi,
  correo_receptor,
  comentario = ""
}) {
  await db.query(`
    INSERT INTO solicitudes_factura (
      pedido_id, usuario_id, rfc, razon_social,
      uso_cfdi, correo_receptor, comentario,
      estado, fecha_solicitud
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())
  `, [
    parseInt(pedido_id),
    parseInt(usuario_id),
    rfc?.trim(),
    razon_social?.trim(),
    uso_cfdi?.trim(),
    correo_receptor?.trim(),
    comentario?.trim()
  ]);
}

/**
 * ✏️ Actualizar estado de la solicitud (ej: procesada, rechazada).
 */
async function actualizarEstadoSolicitud(solicitud_id, nuevo_estado) {
  await db.query(`
    UPDATE solicitudes_factura
    SET estado = ?
    WHERE solicitud_id = ?
  `, [nuevo_estado, parseInt(solicitud_id)]);
}

module.exports = {
  obtenerSolicitudesPorUsuario,
  obtenerSolicitudesPendientes,
  obtenerSolicitudPorId,
  registrarSolicitud,
  actualizarEstadoSolicitud
};
