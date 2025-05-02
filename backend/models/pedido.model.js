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
 * 🔍 Obtener un pedido completo por ID, incluyendo detalles de productos.
 * @param {number} id - ID del pedido.
 * @returns {Promise<Object|null>}
 */
async function obtenerPedidoPorId(id) {
  const [pedido] = await db.query(`
    SELECT p.*, 
           e.estado_nombre, 
           u.nombre, 
           u.correo_electronico
    FROM pedidos p
    JOIN estados_pedido e ON p.estado_id = e.estado_id
    JOIN usuarios u ON p.usuario_id = u.usuario_id
    WHERE p.pedido_id = ? AND p.borrado_logico = 0
  `, [parseInt(id)]);

  if (pedido.length === 0) return null;

  const [detalles] = await db.query(`
    SELECT dp.*, pr.nombre AS nombre_producto
    FROM detalle_pedido dp
    JOIN productos pr ON dp.producto_id = pr.producto_id
    WHERE dp.pedido_id = ?
  `, [parseInt(id)]);

  return {
    ...pedido[0],
    productos: detalles
  };
}

/**
 * ➕ Crear un nuevo pedido usando el procedimiento almacenado `sp_crear_pedido_completo`.
 * @param {Object} datos
 * @param {number} datos.usuario_id
 * @param {number} datos.total
 * @param {string} datos.metodo_pago
 * @param {string|null} datos.cupon
 * @param {string} datos.direccion_envio
 * @param {string} [datos.notas]
 * @returns {Promise<number>} pedido_id generado
 */
async function crearPedidoConSP({
  usuario_id,
  total,
  metodo_pago,
  cupon = null,
  direccion_envio,
  notas = ""
}) {
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

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedidoConSP,
  actualizarEstadoPedido,
  borrarPedidoLogico
};
