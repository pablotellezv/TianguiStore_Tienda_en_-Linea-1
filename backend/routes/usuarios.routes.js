const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

const {
  verificarAutenticacion,
  verificarPermiso
} = require("../middlewares/authMiddleware");

const validarResultados = require("../middlewares/validacion/validarResultados");
const { usuarioSchema, cambioContrasenaSchema } = require("../middlewares/validacion/usuarioSchema");

// 📋 GET /usuarios — Obtener todos los usuarios
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.obtenerUsuarios
);

// 🔍 GET /usuarios/:id — Buscar usuario por ID
router.get(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.obtenerUsuarioPorId
);

// 🔍 POST /usuarios/buscar-correo — Buscar usuario por correo electrónico
router.post(
  "/buscar-correo",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  usuariosController.obtenerUsuarioPorCorreo
);

// ➕ POST /usuarios/registro — Registrar nuevo usuario
router.post(
  "/registro",
  verificarAutenticacion,
  verificarPermiso("usuarios", "crear"),
  usuarioSchema,
  validarResultados,
  usuariosController.registrarUsuario
);

// ✏️ PUT /usuarios/:id — Actualizar perfil del usuario
router.put(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuarioSchema,
  validarResultados,
  usuariosController.actualizarUsuario // ← ✅ Corrección aquí
);

// 🔐 PATCH /usuarios/:id/contrasena — Cambiar contraseña
router.patch(
  "/:id/contrasena",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  cambioContrasenaSchema,
  validarResultados,
  usuariosController.cambiarContrasena
);

// ✅ PATCH /usuarios/:id/activar — Activar usuario
router.patch(
  "/:id/activar",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuariosController.habilitarUsuario
);

// 🔴 PATCH /usuarios/:id/desactivar — Desactivar usuario
router.patch(
  "/:id/desactivar",
  verificarAutenticacion,
  verificarPermiso("usuarios", "modificar"),
  usuariosController.deshabilitarUsuario
);

// 🗑️ DELETE /usuarios/:id — Eliminar usuario lógicamente
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarPermiso("usuarios", "eliminar"),
  usuariosController.eliminarUsuario
);

module.exports = router;
