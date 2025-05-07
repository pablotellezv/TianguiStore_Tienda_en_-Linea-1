/**
 * 📁 RUTA: routes/categorias.routes.js
 * 📦 Módulo: Gestión de categorías del catálogo de productos
 *
 * 🔐 Todas las rutas están protegidas por autenticación JWT.
 * 🧠 Utiliza el modelo `categoriasModel.js` para operaciones con la base de datos.
 */

const express = require("express");
const router = express.Router();
const categoriasModel = require("../models/categoria.model");


const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const sanitizarEntradas = require("../middlewares/sanitizeAndValidateMiddleware");

// ───────────────────────────────────────────────
// 📥 Rutas protegidas — requieren JWT válido
// ───────────────────────────────────────────────

/**
 * 📋 GET /categorias
 * Obtener todas las categorías activas
 */
router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const categorias = await categoriasModel.obtenerCategoriasActivas();
    res.status(200).json(categorias);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({ message: "Error interno al obtener las categorías" });
  }
});

/**
 * 🔍 GET /categorias/:id
 * Obtener una categoría por su ID
 */
router.get("/:id", verificarAutenticacion, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const categoria = await categoriasModel.obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (error) {
    console.error("❌ Error al obtener categoría por ID:", error);
    res.status(500).json({ message: "Error interno al buscar la categoría" });
  }
});

/**
 * ➕ POST /categorias
 * Crear una nueva categoría
 */
router.post("/", verificarAutenticacion, sanitizarEntradas, async (req, res) => {
  try {
    const { nombre_categoria, slug_categoria } = req.body;

    if (!nombre_categoria || !slug_categoria) {
      return res.status(400).json({ message: "Faltan campos obligatorios: nombre y slug" });
    }

    await categoriasModel.insertarCategoria(req.body);
    res.status(201).json({ message: "Categoría creada correctamente" });
  } catch (error) {
    console.error("❌ Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear la categoría" });
  }
});

/**
 * ✏️ PUT /categorias/:id
 * Actualizar una categoría por su ID
 */
router.put("/:id", verificarAutenticacion, sanitizarEntradas, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const existe = await categoriasModel.obtenerCategoriaPorId(id);
    if (!existe) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoriasModel.actualizarCategoria(id, req.body);
    res.status(200).json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});

/**
 * 🗑️ DELETE /categorias/:id
 * Borrado lógico: cambia el estado a 'inactiva'
 */
router.delete("/:id", verificarAutenticacion, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID de categoría inválido" });
    }

    const categoria = await categoriasModel.obtenerCategoriaPorId(id);
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await categoriasModel.desactivarCategoria(id);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
});

module.exports = router;
