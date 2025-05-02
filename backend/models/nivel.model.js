const db = require("../db/connection");

/**
 * 📋 Obtener historial completo de niveles alcanzados por un usuario.
 */
async function obtenerHistorialNiveles(usuario_id) {
  const [rows] = await db.query(`
    SELECT * FROM historial_niveles
    WHERE usuario_id = ?
    ORDER BY fecha_logro DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🔍 Obtener el nivel más reciente de un usuario.
 */
async function obtenerNivelActual(usuario_id) {
  const [rows] = await db.query(`
    SELECT nivel, puntos_acumulados, fecha_logro
    FROM historial_niveles
    WHERE usuario_id = ?
    ORDER BY fecha_logro DESC
    LIMIT 1
  `, [parseInt(usuario_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar nuevo nivel manualmente (sin usar SP).
 */
async function registrarNivelManual({
  usuario_id,
  nivel,
  puntos_acumulados = 0
}) {
  await db.query(`
    INSERT INTO historial_niveles (
      usuario_id, nivel, puntos_acumulados, fecha_logro
    ) VALUES (?, ?, ?, NOW())
  `, [
    parseInt(usuario_id),
    parseInt(nivel),
    parseInt(puntos_acumulados)
  ]);
}

/**
 * 🧮 Ejecutar procedimiento `sp_recompensar_por_nivel` (recomendado).
 */
async function ejecutarRecompensaPorNivel(usuario_id) {
  await db.query(`CALL sp_recompensar_por_nivel(?)`, [parseInt(usuario_id)]);
}

/**
 * 📊 Obtener ranking general por nivel (top N).
 */
async function obtenerRankingPorNivel(limit = 20) {
  const [rows] = await db.query(`
    SELECT h.usuario_id, u.nombre, MAX(h.nivel) AS nivel, MAX(h.fecha_logro) AS ultima_subida
    FROM historial_niveles h
    JOIN usuarios u ON h.usuario_id = u.usuario_id
    GROUP BY h.usuario_id
    ORDER BY nivel DESC, ultima_subida ASC
    LIMIT ?
  `, [parseInt(limit)]);
  return rows;
}
