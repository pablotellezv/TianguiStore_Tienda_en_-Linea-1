const db = require("../db/connection"); // Conexión al pool de MySQL

/**
 * 📋 Obtener todas las marcas activas ordenadas por prioridad visual.
 * Esta función devuelve solo marcas cuyo estado sea 'activo'.
 * @returns {Promise<Array>} Lista de marcas activas
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
 * 🔍 Obtener una marca específica por su ID.
 * @param {number} id - ID de la marca
 * @returns {Promise<Object|null>} Objeto marca o null si no se encuentra
 */
async function obtenerMarcaPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM marcas
    WHERE marca_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Insertar una nueva marca en el sistema.
 * Todos los campos de texto son limpiados (trim).
 * @param {Object} datos - Datos de la nueva marca
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
 * ✏️ Actualizar una marca existente.
 * Solo actualiza campos que estén presentes en el objeto `datos`.
 * @param {number} id - ID de la marca a actualizar
 * @param {Object} datos - Campos a modificar
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

  if (campos.length === 0) return; // No hay nada que actualizar

  valores.push(parseInt(id));
  const sql = `UPDATE marcas SET ${campos.join(", ")} WHERE marca_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar una marca (soft delete).
 * Cambia el campo `estado` a 'inactivo' sin eliminar el registro físicamente.
 * @param {number} id - ID de la marca
 * @returns {Promise<void>}
 */
async function desactivarMarca(id) {
  await db.query(`
    UPDATE marcas
    SET estado = 'inactivo'
    WHERE marca_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerMarcasActivas,
  obtenerMarcaPorId,
  insertarMarca,
  actualizarMarca,
  desactivarMarca
};
