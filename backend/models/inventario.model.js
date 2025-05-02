const db = require("../db/connection");

/**
 * 📋 Obtener todo el inventario actual con nombres de producto y almacén.
 * @returns {Promise<Array>}
 */
async function obtenerInventario() {
  const [rows] = await db.query(`
    SELECT i.*, 
           p.nombre AS nombre_producto, 
           a.nombre_almacen AS nombre_almacen
    FROM inventario_productos i
    JOIN productos p ON i.producto_id = p.producto_id
    JOIN almacenes a ON i.almacen_id = a.almacen_id
    ORDER BY i.fecha_actualizacion DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener inventario de un producto en un almacén específico.
 * @param {number} producto_id
 * @param {number} almacen_id
 * @returns {Promise<Object|null>}
 */
async function obtenerInventarioPorProductoYAlmacen(producto_id, almacen_id) {
  const [rows] = await db.query(`
    SELECT * FROM inventario_productos
    WHERE producto_id = ? AND almacen_id = ?
  `, [parseInt(producto_id), parseInt(almacen_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar una nueva línea de inventario (producto en almacén).
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function registrarInventario({
  producto_id,
  almacen_id,
  stock_actual = 0,
  stock_minimo = 0,
  stock_maximo = 0
}) {
  await db.query(`
    INSERT INTO inventario_productos (
      producto_id, almacen_id, stock_actual, stock_minimo, stock_maximo, ultimo_ingreso
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `, [
    parseInt(producto_id),
    parseInt(almacen_id),
    parseInt(stock_actual),
    parseInt(stock_minimo),
    parseInt(stock_maximo)
  ]);
}

/**
 * ✏️ Actualizar niveles de inventario.
 * @param {number} inventario_id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarInventario(inventario_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(inventario_id));
  const sql = `UPDATE inventario_productos SET ${campos.join(", ")} WHERE inventario_id = ?`;
  await db.query(sql, valores);
}

/**
 * 📉 Registrar salida de stock.
 * @param {number} inventario_id
 * @param {number} cantidad
 */
async function registrarSalidaStock(inventario_id, cantidad) {
  await db.query(`
    UPDATE inventario_productos
    SET stock_actual = GREATEST(stock_actual - ?, 0),
        ultima_salida = NOW()
    WHERE inventario_id = ?
  `, [parseInt(cantidad), parseInt(inventario_id)]);
}

/**
 * 📦 Registrar ingreso de stock.
 * @param {number} inventario_id
 * @param {number} cantidad
 */
async function registrarIngresoStock(inventario_id, cantidad) {
  await db.query(`
    UPDATE inventario_productos
    SET stock_actual = stock_actual + ?,
        ultimo_ingreso = NOW()
    WHERE inventario_id = ?
  `, [parseInt(cantidad), parseInt(inventario_id)]);
}

module.exports = {
  obtenerInventario,
  obtenerInventarioPorProductoYAlmacen,
  registrarInventario,
  actualizarInventario,
  registrarIngresoStock,
  registrarSalidaStock
};
