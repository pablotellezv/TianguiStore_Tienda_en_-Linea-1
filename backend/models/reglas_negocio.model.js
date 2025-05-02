const db = require("../db/connection");

/**
 * 📋 Obtener todas las reglas activas y no eliminadas.
 * @returns {Promise<Array>}
 */
async function obtenerReglasActivas() {
  const [rows] = await db.query(`
    SELECT * FROM reglas_negocio
    WHERE activa = 1 AND borrado_logico = 0
    ORDER BY fecha_actualizacion DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener una regla por su ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function obtenerReglaPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM reglas_negocio WHERE regla_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear una nueva regla de negocio.
 * @param {Object} datos
 * @returns {Promise<void>}
 */
async function crearRegla({
  nombre,
  descripcion = "",
  tipo_evento,
  umbral_valor = 0,
  criterio = {},
  accion_automatizada,
  activa = true
}) {
  await db.query(`
    INSERT INTO reglas_negocio (
      nombre,
      descripcion,
      tipo_evento,
      umbral_valor,
      criterio,
      accion_automatizada,
      activa,
      borrado_logico,
      fecha_creacion,
      fecha_actualizacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
  `, [
    nombre?.trim(),
    descripcion?.trim(),
    tipo_evento,
    parseFloat(umbral_valor),
    JSON.stringify(criterio),
    accion_automatizada,
    Boolean(activa)
  ]);
}

/**
 * ✏️ Actualizar una regla existente.
 * @param {number} regla_id
 * @param {Object} cambios
 * @returns {Promise<void>}
 */
async function actualizarRegla(regla_id, cambios) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(cambios)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        clave === "criterio"
          ? JSON.stringify(valor)
          : typeof valor === "string"
          ? valor.trim()
          : valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(regla_id));
  const sql = `UPDATE reglas_negocio SET ${campos.join(", ")} WHERE regla_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Borrar lógicamente una regla (soft-delete).
 * @param {number} id
 * @returns {Promise<void>}
 */
async function borrarRegla(id) {
  await db.query(`
    UPDATE reglas_negocio
    SET borrado_logico = 1, activa = 0
    WHERE regla_id = ?
  `, [parseInt(id)]);
}

/**
 * ✅ Evaluar si una regla está activa y cumple condición (básico).
 * Este método se puede usar como base para motor de ejecución externa.
 */
async function obtenerReglasPorEvento(tipo_evento) {
  const [rows] = await db.query(`
    SELECT * FROM reglas_negocio
    WHERE tipo_evento = ? AND activa = 1 AND borrado_logico = 0
    ORDER BY fecha_actualizacion DESC
  `, [tipo_evento]);
  return rows;
}

module.exports = {
  obtenerReglasActivas,
  obtenerReglaPorId,
  crearRegla,
  actualizarRegla,
  borrarRegla,
  obtenerReglasPorEvento
};
