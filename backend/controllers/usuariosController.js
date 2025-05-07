/**
 * 📁 CONTROLADOR: usuariosController.js
 * 📦 Módulo: Gestión de usuarios (TianguiStore)
 *
 * Este controlador expone funciones para manejar las operaciones relacionadas
 * con usuarios dentro del sistema: obtención, registro, edición, desactivación
 * y borrado lógico.
 *
 * 🔹 HTTP VERBS utilizados:
 *   - GET:     Para obtener información sin modificar datos.
 *   - POST:    Para registrar nuevos usuarios o buscar por correo.
 *   - PATCH:   Para actualizar parcialmente un recurso (por ejemplo, cambiar contraseña).
 *   - DELETE:  Para eliminar lógicamente un recurso (no se borra físicamente).
 *
 * 🧠 ¿Por qué usar PATCH y no PUT?
 * PATCH se utiliza para actualizar **solo algunos campos** de un recurso.
 * Es más eficiente y claro cuando no se desea reemplazar todo el objeto.
 *
 * 📂 Modelo utilizado:
 *   - usuarios.model.js
 */

const usuariosModel = require("../models/usuarios.model");

// ─────────────────────────────────────────────
// 📋 GET /usuarios
// 🔎 Obtener todos los usuarios activos y no eliminados
// ─────────────────────────────────────────────
async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await usuariosModel.obtenerTodos();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// ─────────────────────────────────────────────
// 🔍 GET /usuarios/:id
// 🔎 Buscar usuario por ID (si no está eliminado)
// ─────────────────────────────────────────────
async function obtenerUsuarioPorId(req, res) {
  const { id } = req.params;

  try {
    const usuario = await usuariosModel.buscarUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("❌ Error al buscar usuario:", error);
    res.status(500).json({ mensaje: "Error interno al buscar usuario" });
  }
}

// ─────────────────────────────────────────────
// 🔍 POST /usuarios/buscar-correo
// 🔎 Buscar usuario por correo electrónico
// ─────────────────────────────────────────────
async function obtenerUsuarioPorCorreo(req, res) {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: "El campo 'correo' es obligatorio." });
  }

  try {
    const usuario = await usuariosModel.buscarUsuarioPorCorreo(correo.trim());
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("❌ Error al buscar usuario por correo:", error);
    res.status(500).json({ mensaje: "Error interno al buscar usuario" });
  }
}

// ─────────────────────────────────────────────
// ➕ POST /usuarios/registro
// ✨ Registrar nuevo usuario (con rol cliente)
// ─────────────────────────────────────────────
async function registrarUsuario(req, res) {
  const datos = req.body;
  const requeridos = ["correo_electronico", "contrasena_hash", "nombre"];

  for (const campo of requeridos) {
    if (!datos[campo]?.trim()) {
      return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
    }
  }

  try {
    const correo = datos.correo_electronico.trim();
    const existe = await usuariosModel.existeCorreo(correo);
    if (existe) {
      return res.status(409).json({ mensaje: "El correo ya está registrado." });
    }

    await usuariosModel.crearUsuario({
      ...datos,
      correo_electronico: correo,
      nombre: datos.nombre.trim()
    });

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error interno al registrar usuario" });
  }
}

// ─────────────────────────────────────────────
// 🔁 PATCH /usuarios/:id/cambiar-contrasena
// 🔐 Cambiar contraseña (se recibe el nuevo hash bcrypt)
// ─────────────────────────────────────────────
async function cambiarContrasena(req, res) {
  const { id } = req.params;
  const { nuevo_hash } = req.body;

  if (!nuevo_hash) {
    return res.status(400).json({ mensaje: "Debes proporcionar la nueva contraseña (hash)" });
  }

  try {
    await usuariosModel.cambiarContrasena(id, nuevo_hash);
    res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error);
    res.status(500).json({ mensaje: "Error al actualizar contraseña" });
  }
}

// ─────────────────────────────────────────────
// ✏️ PATCH /usuarios/:id/actualizar-perfil
// 📝 Actualizar datos del perfil del usuario
// ─────────────────────────────────────────────
async function actualizarPerfil(req, res) {
  const { id } = req.params;
  const datos = req.body;

  try {
    await usuariosModel.actualizarPerfil(id, datos);
    res.status(200).json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res.status(500).json({ mensaje: "Error al actualizar el perfil" });
  }
}

// ─────────────────────────────────────────────
// 🟢 PATCH /usuarios/:id/habilitar
// ✅ Activar cuenta de usuario (por admin o sistema)
// ─────────────────────────────────────────────
async function habilitarUsuario(req, res) {
  const { id } = req.params;

  try {
    await usuariosModel.activarUsuario(id);
    res.status(200).json({ mensaje: "Usuario habilitado correctamente" });
  } catch (error) {
    console.error("❌ Error al habilitar usuario:", error);
    res.status(500).json({ mensaje: "Error al habilitar usuario" });
  }
}

// ─────────────────────────────────────────────
// 🔴 PATCH /usuarios/:id/deshabilitar
// 🚫 Desactivar cuenta de usuario (sin eliminar)
// ─────────────────────────────────────────────
async function deshabilitarUsuario(req, res) {
  const { id } = req.params;

  try {
    await usuariosModel.desactivarUsuario(id);
    res.status(200).json({ mensaje: "Usuario deshabilitado correctamente" });
  } catch (error) {
    console.error("❌ Error al deshabilitar usuario:", error);
    res.status(500).json({ mensaje: "Error al deshabilitar usuario" });
  }
}

// ─────────────────────────────────────────────
// 🗑️ DELETE /usuarios/:id
// 🧹 Eliminar usuario de forma lógica (sin borrar físicamente)
// ─────────────────────────────────────────────
async function eliminarUsuario(req, res) {
  const { id } = req.params;

  try {
    const usuario = await usuariosModel.buscarUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await usuariosModel.borrarUsuarioLogico(id);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
}

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorCorreo,
  registrarUsuario,
  cambiarContrasena,
  actualizarPerfil,
  habilitarUsuario,
  deshabilitarUsuario,
  eliminarUsuario
};
