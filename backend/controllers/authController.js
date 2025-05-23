/**
 * 📁 CONTROLADOR: authController.js
 * 📦 MÓDULO: Autenticación y gestión de sesión (JWT)
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const validator = require("validator");

const usuarioModel = require("../models/usuarios.model");
const rolModel = require("../models/rol.model");
const {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken
} = require("../utils/jwt");

/**
 * ➕ REGISTRO DE NUEVO USUARIO
 * @route POST /auth/registro
 */
/**
 * ➕ REGISTRO DE NUEVO USUARIO (EXTENDIDO)
 * @route POST /auth/registro
 */
async function registrarUsuario(req, res) {
  const {
    correo_electronico,
    contrasena,
    confirmar_contrasena,
    nombre,
    apellido_paterno = "",
    apellido_materno = "",
    telefono = "",
    direccion = "",
    genero = "no_especificado",
    fecha_nacimiento = null,
    foto_perfil_url = null,
    biografia = null,
    cv_url = null,
    portafolio_url = null,
    origen_reclutamiento = "externo"
  } = req.body;

  // 🧾 Validaciones iniciales
  if (!correo_electronico || !contrasena || !nombre) {
    return res.status(400).json({
      message: "Faltan campos obligatorios: correo_electronico, contrasena, nombre."
    });
  }

  if (!validator.isEmail(correo_electronico)) {
    return res.status(400).json({ message: "Correo electrónico inválido." });
  }

  if (contrasena !== confirmar_contrasena) {
    return res.status(400).json({ message: "Las contraseñas no coinciden." });
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

  // Validaciones adicionales
  if (foto_perfil_url && !validator.isURL(foto_perfil_url)) {
    return res.status(400).json({ message: "URL de foto de perfil inválida." });
  }

  if (cv_url && !validator.isURL(cv_url)) {
    return res.status(400).json({ message: "URL de CV inválida." });
  }

  if (portafolio_url && !validator.isURL(portafolio_url)) {
    return res.status(400).json({ message: "URL de portafolio inválida." });
  }

  if (!["externo", "interno", "campaña", "referido", "fidelidad"].includes(origen_reclutamiento)) {
    return res.status(400).json({ message: "Origen de reclutamiento no válido." });
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
      direccion,
      genero,
      fecha_nacimiento,
      foto_perfil_url,
      biografia,
      cv_url,
      portafolio_url,
      origen_reclutamiento
    });

    return res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    return res.status(500).json({ message: "Error interno al registrar usuario." });
  }
}


/**
 * 🔐 INICIO DE SESIÓN
 * @route POST /auth/login
 */
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos." });
  }

  try {
    const usuario = await usuarioModel.buscarUsuarioPorCorreo(correo_electronico);
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!coincide) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    let permisos = {};
    try {
      const permisosRaw = await rolModel.obtenerPermisosPorRolId(usuario.rol_id);
      if (typeof permisosRaw === "string") {
        permisos = JSON.parse(permisosRaw || "{}");
      } else if (typeof permisosRaw === "object" && permisosRaw !== null) {
        permisos = permisosRaw;
      } else {
        throw new Error("Tipo de permisos inesperado");
      }
    } catch (e) {
      console.warn("⚠️ Permisos corruptos para rol_id:", usuario.rol_id, e.message);
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol || "cliente",
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
 * @route POST /auth/refrescar
 */
async function refrescarToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token requerido." });
  }

  try {
    const decoded = verificarRefreshToken(refreshToken);

    const usuario = await usuarioModel.buscarUsuarioPorId(decoded.usuario_id);
    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    let permisos = {};
    try {
      const permisosRaw = await rolModel.obtenerPermisosPorRolId(usuario.rol_id);
      if (typeof permisosRaw === "string") {
        permisos = JSON.parse(permisosRaw || "{}");
      } else if (typeof permisosRaw === "object" && permisosRaw !== null) {
        permisos = permisosRaw;
      } else {
        throw new Error("Tipo de permisos inesperado");
      }
    } catch (e) {
      console.warn("⚠️ Permisos corruptos para rol_id:", usuario.rol_id, e.message);
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      nombre: usuario.nombre,
      rol: usuario.rol || "cliente",
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
