const db = require("../db/connection");

/**
 * 📋 Obtener todos los pedidos no eliminados.
 * Incluye estado y correo del usuario.
 */
async function obtenerPedidos() {
  const [rows] = await db.query(`
    SELECT p.*, 
           u.correo_electronico, 
           CONCAT(u.nombre, ' ', u.apellido_paterno) AS nombre_usuario, 
           e.estado_nombre
    FROM pedidos p
    JOIN usuarios u ON p.usuario_id = u.usuario_id
    JOIN estados_pedido e ON p.estado_id = e.estado_id
    WHERE p.borrado_logico = 0
    ORDER BY p.fecha_pedido DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener pedidos del usuario autenticado.
 * @param {number} usuario_id - ID del usuario autenticado
 */
async function obtenerMisPedidos(usuario_id) {
  const [rows] = await db.query(`
    SELECT p.*, 
           e.estado_nombre
    FROM pedidos p
    JOIN estados_pedido e ON p.estado_id = e.estado_id
    WHERE p.usuario_id = ? AND p.borrado_logico = 0
    ORDER BY p.fecha_pedido DESC
  `, [usuario_id]);
  return rows;
}

/**
 * ➕ Crear un nuevo pedido utilizando el procedimiento almacenado.
 * @param {Object} datos
 */
async function crearPedidoConSP({ usuario_id, total, metodo_pago, cupon, direccion_envio, notas }) {
  const [resultado] = await db.query(`
    CALL sp_crear_pedido_completo(?, ?, ?, ?, ?, ?)
  `, [
    parseInt(usuario_id),
    parseFloat(total),
    metodo_pago,
    cupon,
    direccion_envio?.trim(),
    notas?.trim()
  ]);

  const pedido_id = resultado?.[0]?.pedido_id ?? null;

  if (!pedido_id) {
    throw new Error("No se pudo crear el pedido. Verifica los datos.");
  }

  return pedido_id;
}

/**
 * ✏️ Actualizar el estado de un pedido.
 * @param {number} pedido_id
 * @param {number} estado_id
 */
async function actualizarEstadoPedido(pedido_id, estado_id) {
  await db.query(`
    UPDATE pedidos SET estado_id = ? WHERE pedido_id = ?
  `, [parseInt(estado_id), parseInt(pedido_id)]);
}

/**
 * 🗑️ Marcar pedido como borrado (borrado lógico).
 * @param {number} pedido_id
 */
async function borrarPedidoLogico(pedido_id) {
  await db.query(`
    UPDATE pedidos SET borrado_logico = 1 WHERE pedido_id = ?
  `, [parseInt(pedido_id)]);
}

/**
 * 🔢 Calcular el total del carrito del usuario.
 * @param {number} usuario_id
 * @returns {Promise<number>} Total del carrito.
 */
async function calcularTotalCarrito(usuario_id) {
  const [[{ total }]] = await db.query(`
    SELECT SUM(c.cantidad * p.precio) AS total
    FROM carrito c
    JOIN productos p ON c.producto_id = p.producto_id
    WHERE c.usuario_id = ?
  `, [usuario_id]);

  return total;
}

/**
 * 🧹 Limpiar el carrito después de un pedido.
 * @param {number} usuario_id
 */
async function limpiarCarrito(usuario_id) {
  await db.query(`
    DELETE FROM carrito WHERE usuario_id = ?
  `, [usuario_id]);
}

module.exports = {
  obtenerPedidos,
  obtenerMisPedidos,
  crearPedidoConSP,
  actualizarEstadoPedido,
  borrarPedidoLogico,
  calcularTotalCarrito,
  limpiarCarrito
};
