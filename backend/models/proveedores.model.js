const db = require("../db/connection");

/**
 * 📋 Obtener todos los proveedores activos.
 */
async function obtenerProveedoresActivos() {
  const [rows] = await db.query(`
    SELECT * FROM proveedores
    WHERE activo = 1
    ORDER BY nombre_proveedor ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un proveedor por ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerProveedorPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM proveedores WHERE proveedor_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar un nuevo proveedor.
 * @param {Object} datos
 */
async function crearProveedor({
  nombre_proveedor,
  razon_social = "",
  rfc = "",
  telefono = "",
  correo_electronico = "",
  direccion = "",
  activo = true
}) {
  await db.query(`
    INSERT INTO proveedores (
      nombre_proveedor, razon_social, rfc,
      telefono, correo_electronico, direccion,
      activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    nombre_proveedor?.trim(),
    razon_social?.trim(),
    rfc?.trim(),
    telefono?.trim(),
    correo_electronico?.trim(),
    direccion?.trim(),
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar proveedor.
 * @param {number} id
 * @param {Object} datos
 */
async function actualizarProveedor(id, datos) {
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
  const sql = `UPDATE proveedores SET ${campos.join(", ")} WHERE proveedor_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar proveedor (soft delete).
 * @param {number} id
 */
async function desactivarProveedor(id) {
  await db.query(`
    UPDATE proveedores SET activo = 0 WHERE proveedor_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerProveedoresActivos,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  desactivarProveedor
};
