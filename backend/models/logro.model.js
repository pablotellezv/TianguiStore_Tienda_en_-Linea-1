const db = require("../db/connection");

/* =============== LOGROS DISPONIBLES =============== */

/**
 * 📋 Obtener todos los logros activos.
 */
async function obtenerLogrosActivos() {
  const [rows] = await db.query(`
    SELECT * FROM logros
    WHERE activo = 1
    ORDER BY tipo ASC, puntos DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener un logro por ID.
 */
async function obtenerLogroPorId(logro_id) {
  const [rows] = await db.query(`
    SELECT * FROM logros WHERE logro_id = ?
  `, [parseInt(logro_id)]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo logro.
 */
async function crearLogro({
  nombre_logro,
  descripcion = "",
  icono_url = null,
  tipo = "basico",
  puntos = 10,
  activo = true
}) {
  await db.query(`
    INSERT INTO logros (
      nombre_logro, descripcion, icono_url, tipo, puntos, activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
  `, [
    nombre_logro?.trim(),
    descripcion?.trim(),
    icono_url?.trim() || null,
    tipo,
    parseInt(puntos),
    Boolean(activo)
  ]);
}

/* =============== LOGROS DEL USUARIO =============== */

/**
 * 📋 Obtener todos los logros obtenidos por un usuario.
 */
async function obtenerLogrosDeUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT lu.*, l.nombre_logro, l.icono_url, l.puntos
    FROM logros_usuario lu
    JOIN logros l ON lu.logro_id = l.logro_id
    WHERE lu.usuario_id = ?
    ORDER BY lu.fecha_obtenido DESC
  `, [parseInt(usuario_id)]);
  return rows;
}

/**
 * 🏆 Otorgar un logro a un usuario.
 */
async function otorgarLogro(usuario_id, logro_id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Validar que no lo tenga ya
    const [existe] = await conn.query(`
      SELECT 1 FROM logros_usuario
      WHERE usuario_id = ? AND logro_id = ?
    `, [usuario_id, logro_id]);

    if (existe.length > 0) {
      throw new Error("El usuario ya tiene este logro.");
    }

    // Insertar en logros_usuario
    await conn.query(`
      INSERT INTO logros_usuario (usuario_id, logro_id, fecha_obtenido)
      VALUES (?, ?, NOW())
    `, [usuario_id, logro_id]);

    // Sumar puntos al ranking
    const [puntosRow] = await conn.query(`
      SELECT puntos FROM logros WHERE logro_id = ?
    `, [logro_id]);

    const puntos = puntosRow?.[0]?.puntos || 0;

    await conn.query(`
      INSERT INTO ranking_usuarios (usuario_id, puntos_totales, nivel)
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE 
        puntos_totales = puntos_totales + VALUES(puntos_totales),
        ultima_actualizacion = NOW()
    `, [usuario_id, puntos]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/* =============== RANKING DE USUARIOS =============== */

/**
 * 📊 Obtener top de usuarios con más puntos.
 */
async function obtenerRankingUsuarios(limit = 20) {
  const [rows] = await db.query(`
    SELECT r.*, u.nombre, u.correo_electronico
    FROM ranking_usuarios r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    ORDER BY r.puntos_totales DESC
    LIMIT ?
  `, [parseInt(limit)]);
  return rows;
}

module.exports = {
  obtenerLogrosActivos,
  obtenerLogroPorId,
  crearLogro,
  obtenerLogrosDeUsuario,
  otorgarLogro,
  obtenerRankingUsuarios
};
