const express = require('express');
const router = express.Router();
const pool = require("../db");

const { verificarAutenticacion } = require("../middlewares/authMiddleware");

// 📋 GET /marcas → Obtener todas las marcas (solo autenticados)
router.get('/', verificarAutenticacion, async (req, res) => {
  try {
    const [marcas] = await pool.query('SELECT marca_id, nombre_marca FROM marcas');
    res.json(marcas);
  } catch (error) {
    console.error('❌ Error al obtener marcas:', error);
    res.status(500).json({ message: 'Error al obtener las marcas.' });
  }
});

module.exports = router;
