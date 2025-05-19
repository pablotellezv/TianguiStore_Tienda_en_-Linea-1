/**
 * 📁 CONTROLADOR: authController.js
 * 📦 MÓDULO: Autenticación y gestión de sesión (JWT)
 *
 * 🧩 Este controlador gestiona:
 *   - Registro de nuevos usuarios
 *   - Inicio de sesión (login) con validación de credenciales
 *   - Generación y renovación de tokens JWT (access + refresh)
 *   - Consulta de sesión activa
 *   - Cierre de sesión
 *
 * 🔐 Dependencias:
 *   - 📊 models/usuarios.model.js → funciones de consulta y escritura en DB
 *   - 📊 models/rol.model.js → obtiene permisos desde roles
 *   - 🔧 utils/jwt.js → utilidades para generación y validación de JWT
 *   - 🛡️ bcrypt, validator → hashing y validación de datos
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

  // Validaciones básicas
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
      permisos = JSON.parse(permisosRaw || "{}");
    } catch (e) {
      console.warn("⚠️ Permisos corruptos para rol_id:", usuario.rol_id);
    }

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
