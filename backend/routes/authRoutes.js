const express = require("express");
const router = express.Router();

// Controladores de autenticación
const {
    registrarUsuario,
    verificarUsuario,
    obtenerSesion,
    cerrarSesion
} = require("../controllers/authController");

/**
 * 📌 Rutas de autenticación
 * Estas rutas manejan el registro, login, sesión y logout
 * Se basan en sesiones (express-session) y trabajan con JSON
 */

// Registrar nuevo usuario (cliente)
router.post("/registro", registrarUsuario);

// Iniciar sesión
router.post("/login", verificarUsuario);

// Obtener información de sesión actual
router.get("/sesion", obtenerSesion);

// Cerrar sesión
router.post("/logout", cerrarSesion);

module.exports = router;
