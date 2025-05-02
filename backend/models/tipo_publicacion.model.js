const db = require("../db/connection");

/**
 * 📋 Obtener todos los tipos de publicación activos.
 * @returns {Promise<Array>}
 */
async function obtenerTiposPublicacionActivos() {
  const [rows] = await db.query(`
    SELECT * FROM tipos_publicacion
    WHERE estado = 'activo'
    ORDER BY nombre_tipo ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un tipo de publicación por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerTipoPublicacionPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM tipos_publicacion WHERE tipo_publicacion_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo tipo de publicación.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function crearTipoPublicacion({
  nombre_tipo,
  descripcion = "",
  estado = "activo"
}) {
  await db.query(`
    INSERT INTO tipos_publicacion (
      nombre_tipo, descripcion, estado, fecha_creacion
    ) VALUES (?, ?, ?, NOW())
  `, [
    nombre_tipo?.trim(),
    descripcion?.trim(),
    estado
  ]);
}

/**
 * ✏️ Actualizar un tipo de publicación.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarTipoPublicacion(id, datos) {
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
  const sql = `UPDATE tipos_publicacion SET ${campos.join(", ")} WHERE tipo_publicacion_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar un tipo de publicación (soft delete).
 * @param {number} id
 * @returns {Promise<void>}
 */
async function desactivarTipoPublicacion(id) {
  await db.query(`
    UPDATE tipos_publicacion SET estado = 'inactivo' WHERE tipo_publicacion_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerTiposPublicacionActivos,
  obtenerTipoPublicacionPorId,
  crearTipoPublicacion,
  actualizarTipoPublicacion,
  desactivarTipoPublicacion
};
