const express = require('express');
const router = express.Router();
const pool = require("../db");

const { verificarAutenticacion } = require("../middlewares/authMiddleware");

// 📋 GET /categorias → Obtener todas las categorías (solo usuarios autenticados)
router.get('/', verificarAutenticacion, async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT categoria_id, nombre_categoria FROM categorias');
    res.json(categorias);
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías.' });
  }
});

module.exports = router;
