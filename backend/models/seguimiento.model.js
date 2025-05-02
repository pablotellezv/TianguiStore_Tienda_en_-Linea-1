const db = require("../db/connection");

/* =============== SEGUIMIENTO DE PEDIDO =============== */

/**
 * 📋 Obtener historial de seguimiento de un pedido.
 */
async function obtenerSeguimientoPorPedido(pedido_id) {
  const [rows] = await db.query(`
    SELECT s.*, e.estado_nombre
    FROM seguimiento_pedidos s
    JOIN estados_pedido e ON s.estado_id = e.estado_id
    WHERE s.pedido_id = ?
    ORDER BY s.fecha ASC
  `, [parseInt(pedido_id)]);
  return rows;
}

/**
 * ➕ Agregar registro de seguimiento a un pedido.
 */
async function registrarSeguimiento({
  pedido_id,
  estado_id,
  descripcion = "",
  creado_por = "sistema"
}) {
  await db.query(`
    INSERT INTO seguimiento_pedidos (
      pedido_id, estado_id, descripcion, creado_por, fecha
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    parseInt(pedido_id),
    parseInt(estado_id),
    descripcion?.trim(),
    creado_por?.trim()
  ]);
}

/* =============== MENSAJES DE PEDIDO =============== */

/**
 * 📋 Obtener mensajes relacionados a un pedido.
 */
async function obtenerMensajesPorPedido(pedido_id) {
  const [rows] = await db.query(`
    SELECT * FROM mensajes_pedido
    WHERE pedido_id = ?
    ORDER BY fecha ASC
  `, [parseInt(pedido_id)]);
  return rows;
}

/**
 * ➕ Agregar un nuevo mensaje a un pedido.
 */
async function registrarMensajePedido({
  pedido_id,
  autor,
  mensaje,
  tipo = "cliente"
}) {
  await db.query(`
    INSERT INTO mensajes_pedido (
      pedido_id, autor, mensaje, tipo, fecha
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    parseInt(pedido_id),
    autor?.trim(),
    mensaje?.trim(),
    tipo
  ]);
}

module.exports = {
  obtenerSeguimientoPorPedido,
  registrarSeguimiento,
  obtenerMensajesPorPedido,
  registrarMensajePedido
};
