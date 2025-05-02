const db = require("../db/connection");

/**
 * 📋 Obtener todos los eventos programados activos del esquema actual.
 */
async function obtenerEventosActivos() {
  const [rows] = await db.query(`
    SELECT 
      EVENT_NAME, 
      EVENT_DEFINITION, 
      EVENT_TYPE, 
      EXECUTE_AT, 
      INTERVAL_VALUE, 
      INTERVAL_FIELD, 
      STATUS, 
      LAST_EXECUTED, 
      SQL_MODE 
    FROM information_schema.EVENTS
    WHERE EVENT_SCHEMA = DATABASE()
    ORDER BY EVENT_NAME ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un evento específico por nombre.
 * @param {string} nombre
 */
async function obtenerEventoPorNombre(nombre) {
  const [rows] = await db.query(`
    SELECT * FROM information_schema.EVENTS
    WHERE EVENT_SCHEMA = DATABASE()
      AND EVENT_NAME = ?
  `, [nombre?.trim()]);
  return rows[0] || null;
}

/**
 * 🧪 Verificar si un evento está habilitado.
 * @param {string} nombre
 */
async function eventoEstaActivo(nombre) {
  const evento = await obtenerEventoPorNombre(nombre);
  return evento && evento.STATUS === 'ENABLED';
}
