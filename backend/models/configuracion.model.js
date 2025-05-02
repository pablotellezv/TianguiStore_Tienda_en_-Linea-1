const db = require("../db/connection");

/**
 * 📋 Obtener todas las configuraciones activas.
 */
async function obtenerConfiguracionesActivas() {
  const [rows] = await db.query(`
    SELECT * FROM configuracion_fiscal
    WHERE activo = 1
    ORDER BY clave ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener configuración por clave.
 * @param {string} clave
 * @returns {Promise<Object|null>}
 */
async function obtenerConfiguracionPorClave(clave) {
  const [rows] = await db.query(`
    SELECT * FROM configuracion_fiscal WHERE clave = ?
  `, [clave?.trim()]);
  return rows[0] || null;
}

/**
 * 💾 Guardar o actualizar una configuración.
 */
async function guardarConfiguracion({
  clave,
  valor,
  descripcion = "",
  tipo_dato = "texto",
  activo = true
}) {
  await db.query(`
    INSERT INTO configuracion_fiscal (
      clave, valor, descripcion, tipo_dato, activo, fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      valor = VALUES(valor),
      descripcion = VALUES(descripcion),
      tipo_dato = VALUES(tipo_dato),
      activo = VALUES(activo),
      fecha_actualizacion = NOW()
  `, [
    clave?.trim(),
    typeof valor === 'object' ? JSON.stringify(valor) : valor,
    descripcion?.trim(),
    tipo_dato,
    Boolean(activo)
  ]);
}

/**
 * 🗑️ Desactivar (soft delete) una configuración.
 */
async function desactivarConfiguracion(clave) {
  await db.query(`
    UPDATE configuracion_fiscal
    SET activo = 0
    WHERE clave = ?
  `, [clave?.trim()]);
}

module.exports = {
  obtenerConfiguracionesActivas,
  obtenerConfiguracionPorClave,
  guardarConfiguracion,
  desactivarConfiguracion
};
