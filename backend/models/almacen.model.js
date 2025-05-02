const db = require("../db/connection");

/**
 * 📋 Obtener todos los almacenes activos.
 * @returns {Promise<Array>}
 */
async function obtenerAlmacenesActivos() {
  const [rows] = await db.query(`
    SELECT * FROM almacenes
    WHERE activo = 1
    ORDER BY nombre_almacen ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un almacén por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerAlmacenPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM almacenes WHERE almacen_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo almacén.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function crearAlmacen({
  nombre_almacen,
  tipo = "físico", // 'físico', 'virtual', 'proveedor'
  ubicacion = "",
  activo = true
}) {
  await db.query(`
    INSERT INTO almacenes (
      nombre_almacen,
      tipo,
      ubicacion,
      activo,
      fecha_creacion
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    nombre_almacen?.trim(),
    tipo,
    ubicacion?.trim(),
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar los datos de un almacén.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarAlmacen(id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(id));
  const sql = `UPDATE almacenes SET ${campos.join(", ")} WHERE almacen_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar un almacén (soft-delete funcional).
 * @param {number} id
 * @returns {Promise<void>}
 */
async function desactivarAlmacen(id) {
  await db.query(`
    UPDATE almacenes SET activo = 0 WHERE almacen_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerAlmacenesActivos,
  obtenerAlmacenPorId,
  crearAlmacen,
  actualizarAlmacen,
  desactivarAlmacen
};
