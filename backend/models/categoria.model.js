const db = require("../db/connection");

/**
 * 📋 Obtener todas las categorías activas (ordenadas por orden_visual y nombre).
 * @returns {Promise<Array>}
 */
async function obtenerCategoriasActivas() {
  const [rows] = await db.query(`
    SELECT * FROM categorias
    WHERE estado = 'activa'
    ORDER BY orden_visual ASC, nombre_categoria ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener una categoría por su ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerCategoriaPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM categorias WHERE categoria_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Insertar una nueva categoría.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function insertarCategoria(datos) {
  const {
    nombre_categoria,
    slug_categoria,
    descripcion = "",
    icono_url = null,
    estado = "activa",
    orden_visual = 0,
    destacada = false
  } = datos;

  await db.query(`
    INSERT INTO categorias (
      nombre_categoria, slug_categoria, descripcion,
      icono_url, estado, orden_visual, destacada
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    nombre_categoria?.trim(),
    slug_categoria?.trim(),
    descripcion?.trim(),
    icono_url?.trim() || null,
    estado,
    parseInt(orden_visual),
    Boolean(destacada)
  ]);
}

/**
 * ✏️ Actualizar una categoría por su ID.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarCategoria(id, datos) {
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
  const sql = `UPDATE categorias SET ${campos.join(", ")} WHERE categoria_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar (soft delete) una categoría.
 * @param {number} id
 * @returns {Promise<void>}
 */
async function desactivarCategoria(id) {
  await db.query(`
    UPDATE categorias SET estado = 'inactiva' WHERE categoria_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerCategoriasActivas,
  obtenerCategoriaPorId,
  insertarCategoria,
  actualizarCategoria,
  desactivarCategoria
};
