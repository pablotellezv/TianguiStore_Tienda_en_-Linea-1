const pool = require("../db/connection");

const ROL_CLIENTE_ID = 3;

/**
 * 🔍 Buscar usuario activo por correo.
 */
async function buscarUsuarioPorCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id,
      u.correo_electronico,
      u.contrasena_hash,
      u.nombre,
      u.rol_id,
      r.rol_nombre AS rol,
      r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.correo_electronico = ? AND u.activo = 1 AND u.borrado_logico = 0
  `, [correo]);
  return rows[0] || null;
}

/**
 * 🔍 Buscar usuario activo por ID.
 */
async function buscarUsuarioPorId(id) {
  const [rows] = await pool.query(`
    SELECT 
      u.usuario_id,
      u.correo_electronico,
      u.nombre,
      u.rol_id,
      r.rol_nombre AS rol,
      r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.usuario_id = ? AND u.activo = 1 AND u.borrado_logico = 0
  `, [parseInt(id)]);
  return rows[0] || null;
}

/**
 * 📧 Verificar si un correo ya está registrado.
 */
async function existeCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT usuario_id FROM usuarios WHERE correo_electronico = ?
  `, [correo]);
  return rows.length > 0;
}

/**
 * ➕ Crear un nuevo usuario.
 */
async function crearUsuario({
  correo_electronico,
  contrasena_hash,
  nombre,
  apellido_paterno = "",
  apellido_materno = "",
  telefono = "",
  direccion = "",
  genero = "no_especificado"
}) {
  await pool.query(`
    INSERT INTO usuarios (
      correo_electronico,
      contrasena_hash,
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      direccion,
      genero,
      rol_id,
      activo,
      verificado,
      borrado_logico,
      fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    correo_electronico?.trim(),
    contrasena_hash,
    nombre?.trim(),
    apellido_paterno?.trim(),
    apellido_materno?.trim(),
    telefono?.trim(),
    direccion?.trim(),
    genero,
    ROL_CLIENTE_ID,
    1, // activo
    0, // verificado
    0  // borrado_logico
  ]);
}

/**
 * ✅ Activar un usuario.
 */
async function activarUsuario(id) {
  await pool.query(`
    UPDATE usuarios SET activo = 1 WHERE usuario_id = ?
  `, [parseInt(id)]);
}

/**
 * ✅ Verificar un usuario.
 */
async function verificarUsuario(id) {
  await pool.query(`
    UPDATE usuarios SET verificado = 1 WHERE usuario_id = ?
  `, [parseInt(id)]);
}

/**
 * 🧹 Borrado lógico de un usuario.
 */
async function borrarUsuarioLogico(id) {
  await pool.query(`
    UPDATE usuarios SET borrado_logico = 1, activo = 0 WHERE usuario_id = ?
  `, [parseInt(id)]);

  // En caso de que falle el trigger o por control adicional, ejecutamos auditoría
  await registrarAuditoriaUsuario(id, 'borrado_logico');
}

/**
 * 🕵️ Registrar auditoría (fallback para trg_log_borrado_logico_usuario).
 */
async function registrarAuditoriaUsuario(usuario_id, accion) {
  // Esta función es un refuerzo para la auditoría por trigger.
  // Si el trigger `trg_log_borrado_logico_usuario` falla o está desactivado, este método garantiza trazabilidad.
  await pool.query(`
    INSERT INTO auditoria_borrado (
      entidad, entidad_id, accion, fecha, comentario
    ) VALUES (?, ?, ?, NOW(), ?)
  `, [
    'usuario',
    parseInt(usuario_id),
    accion,
    `Auditoría generada manualmente desde backend para el usuario ${usuario_id}`
  ]);
}

module.exports = {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  existeCorreo,
  crearUsuario,
  activarUsuario,
  verificarUsuario,
  borrarUsuarioLogico,
  registrarAuditoriaUsuario
};
