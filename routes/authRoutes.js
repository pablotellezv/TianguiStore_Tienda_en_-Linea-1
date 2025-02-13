const express = require("express");
const router = express.Router();
const { registrarUsuario, verificarUsuario } = require("../controllers/authController");

// Ruta para registrar un nuevo usuario
router.post("/register", registrarUsuario);

// Ruta para iniciar sesión
router.post("/login", verificarUsuario);

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ mensaje: "Sesión cerrada correctamente" });
});

module.exports = router;
