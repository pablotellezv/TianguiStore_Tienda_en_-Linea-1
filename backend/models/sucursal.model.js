const db = require("../db/connection");

/**
 * 📋 Obtener todas las sucursales activas.
 */
async function obtenerSucursalesActivas() {
  const [rows] = await db.query(`
    SELECT * FROM sucursales
    WHERE activa = 1
    ORDER BY nombre_sucursal ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener una sucursal por ID.
 */
async function obtenerSucursalPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM sucursales WHERE sucursal_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear nueva sucursal.
 */
async function crearSucursal({
  nombre_sucursal,
  tipo = 'física',
  ubicacion = "",
  correo_contacto = "",
  telefono_contacto = "",
  activa = true
}) {
  await db.query(`
    INSERT INTO sucursales (
      nombre_sucursal, tipo, ubicacion,
      correo_contacto, telefono_contacto, activa, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
  `, [
    nombre_sucursal?.trim(),
    tipo,
    ubicacion?.trim(),
    correo_contacto?.trim(),
    telefono_contacto?.trim(),
    Boolean(activa)
  ]);
}

/**
 * ✏️ Actualizar sucursal.
 */
async function actualizarSucursal(sucursal_id, cambios) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(cambios)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(sucursal_id));
  const sql = `UPDATE sucursales SET ${campos.join(", ")} WHERE sucursal_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar una sucursal (soft delete).
 */
async function desactivarSucursal(id) {
  await db.query(`
    UPDATE sucursales SET activa = 0 WHERE sucursal_id = ?
  `, [parseInt(id)]);
}

module.exports = {
  obtenerSucursalesActivas,
  obtenerSucursalPorId,
  crearSucursal,
  actualizarSucursal,
  desactivarSucursal
};
