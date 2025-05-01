const express = require("express");
const router = express.Router();
const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const { obtenerMarcas } = require("../controllers/marcasController");

router.get("/", verificarAutenticacion, obtenerMarcas);

module.exports = router;
