const db = require("../db/connection");

/* ════════════════════════════════════════════════════════
   📦 PEDIDOS: Funciones principales del sistema
   ════════════════════════════════════════════════════════ */

/**
 * 📋 Obtener todos los pedidos activos (solo no borrados)
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
 * 🔍 Obtener pedidos por usuario autenticado
 */
async function obtenerMisPedidos(usuario_id) {
  const [rows] = await db.query(`
    SELECT p.*, 
           e.estado_nombre
    FROM pedidos p
    JOIN estados_pedido e ON p.estado_id = e.estado_id
    WHERE p.usuario_id = ? AND p.borrado_logico = 0
    ORDER BY p.fecha_pedido DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🧾 Crear pedido completo desde frontend (usando SP)
 * Utiliza: sp_crear_pedido_completo
 */
async function crearPedidoConSP({
  usuario_id,
  total,
  metodo_pago,
  cupon = null,
  direccion_envio = "",
  notas = "",
  productos = []
}) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error("⚠️ La lista de productos está vacía o mal formateada.");
  }

  const productos_json = JSON.stringify(productos);

  const [resultado] = await db.query(`
    CALL sp_crear_pedido_completo(?, ?, ?, ?, ?, ?, ?)
  `, [
    parseInt(usuario_id),
    parseFloat(total),
    metodo_pago?.trim(),
    cupon,
    direccion_envio.trim(),
    notas.trim(),
    productos_json
  ]);

  const pedido_id = resultado?.[0]?.pedido_id || resultado?.[0]?.[0]?.pedido_id || null;

  if (!pedido_id) {
    throw new Error("⚠️ El procedimiento almacenado no devolvió un ID válido.");
  }

  return pedido_id;
}

/* ════════════════════════════════════════════════════════
   ⚙️ Gestión y mantenimiento de pedidos
   ════════════════════════════════════════════════════════ */

/**
 * ✏️ Actualizar el estado de un pedido
 */
async function actualizarEstadoPedido(pedido_id, estado_id) {
  await db.query(`
    UPDATE pedidos SET estado_id = ? WHERE pedido_id = ?
  `, [parseInt(estado_id), parseInt(pedido_id)]);
}

/**
 * ❌ Borrado lógico de un pedido
 */
async function borrarPedidoLogico(pedido_id) {
  await db.query(`
    UPDATE pedidos SET borrado_logico = 1 WHERE pedido_id = ?
  `, [parseInt(pedido_id)]);
}

/**
 * 🔍 Obtener pedido por ID y verificar si pertenece al usuario
 */
async function obtenerPedidoPorId(pedido_id, usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM pedidos 
    WHERE pedido_id = ? AND usuario_id = ? AND borrado_logico = 0
  `, [parseInt(pedido_id), parseInt(usuario_id)]);

  return rows[0] || null;
}

/**
 * 📦 Obtener productos de un pedido validando acceso por usuario o rol
 */
async function obtenerProductosPorPedido(pedido_id, usuario_id, rol = "cliente") {
  const isAdmin = ["admin", "soporte"].includes(rol);

  const query = `
    SELECT dp.producto_id, p.nombre, dp.cantidad, dp.precio_unitario
    FROM detalle_pedido dp
    JOIN productos p ON dp.producto_id = p.producto_id
    JOIN pedidos ped ON dp.pedido_id = ped.pedido_id
    WHERE dp.pedido_id = ?
    ${isAdmin ? "" : "AND ped.usuario_id = ?"}
  `;

  const params = isAdmin ? [pedido_id] : [pedido_id, usuario_id];

  const [rows] = await db.query(query, params);

  return rows.length > 0 ? rows : null;
}

/* ════════════════════════════════════════════════════════
   🛒 Funciones relacionadas al carrito
   ════════════════════════════════════════════════════════ */

/**
 * 🔢 Calcular total del carrito de un usuario
 */
async function calcularTotalCarrito(usuario_id) {
  const [[{ total }]] = await db.query(`
    SELECT SUM(c.cantidad * p.precio) AS total
    FROM carrito c
    JOIN productos p ON c.producto_id = p.producto_id
    WHERE c.usuario_id = ?
  `, [parseInt(usuario_id)]);

  return total || 0;
}

/**
 * 🧾 Obtener productos del carrito de un usuario
 */
async function obtenerCarrito(usuario_id) {
  const [rows] = await db.query(`
    SELECT 
      c.producto_id,
      c.cantidad,
      p.precio AS precio_unitario
    FROM carrito c
    JOIN productos p ON c.producto_id = p.producto_id
    WHERE c.usuario_id = ?
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🧹 Vaciar el carrito de un usuario después de crear pedido
 */
async function limpiarCarrito(usuario_id) {
  await db.query(`
    DELETE FROM carrito WHERE usuario_id = ?
  `, [parseInt(usuario_id)]);
}

module.exports = {
  obtenerPedidos,
  obtenerMisPedidos,
  crearPedidoConSP,
  actualizarEstadoPedido,
  borrarPedidoLogico,
  obtenerPedidoPorId,
  obtenerProductosPorPedido,
  calcularTotalCarrito,
  limpiarCarrito,
  obtenerCarrito
};
