const db = require("../db/connection");

/**
 * 📋 Obtener todos los roles registrados.
 * @returns {Promise<Array>}
 */
async function obtenerRoles() {
  const [rows] = await db.query(`
    SELECT * FROM roles ORDER BY rol_id ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un rol por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerRolPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM roles WHERE rol_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo rol.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function crearRol({ rol_nombre, descripcion = "", permisos_json = {} }) {
  await db.query(`
    INSERT INTO roles (rol_nombre, descripcion, permisos_json)
    VALUES (?, ?, ?)
  `, [
    rol_nombre?.trim(),
    descripcion?.trim(),
    JSON.stringify(permisos_json)
  ]);
}

/**
 * ✏️ Actualizar un rol existente.
 * @param {number} id
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function actualizarRol(id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        clave === "permisos_json" ? JSON.stringify(valor) :
        typeof valor === "string" ? valor.trim() :
        valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(id));
  const sql = `UPDATE roles SET ${campos.join(", ")} WHERE rol_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Eliminar un rol (solo si no está en uso).
 * @param {number} id
 * @returns {Promise<void>}
 */
async function eliminarRol(id) {
  await db.query(`
    DELETE FROM roles WHERE rol_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol
};
