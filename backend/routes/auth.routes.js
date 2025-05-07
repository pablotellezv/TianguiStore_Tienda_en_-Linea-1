/**
 * 📁 ARCHIVO: routes/auth.routes.js
 * 📦 MÓDULO: Autenticación y gestión de sesión
 *
 * 🔐 Rutas para:
 *   - Registro de usuarios
 *   - Inicio/cierre de sesión
 *   - Manejo de tokens (Access & Refresh)
 *   - Validación de sesiones activas
 *
 * 🛠️ Integrado con:
 *   - Controladores: authController.js
 *   - Middlewares: authMiddleware.js, sanitizeMiddleware.js
 *   - Sistema JWT con Access Token + Refresh Token
 */

const express = require("express");
const router = express.Router();

// 🧠 Controladores
const {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  cerrarSesion,
  renovarToken,
  refrescarToken
} = require("../controllers/authController");

// 🛡️ Middlewares
const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const sanitizarEntradas = require("../middlewares/sanitizeMiddleware");

// ───────────────────────────────────────────────
// 🔓 RUTAS PÚBLICAS — sin autenticación
// ───────────────────────────────────────────────

/**
 * 📝 POST /auth/registro
 * Registra un nuevo usuario cliente.
 * Requiere: nombre, correo_electronico, contrasena_hash
 */
router.post("/registro", sanitizarEntradas, registrarUsuario);

/**
 * 🔐 POST /auth/login
 * Inicia sesión con correo y contraseña.
 * Devuelve: access_token + refresh_token
 */
router.post("/login", sanitizarEntradas, verificarUsuario);

/**
 * ♻️ POST /auth/refrescar
 * Obtiene un nuevo access token desde refresh token.
 */
router.post("/refrescar", sanitizarEntradas, refrescarToken);

// ───────────────────────────────────────────────
// 🔐 RUTAS PROTEGIDAS — requieren JWT válido
// ───────────────────────────────────────────────

/**
 * 📦 GET /auth/sesion
 * Retorna información del usuario autenticado.
 */
router.get("/sesion", verificarAutenticacion, obtenerSesion);

/**
 * 🔄 POST /auth/renovar
 * Renueva access token si el anterior aún no ha expirado.
 */
router.post("/renovar", verificarAutenticacion, renovarToken);

/**
 * 🔓 POST /auth/logout
 * Finaliza sesión (el frontend debe limpiar los tokens).
 */
router.post("/logout", verificarAutenticacion, cerrarSesion);

// ───────────────────────────────────────────────

module.exports = router;
