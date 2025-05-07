/**
 * 📁 RUTA: routes/marcas.routes.js
 * 📦 Descripción: API REST para la gestión de marcas de productos
 * 🔐 Todas las rutas están protegidas por autenticación JWT
 * 🧠 Usa el controlador `marcasController.js` y modelo `marcasModel.js`
 */

const express = require("express");
const router = express.Router();

// 🛡️ Middlewares
const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const sanitizarEntradas = require("../middlewares/sanitizeMiddleware");

// 🧠 Controladores
const {
  obtenerMarcas,
  obtenerMarcaPorId,
  crearMarca,
  actualizarMarca,
  eliminarMarca
} = require("../controllers/marcasController");

// ───────────────────────────────────────────────
// 🔐 Rutas protegidas
// ───────────────────────────────────────────────

/**
 * 📋 GET /marcas
 * Lista todas las marcas activas
 */
router.get("/", verificarAutenticacion, obtenerMarcas);

/**
 * 🔍 GET /marcas/:id
 * Obtiene una marca por su ID
 */
router.get("/:id", verificarAutenticacion, async (req, res) => {
  try {
    await obtenerMarcaPorId(req, res);
  } catch (error) {
    console.error("❌ Error al obtener la marca:", error);
    res.status(500).json({ mensaje: "Error interno al obtener la marca." });
  }
});

/**
 * ➕ POST /marcas
 * Crea una nueva marca
 */
router.post("/", verificarAutenticacion, sanitizarEntradas, async (req, res) => {
  try {
    await crearMarca(req, res);
  } catch (error) {
    console.error("❌ Error al crear marca:", error);
    res.status(500).json({ mensaje: "Error al crear la marca." });
  }
});

/**
 * ✏️ PUT /marcas/:id
 * Actualiza una marca existente
 */
router.put("/:id", verificarAutenticacion, sanitizarEntradas, async (req, res) => {
  try {
    await actualizarMarca(req, res);
  } catch (error) {
    console.error("❌ Error al actualizar marca:", error);
    res.status(500).json({ mensaje: "Error al actualizar la marca." });
  }
});

/**
 * 🗑️ DELETE /marcas/:id
 * Elimina (lógicamente) una marca
 */
router.delete("/:id", verificarAutenticacion, async (req, res) => {
  try {
    await eliminarMarca(req, res);
  } catch (error) {
    console.error("❌ Error al eliminar marca:", error);
    res.status(500).json({ mensaje: "Error al eliminar la marca." });
  }
});

module.exports = router;
