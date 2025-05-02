const db = require("../db/connection");

/**
 * 📋 Obtener todas las marcas activas, ordenadas por prioridad visual.
 * @returns {Promise<Array>}
 */
async function obtenerMarcasActivas() {
  const [rows] = await db.query(`
    SELECT * FROM marcas
    WHERE estado = 'activo'
    ORDER BY orden_visual ASC, nombre_marca ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener una marca por su ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerMarcaPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM marcas WHERE marca_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Insertar una nueva marca.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function insertarMarca({
  nombre_marca,
  slug_marca,
  descripcion = "",
  logo_url = null,
  micrositio_url = null,
  estado = "activo",
  orden_visual = 0,
  destacada = false
}) {
  await db.query(`
    INSERT INTO marcas (
      nombre_marca, slug_marca, descripcion,
      logo_url, micrositio_url, estado,
      orden_visual, destacada
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nombre_marca?.trim(),
    slug_marca?.trim(),
    descripcion?.trim(),
    logo_url?.trim() || null,
    micrositio_url?.trim() || null,
    estado,
    parseInt(orden_visual),
    Boolean(destacada)
  ]);
}

/**
 * ✏️ Actualizar los datos de una marca.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarMarca(id, datos) {
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
  const sql = `UPDATE marcas SET ${campos.join(", ")} WHERE marca_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar (soft delete) una marca.
 * @param {number} id
 * @returns {Promise<void>}
 */
async function desactivarMarca(id) {
  await db.query(`
    UPDATE marcas SET estado = 'inactivo' WHERE marca_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerMarcasActivas,
  obtenerMarcaPorId,
  insertarMarca,
  actualizarMarca,
  desactivarMarca
};
