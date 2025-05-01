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

// ─────────────── 🔓 Rutas públicas ───────────────

// 📝 Registro de nuevo usuario
router.post("/registro", sanitizarEntradas, registrarUsuario);

// 🔐 Inicio de sesión y generación de tokens
router.post("/login", sanitizarEntradas, verificarUsuario);

// ♻️ Generar nuevo access token a partir del refresh token
router.post("/refrescar", sanitizarEntradas, refrescarToken);

// ─────────────── 🔐 Rutas protegidas ───────────────

// 📦 Obtener información del usuario autenticado (requiere access token válido)
router.get("/sesion", verificarAutenticacion, obtenerSesion);

// 🔁 Renovar access token desde un access token válido (opcional si usas refresh tokens)
router.post("/renovar", verificarAutenticacion, renovarToken);

// 🔓 Cerrar sesión (cliente debe eliminar sus tokens)
router.post("/logout", verificarAutenticacion, cerrarSesion);

// ──────────────────────────────────────────────────
module.exports = router;
