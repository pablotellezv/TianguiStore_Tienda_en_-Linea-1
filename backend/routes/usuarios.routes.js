/**
 * 📁 RUTA: routes/usuarios.routes.js
 * 📦 Descripción: API para gestión de usuarios del sistema.
 * 🔐 Todas las rutas están protegidas y controladas por permisos.
 */

const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// 🛡️ Middlewares
const {
  verificarAutenticacion,
  verificarPermiso
} = require("../middlewares/authMiddleware");

const validarResultados = require("../middlewares/validacion/validarResultados");
const { usuarioSchema, usuarioUpdateSchema, cambioContrasenaSchema } = require("../middlewares/validacion/usuarioSchemas");

// ───────────────────────────────────────────────
// 🧾 Rutas protegidas — Gestión de usuarios
// ───────────────────────────────────────────────

/**
 * 📋 GET /usuarios
 * Obtener todos los usuarios activos (admin, soporte, etc.)
 */
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.obtenerUsuarios
);

/**
 * 🔍 GET /usuarios/:id
 * Buscar usuario por ID
 */
router.get(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.buscarUsuarioPorId
);

/**
 * 🔍 POST /usuarios/buscar-correo
 * Buscar usuario por correo electrónico (uso interno)
 */
router.post(
  "/buscar-correo",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.buscarUsuarioPorCorreo
);

/**
 * ➕ POST /usuarios/registro
 * Registrar nuevo usuario (rol cliente por defecto)
 */
router.post(
  "/registro",
  verificarAutenticacion,
  verificarPermiso("usuarios", "crear"),
  usuarioSchema,
  validarResultados,
  usuariosController.registrarUsuario
);

/**
 * ✏️ PUT /usuarios/:id
 * Actualizar perfil del usuario (nombre, dirección, etc.)
 */
router.put(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuarioUpdateSchema,
  validarResultados,
  usuariosController.actualizarUsuario
);

/**
 * 🔐 PATCH /usuarios/:id/contrasena
 * Cambiar contraseña del usuario
 */
router.patch(
  "/:id/contrasena",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  cambioContrasenaSchema,
  validarResultados,
  usuariosController.cambiarContrasena
);

/**
 * ✅ PATCH /usuarios/:id/activar
 * Activar usuario (admin o sistema)
 */
router.patch(
  "/:id/activar",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuariosController.activarUsuario
);

/**
 * 🔴 PATCH /usuarios/:id/desactivar
 * Desactivar usuario (baja lógica)
 */
router.patch(
  "/:id/desactivar",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuariosController.desactivarUsuario
);

/**
 * 🗑️ DELETE /usuarios/:id
 * Eliminar lógicamente al usuario (borrado_logico = 1)
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "eliminar"),
  usuariosController.eliminarUsuario
);

module.exports = router;
