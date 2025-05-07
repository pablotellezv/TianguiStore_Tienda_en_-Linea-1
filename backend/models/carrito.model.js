const db = require("../db/connection");

/**
 * 📦 Obtener todos los productos del carrito de un usuario (con nombre y precio del producto)
 */
async function obtenerCarritoPorUsuario(usuario_id) {
  const [resultados] = await db.query(`
    SELECT c.id, c.cantidad, p.nombre AS producto_nombre, p.precio AS producto_precio
    FROM carrito c
    JOIN productos p ON c.producto_id = p.producto_id
    WHERE c.usuario_id = ?
  `, [usuario_id]);

  return resultados;
}

/**
 * 🔍 Buscar si un producto ya está en el carrito del usuario
 */
async function buscarProductoEnCarrito(usuario_id, producto_id) {
  const [resultados] = await db.query(`
    SELECT cantidad FROM carrito
    WHERE usuario_id = ? AND producto_id = ?
  `, [usuario_id, producto_id]);

  return resultados[0] || null;
}

/**
 * ➕ Insertar nuevo producto al carrito del usuario
 */
async function agregarProducto(usuario_id, producto_id, cantidad) {
  await db.query(`
    INSERT INTO carrito (usuario_id, producto_id, cantidad)
    VALUES (?, ?, ?)
  `, [usuario_id, producto_id, cantidad]);
}

/**
 * 🔄 Actualizar la cantidad de un producto ya existente en el carrito
 */
async function actualizarCantidad(usuario_id, producto_id, nuevaCantidad) {
  await db.query(`
    UPDATE carrito
    SET cantidad = ?
    WHERE usuario_id = ? AND producto_id = ?
  `, [nuevaCantidad, usuario_id, producto_id]);
}

/**
 * 🗑️ Eliminar un producto específico del carrito (por ID interno del registro)
 */
async function eliminarProductoPorId(id, usuario_id) {
  await db.query(`
    DELETE FROM carrito
    WHERE id = ? AND usuario_id = ?
  `, [id, usuario_id]);
}

/**
 * 🧺 Eliminar todos los productos del carrito de un usuario
 */
async function vaciarCarritoPorUsuario(usuario_id) {
  await db.query(`
    DELETE FROM carrito
    WHERE usuario_id = ?
  `, [usuario_id]);
}

module.exports = {
  obtenerCarritoPorUsuario,
  buscarProductoEnCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProductoPorId,
  vaciarCarritoPorUsuario
};
