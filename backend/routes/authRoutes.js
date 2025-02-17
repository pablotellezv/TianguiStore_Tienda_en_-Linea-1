const express = require("express");
const router = express.Router();
const { registrarUsuario, verificarUsuario, obtenerSesion, cerrarSesion } = require("../controllers/authController");

// 📌 Ruta para registrar un nuevo usuario
router.post("/registro", registrarUsuario);

// 📌 Ruta para iniciar sesión
router.post("/login", verificarUsuario);

// 📌 Ruta para obtener el estado de la sesión
router.get("/sesion", obtenerSesion);

// 📌 Ruta para cerrar sesión
router.post("/logout", cerrarSesion);

module.exports = router;
