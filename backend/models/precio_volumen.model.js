const db = require("../db/connection");

/**
 * 📋 Obtener todos los precios por volumen activos para un producto.
 * Ordenados por cantidad mínima ascendente.
 */
async function obtenerPreciosPorProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM precios_por_volumen
    WHERE producto_id = ? AND activo = 1
    ORDER BY cantidad_minima ASC
  `, [parseInt(producto_id)]);
  return rows;
}

/**
 * 🔍 Obtener un precio escalonado por ID.
 */
async function obtenerPrecioPorId(precio_id) {
  const [rows] = await db.query(`
    SELECT * FROM precios_por_volumen WHERE precio_id = ?
  `, [parseInt(precio_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar nuevo precio por volumen para un producto.
 */
async function registrarPrecioPorVolumen({
  producto_id,
  cantidad_minima,
  cantidad_maxima = null,
  precio_unitario,
  activo = true
}) {
  await db.query(`
    INSERT INTO precios_por_volumen (
      producto_id, cantidad_minima, cantidad_maxima, precio_unitario, activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `, [
    parseInt(producto_id),
    parseInt(cantidad_minima),
    cantidad_maxima !== null ? parseInt(cantidad_maxima) : null,
    parseFloat(precio_unitario),
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar precio por volumen.
 */
async function actualizarPrecioVolumen(precio_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        typeof valor === "string" ? valor.trim() :
        typeof valor === "number" ? valor :
        valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(precio_id));
  const sql = `UPDATE precios_por_volumen SET ${campos.join(", ")} WHERE precio_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar un precio (soft delete).
 */
async function desactivarPrecio(precio_id) {
  await db.query(`
    UPDATE precios_por_volumen SET activo = 0 WHERE precio_id = ?
  `, [parseInt(precio_id)]);
}

module.exports = {
  obtenerPreciosPorProducto,
  obtenerPrecioPorId,
  registrarPrecioPorVolumen,
  actualizarPrecioVolumen,
  desactivarPrecio
};
