require("dotenv").config();
const bcrypt = require("bcrypt");
const validator = require("validator");
const usuarioModel = require("../models/usuario.model");
const {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken
} = require("../utils/jwt");

/**
 * 📌 Registro de nuevo usuario
 */
async function registrarUsuario(req, res) {
  const {
    correo_electronico,
    contrasena,
    nombre,
    apellido_paterno = "",
    apellido_materno = "",
    telefono = "",
    direccion = ""
  } = req.body;

  // Validación de campos obligatorios
  if (!correo_electronico || !contrasena || !nombre) {
    return res.status(400).json({
      message: "Faltan campos obligatorios (correo, contraseña, nombre)."
    });
  }

  if (!validator.isEmail(correo_electronico)) {
    return res.status(400).json({ message: "Correo electrónico inválido." });
  }

  if (!validator.isStrongPassword(contrasena, { minLength: 8, minSymbols: 0 })) {
    return res.status(400).json({
      message: "Contraseña insegura. Usa mínimo 8 caracteres, una mayúscula y un número."
    });
  }

  try {
    const yaExiste = await usuarioModel.existeCorreo(correo_electronico);
    if (yaExiste) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    await usuarioModel.crearUsuario({
      correo_electronico,
      contrasena_hash: hash,
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      direccion
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    return res.status(500).json({ message: "Error interno al registrar usuario." });
  }
}

/**
 * 📌 Login de usuario (verificación de credenciales + tokens)
 */
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  try {
    const usuario = await usuarioModel.buscarUsuarioPorCorreo(correo_electronico);
    if (!usuario) {
      return res.status(401).json({ type: "credenciales_invalidas", message: "Credenciales inválidas." });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!esValida) {
      return res.status(401).json({ type: "credenciales_invalidas", message: "Credenciales inválidas." });
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol,
      permisos: JSON.parse(usuario.permisos_json)
    };

    return res.status(200).json({
      accessToken: generarAccessToken(payload),
      refreshToken: generarRefreshToken({ usuario_id: usuario.usuario_id }),
      usuario: payload
    });
  } catch (error) {
    console.error("❌ Error en verificarUsuario:", error);
    return res.status(500).json({ message: "Error interno al iniciar sesión." });
  }
}

/**
 * 📌 Obtener usuario desde token ya validado (JWT middleware)
 */
function obtenerSesion(req, res) {
  const usuario = req.usuario;
  if (!usuario) {
    return res.status(401).json({ message: "Token inválido o sesión no activa." });
  }
  return res.status(200).json({ usuario });
}

/**
 * ♻️ Generar nuevo accessToken con refreshToken
 */
async function refrescarToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No se proporcionó refresh token." });
  }

  try {
    const decoded = verificarRefreshToken(refreshToken);
    const usuario = await usuarioModel.buscarUsuarioPorId(decoded.usuario_id);

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol,
      permisos: JSON.parse(usuario.permisos_json)
    };

    return res.status(200).json({
      accessToken: generarAccessToken(payload),
      usuario: payload
    });
  } catch (error) {
    console.error("❌ Error en refrescarToken:", error);
    return res.status(401).json({ message: "Refresh token inválido o expirado." });
  }
}

/**
 * 🔒 Cierre de sesión
 */
function cerrarSesion(req, res) {
  return res.status(200).json({
    message: "Sesión cerrada correctamente. El cliente debe eliminar los tokens localmente."
  });
}

module.exports = {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  refrescarToken,
  cerrarSesion
};
