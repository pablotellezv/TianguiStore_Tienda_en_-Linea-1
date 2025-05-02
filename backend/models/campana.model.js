const db = require("../db/connection");

/**
 * 📋 Obtener todas las campañas activas y vigentes.
 */
async function obtenerCampanasActivas() {
  const [rows] = await db.query(`
    SELECT * FROM campanas
    WHERE activo = 1
      AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
    ORDER BY fecha_inicio DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener una campaña por ID.
 */
async function obtenerCampanaPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM campanas WHERE campana_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear nueva campaña.
 */
async function crearCampana({
  nombre_campana,
  descripcion = "",
  tipo = "descuento",
  filtro_json = {},
  descuento_porcentaje = null,
  fecha_inicio,
  fecha_fin,
  activo = true
}) {
  await db.query(`
    INSERT INTO campanas (
      nombre_campana, descripcion, tipo,
      filtro_json, descuento_porcentaje,
      fecha_inicio, fecha_fin,
      activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    nombre_campana?.trim(),
    descripcion?.trim(),
    tipo,
    JSON.stringify(filtro_json),
    descuento_porcentaje !== null ? parseFloat(descuento_porcentaje) : null,
    fecha_inicio,
    fecha_fin,
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar campaña.
 */
async function actualizarCampana(campana_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        clave === "filtro_json"
          ? JSON.stringify(valor)
          : typeof valor === "string"
          ? valor.trim()
          : valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(campana_id));
  const sql = `UPDATE campanas SET ${campos.join(", ")} WHERE campana_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Desactivar campaña.
 */
async function desactivarCampana(campana_id) {
  await db.query(`
    UPDATE campanas SET activo = 0 WHERE campana_id = ?
  `, [parseInt(campana_id)]);
}

module.exports = {
  obtenerCampanasActivas,
  obtenerCampanaPorId,
  crearCampana,
  actualizarCampana,
  desactivarCampana
};
