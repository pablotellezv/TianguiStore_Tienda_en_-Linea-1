require("dotenv").config();
const bcrypt = require("bcrypt");
const validator = require("validator");
const authModel = require("../models/authModel");
const {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken
} = require("../utils/jwt");

// 📌 Registro de nuevo usuario
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

  if (!correo_electronico || !contrasena || !nombre) {
    return res.status(400).json({ message: "Faltan campos obligatorios (correo, contraseña, nombre)." });
  }

  if (!validator.isEmail(correo_electronico)) {
    return res.status(400).json({ message: "El correo electrónico no es válido." });
  }

  if (!validator.isStrongPassword(contrasena, { minLength: 8, minSymbols: 0 })) {
    return res.status(400).json({
      message: "Contraseña insegura. Usa mínimo 8 caracteres, una mayúscula y un número."
    });
  }

  try {
    const yaExiste = await authModel.existeCorreo(correo_electronico);
    if (yaExiste) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    await authModel.crearUsuario({
      correo_electronico,
      contrasena_hash: hash,
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      direccion
    });

    res.status(201).json({ message: "Usuario registrado exitosamente." });

  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    res.status(500).json({ message: "Error interno al registrar usuario." });
  }
}

// 📌 Login de usuario
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  try {
    const usuario = await authModel.buscarUsuarioPorCorreo(correo_electronico);
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

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken({ usuario_id: payload.usuario_id });

    res.status(200).json({
      accessToken,
      refreshToken,
      usuario: payload
    });

  } catch (error) {
    console.error("❌ Error en verificarUsuario:", error);
    res.status(500).json({ message: "Error interno al iniciar sesión." });
  }
}

// 📌 Obtener sesión desde el token ya decodificado
function obtenerSesion(req, res) {
  const usuario = req.usuario;
  if (!usuario) {
    return res.status(401).json({ message: "Token inválido o sesión no activa." });
  }

  res.status(200).json({ usuario });
}

// ♻️ Generar nuevo Access Token usando Refresh Token
async function refrescarToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No se proporcionó refresh token." });
  }

  try {
    const decoded = verificarRefreshToken(refreshToken);
    const usuario = await authModel.buscarUsuarioPorId(decoded.usuario_id);

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

    const nuevoAccessToken = generarAccessToken(payload);

    res.status(200).json({
      accessToken: nuevoAccessToken,
      usuario: payload
    });

  } catch (error) {
    console.error("❌ Error en refrescarToken:", error);
    res.status(401).json({ message: "Refresh token inválido o expirado." });
  }
}

// 📌 Cierre de sesión (eliminación manual de tokens por el cliente)
function cerrarSesion(req, res) {
  res.status(200).json({
    message: "Sesión cerrada correctamente. (El cliente debe eliminar los tokens localmente.)"
  });
}

module.exports = {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  refrescarToken,
  cerrarSesion
};
