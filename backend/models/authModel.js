const pool = require("../db");

// ID por defecto para usuarios nuevos (rol "cliente")
const ROL_CLIENTE_ID = 3;

/**
 * 🔍 Buscar usuario completo (con rol y permisos) por correo electrónico.
 * Solo considera usuarios activos.
 */
async function buscarUsuarioPorCorreo(correo) {
  const [rows] = await pool.query(`
    SELECT u.usuario_id, u.correo_electronico, u.contrasena_hash, u.nombre, u.rol_id,
           r.rol_nombre AS rol, r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.correo_electronico = ? AND u.activo = 1
  `, [correo]);

  return rows[0];
}

/**
 * 🔍 Buscar usuario completo (con rol y permisos) por ID.
 * Usado al validar un refresh token.
 */
async function buscarUsuarioPorId(id) {
  const [rows] = await pool.query(`
    SELECT u.usuario_id, u.correo_electronico, u.nombre, u.rol_id,
           r.rol_nombre AS rol, r.permisos_json
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.rol_id
    WHERE u.usuario_id = ? AND u.activo = 1
  `, [id]);

  return rows[0];
}

/**
 * 📧 Verifica si un correo ya está registrado en la base de datos.
 */
async function existeCorreo(correo) {
  const [rows] = await pool.query(
    "SELECT usuario_id FROM usuarios WHERE correo_electronico = ?",
    [correo]
  );

  return rows.length > 0;
}

/**
 * ➕ Crear nuevo usuario con datos completos (excepto rol que se asigna por defecto como "cliente").
 */
async function crearUsuario({
  correo_electronico,
  contrasena_hash,
  nombre,
  apellido_paterno = "",
  apellido_materno = "",
  telefono = "",
  direccion = ""
}) {
  await pool.query(`
    INSERT INTO usuarios 
    (correo_electronico, contrasena_hash, nombre, apellido_paterno, apellido_materno, telefono, direccion, rol_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      correo_electronico,
      contrasena_hash,
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      direccion,
      ROL_CLIENTE_ID
    ]
  );
}

module.exports = {
  buscarUsuarioPorCorreo,
  buscarUsuarioPorId,
  existeCorreo,
  crearUsuario
};
