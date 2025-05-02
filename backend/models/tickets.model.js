const db = require("../db/connection");

/* =============== TICKETS DE SOPORTE =============== */

/**
 * 📋 Obtener todos los tickets abiertos por usuario.
 */
async function obtenerTicketsPorUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM tickets_soporte
    WHERE usuario_id = ?
    ORDER BY fecha_creacion DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🔍 Obtener detalles de un ticket por ID.
 */
async function obtenerTicketPorId(ticket_id) {
  const [rows] = await db.query(`
    SELECT t.*, u.correo_electronico
    FROM tickets_soporte t
    JOIN usuarios u ON t.usuario_id = u.usuario_id
    WHERE t.ticket_id = ?
  `, [parseInt(ticket_id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo ticket de soporte.
 */
async function crearTicket({
  usuario_id,
  asunto,
  categoria = "general",
  prioridad = "media"
}) {
  await db.query(`
    INSERT INTO tickets_soporte (
      usuario_id, asunto, categoria, prioridad, estado, fecha_creacion
    ) VALUES (?, ?, ?, ?, 'abierto', NOW())
  `, [
    parseInt(usuario_id),
    asunto?.trim(),
    categoria,
    prioridad
  ]);
}

/**
 * ✏️ Cambiar el estado del ticket (cerrado, abierto, pendiente).
 */
async function actualizarEstadoTicket(ticket_id, estado) {
  await db.query(`
    UPDATE tickets_soporte SET estado = ? WHERE ticket_id = ?
  `, [estado, parseInt(ticket_id)]);
}

/* =============== MENSAJES DE TICKET =============== */

/**
 * 📋 Obtener mensajes de un ticket (historial).
 */
async function obtenerMensajesTicket(ticket_id) {
  const [rows] = await db.query(`
    SELECT * FROM mensajes_ticket
    WHERE ticket_id = ?
    ORDER BY fecha ASC
  `, [parseInt(ticket_id)]);
  return rows;
}

/**
 * ➕ Agregar mensaje a un ticket.
 */
async function registrarMensajeTicket({
  ticket_id,
  autor,
  tipo = "cliente",
  mensaje
}) {
  await db.query(`
    INSERT INTO mensajes_ticket (
      ticket_id, autor, tipo, mensaje, fecha
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    parseInt(ticket_id),
    autor?.trim(),
    tipo,
    mensaje?.trim()
  ]);
}

module.exports = {
  obtenerTicketsPorUsuario,
  obtenerTicketPorId,
  crearTicket,
  actualizarEstadoTicket,
  obtenerMensajesTicket,
  registrarMensajeTicket
};
