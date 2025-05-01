const express = require("express");
const router = express.Router();

const { obtenerUsuarios } = require("../controllers/usuariosController");

const {
  verificarAutenticacion,
  verificarPermiso
} = require("../middlewares/authMiddleware");

// 🔐 GET /api/usuarios → Solo autenticados con permiso explícito
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("usuarios", "leer"),
  obtenerUsuarios
);

module.exports = router;
