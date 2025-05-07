/**
 * 📁 MODELO: configuracion.model.js
 * 📦 TABLA: configuracion_fiscal
 *
 * 🎯 Funcionalidad:
 *   - Consultar configuraciones activas
 *   - Obtener configuración específica por clave
 *   - Insertar o actualizar configuraciones dinámicamente
 *   - Desactivar configuraciones (borrado lógico)
 *
 * 🔐 La columna `clave` debe ser única (UNIQUE).
 * 🧪 El campo `valor` puede ser string, numérico o JSON (serializado).
 */

const db = require("../db/connection"); // Pool de conexión MySQL

/**
 * 📋 Obtener todas las configuraciones activas.
 * Solo aquellas marcadas con `activo = 1`.
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
 * 🔍 Obtener una configuración específica por clave.
 * @param {string} clave - Clave única de la configuración.
 * @returns {Promise<Object|null>} - Configuración o null si no existe.
 */
async function obtenerConfiguracionPorClave(clave) {
  const [rows] = await db.query(`
    SELECT * FROM configuracion_fiscal
    WHERE clave = ?
  `, [clave?.trim()]);
  return rows[0] || null;
}

/**
 * 💾 Guardar o actualizar una configuración.
 * Inserta si no existe, actualiza si ya existe (`ON DUPLICATE KEY`).
 *
 * @param {Object} config - Objeto de configuración.
 * @param {string} config.clave - Clave única.
 * @param {*} config.valor - Valor serializable (texto, JSON, número...).
 * @param {string} [config.descripcion=""] - Descripción opcional.
 * @param {string} [config.tipo_dato="texto"] - Tipo lógico.
 * @param {boolean} [config.activo=true] - Visibilidad (por defecto activo).
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
    )
    VALUES (?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      valor = VALUES(valor),
      descripcion = VALUES(descripcion),
      tipo_dato = VALUES(tipo_dato),
      activo = VALUES(activo),
      fecha_actualizacion = NOW()
  `, [
    clave?.trim(),
    typeof valor === "object" ? JSON.stringify(valor) : valor,
    descripcion?.trim(),
    tipo_dato,
    Boolean(activo)
  ]);
}

/**
 * 🗑️ Desactivar una configuración (borrado lógico).
 * @param {string} clave - Clave a desactivar.
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
