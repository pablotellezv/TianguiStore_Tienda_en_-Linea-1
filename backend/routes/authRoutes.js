const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  cerrarSesion
} = require("../controllers/authController");

// 📌 Registrar nuevo usuario
router.post("/registro", registrarUsuario);

// 📌 Iniciar sesión
router.post("/login", verificarUsuario);

// 📌 Obtener información de sesión
router.get("/sesion", obtenerSesion);

// 📌 Cerrar sesión
router.post("/logout", cerrarSesion);

// ❗❗❗ Esto es CRÍTICO: debes exportar SOLO el router
module.exports = router;
