/**
 * 📁 CONTROLADOR: authController.js
 * 📦 MÓDULO: Autenticación y gestión de sesión (JWT)
 *
 * 🧩 Este controlador gestiona:
 *   - Registro de nuevos usuarios
 *   - Verificación de credenciales (login)
 *   - Generación y renovación de tokens JWT (access + refresh)
 *   - Validación de sesión activa
 *   - Cierre de sesión
 *
 * 🔐 Depende de:
 *   - 🔧 utils/jwt.js (manejo de tokens)
 *   - 📊 models/usuario.model.js (modelo de usuarios)
 *   - 🛡️ bcrypt, validator (seguridad y validaciones)
 */

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
 * ➕ REGISTRO DE NUEVO USUARIO
 * - Valida que el correo sea único y bien formado.
 * - Verifica que la contraseña sea fuerte.
 * - Hashea la contraseña y almacena el usuario como CLIENTE.
 *
 * @route POST /auth/registro
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

  // ✅ Validaciones básicas
  if (!correo_electronico || !contrasena || !nombre) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: correo_electronico, contrasena, nombre."
    });
  }

  if (!validator.isEmail(correo_electronico)) {
    return res.status(400).json({ message: "Correo electrónico inválido." });
  }

  if (!validator.isStrongPassword(contrasena, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  })) {
    return res.status(400).json({
      message: "Contraseña débil. Requiere mínimo 8 caracteres, una mayúscula y un número."
    });
  }

  try {
    // 🔍 Validar que el correo no esté registrado
    const yaExiste = await usuarioModel.existeCorreo(correo_electronico);
    if (yaExiste) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    // 🔐 Hashear la contraseña con bcrypt
    const hash = await bcrypt.hash(contrasena, 10);

    // 💾 Crear usuario
    await usuarioModel.crearUsuario({
      correo_electronico,
      contrasena_hash: hash,
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      direccion
    });

    return res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    return res.status(500).json({ message: "Error interno al registrar usuario." });
  }
}

/**
 * 🔐 INICIO DE SESIÓN (LOGIN)
 * - Verifica credenciales y genera accessToken y refreshToken.
 *
 * @route POST /auth/login
 */
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos." });
  }

  try {
    // 🔍 Buscar al usuario en la BD
    const usuario = await usuarioModel.buscarUsuarioPorCorreo(correo_electronico);
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 🔐 Comparar hash de contraseña
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    // 🧩 Extraer permisos
    let permisos = [];
    try {
      permisos = JSON.parse(usuario.permisos_json || "[]");
    } catch (e) {
      console.warn("⚠️ Permisos corruptos:", usuario.usuario_id);
    }

    // 🧾 Payload para el token
    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol,
      permisos
    };

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      accessToken: generarAccessToken(payload),
      refreshToken: generarRefreshToken({ usuario_id: usuario.usuario_id }),
      usuario: payload
    });
  } catch (error) {
    console.error("❌ Error en verificarUsuario:", error);
    return res.status(500).json({ message: "Error al iniciar sesión." });
  }
}

/**
 * 📦 OBTENER SESIÓN ACTUAL
 * - Devuelve el payload extraído del token de acceso (usuario autenticado).
 *
 * @route GET /auth/sesion
 */
function obtenerSesion(req, res) {
  if (!req.usuario) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }

  return res.status(200).json({ usuario: req.usuario });
}

/**
 * ♻️ REFRESCAR TOKEN
 * - Usa un refresh token válido para generar un nuevo access token.
 *
 * @route POST /auth/refrescar
 */
async function refrescarToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token requerido." });
  }

  try {
    // 🔐 Validar token
    const decoded = verificarRefreshToken(refreshToken);

    const usuario = await usuarioModel.buscarUsuarioPorId(decoded.usuario_id);
    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    let permisos = [];
    try {
      permisos = JSON.parse(usuario.permisos_json || "[]");
    } catch (e) {
      console.warn("⚠️ Permisos corruptos:", usuario.usuario_id);
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol,
      permisos
    };

    return res.status(200).json({
      message: "Token renovado exitosamente.",
      accessToken: generarAccessToken(payload),
      usuario: payload
    });
  } catch (error) {
    console.error("❌ Error en refrescarToken:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
}

/**
 * 🔓 CERRAR SESIÓN
 * - No invalida el token en el servidor (JWT es stateless).
 * - El frontend debe eliminar access/refresh tokens localmente.
 *
 * @route POST /auth/logout
 */
function cerrarSesion(req, res) {
  return res.status(200).json({
    message: "Sesión cerrada. El cliente debe eliminar los tokens del almacenamiento local."
  });
}

module.exports = {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  refrescarToken,
  cerrarSesion
};
