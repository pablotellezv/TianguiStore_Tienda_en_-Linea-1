const db = require("../db/connection");

/**
 * 🔍 Obtener el estado actual de instalación (último registro).
 * @returns {Promise<Object|null>}
 */
async function obtenerEstadoInstalacion() {
  const [rows] = await db.query(`
    SELECT * FROM meta_instalacion
    ORDER BY fecha_instalacion DESC
    LIMIT 1
  `);
  return rows[0] || null;
}

/**
 * ➕ Registrar instalación o reinstalación del sistema.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function registrarInstalacion({
  sistema = 'TianguiStore',
  version = 'v1.0.0',
  instalado_por,
  estado = 'completo',
  observaciones = null
}) {
  await db.query(`
    INSERT INTO meta_instalacion (
      sistema, version, instalado_por,
      estado, observaciones, fecha_instalacion
    ) VALUES (?, ?, ?, ?, ?, NOW())
  `, [
    sistema,
    version,
    instalado_por?.trim(),
    estado,
    observaciones
  ]);
}

/**
 * 🧪 Verificar si la instalación es válida.
 * @returns {Promise<boolean>}
 */
async function instalacionValida() {
  const registro = await obtenerEstadoInstalacion();
  return registro && registro.estado === 'completo';
}

/**
 * 📜 Obtener historial completo de instalaciones.
 * @returns {Promise<Array>}
 */
async function obtenerHistorialInstalaciones() {
  const [rows] = await db.query(`
    SELECT * FROM meta_instalacion
    ORDER BY fecha_instalacion DESC
  `);
  return rows;
}

module.exports = {
  obtenerEstadoInstalacion,
  registrarInstalacion,
  instalacionValida,
  obtenerHistorialInstalaciones
};
