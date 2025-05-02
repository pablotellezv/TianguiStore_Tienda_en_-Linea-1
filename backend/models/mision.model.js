const db = require("../db/connection");

/* =============== MISIONES DISPONIBLES =============== */

/**
 * 📋 Obtener todas las misiones activas.
 */
async function obtenerMisionesActivas() {
  const [rows] = await db.query(`
    SELECT * FROM misiones
    WHERE activa = 1
    ORDER BY tipo ASC, fecha_creacion DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener una misión por ID.
 */
async function obtenerMisionPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM misiones WHERE mision_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear una nueva misión.
 */
async function crearMision({
  nombre_mision,
  descripcion = "",
  condicion,
  recompensa,
  tipo = "especial",
  activa = true
}) {
  await db.query(`
    INSERT INTO misiones (
      nombre_mision, descripcion, condicion,
      recompensa, tipo, activa, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
  `, [
    nombre_mision?.trim(),
    descripcion?.trim(),
    JSON.stringify(condicion),
    JSON.stringify(recompensa),
    tipo,
    Boolean(activa)
  ]);
}

/* =============== PROGRESO DE USUARIOS =============== */

/**
 * 📋 Obtener progreso de todas las misiones para un usuario.
 */
async function obtenerProgresoMisionesUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT pm.*, m.nombre_mision, m.descripcion, m.recompensa
    FROM progreso_mision pm
    JOIN misiones m ON pm.mision_id = m.mision_id
    WHERE pm.usuario_id = ?
    ORDER BY pm.fecha_actualizacion DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🔄 Actualizar progreso de una misión (por lógica personalizada externa).
 */
async function actualizarProgresoMision(usuario_id, mision_id, nuevoProgresoJson, nuevoEstado = null) {
  const campos = [`progreso = ?`, `fecha_actualizacion = NOW()`];
  const valores = [JSON.stringify(nuevoProgresoJson)];

  if (nuevoEstado) {
    campos.push(`estado = ?`);
    valores.push(nuevoEstado);
  }

  valores.push(parseInt(usuario_id));
  valores.push(parseInt(mision_id));

  await db.query(`
    UPDATE progreso_mision
    SET ${campos.join(", ")}
    WHERE usuario_id = ? AND mision_id = ?
  `, valores);
}

/**
 * ➕ Crear progreso inicial para una misión (si no existe).
 */
async function inicializarProgresoMision(usuario_id, mision_id) {
  await db.query(`
    INSERT IGNORE INTO progreso_mision (
      usuario_id, mision_id, estado, progreso, fecha_inicio
    ) VALUES (?, ?, 'pendiente', '{}', NOW())
  `, [parseInt(usuario_id), parseInt(mision_id)]);
}

/**
 * ✅ Marcar misión como completada (si cumple la condición).
 */
async function completarMision(usuario_id, mision_id) {
  await db.query(`
    UPDATE progreso_mision
    SET estado = 'completada', fecha_actualizacion = NOW()
    WHERE usuario_id = ? AND mision_id = ? AND estado = 'pendiente'
  `, [parseInt(usuario_id), parseInt(mision_id)]);
}

/**
 * 🏆 Reclamar recompensa de misión completada.
 */
async function reclamarMision(usuario_id, mision_id) {
  await db.query(`
    UPDATE progreso_mision
    SET estado = 'reclamada', fecha_actualizacion = NOW()
    WHERE usuario_id = ? AND mision_id = ? AND estado = 'completada'
  `, [parseInt(usuario_id), parseInt(mision_id)]);
}

module.exports = {
  obtenerMisionesActivas,
  obtenerMisionPorId,
  crearMision,
  obtenerProgresoMisionesUsuario,
  actualizarProgresoMision,
  inicializarProgresoMision,
  completarMision,
  reclamarMision
};
