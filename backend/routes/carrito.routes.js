/**
 * 📁 RUTA: routes/carrito.routes.js
 * 📦 Descripción: API para gestión del carrito de compras de usuarios autenticados.
 * 🔐 Todas las rutas requieren autenticación con JWT.
 */

const express = require("express");
const router = express.Router();

// ✅ Importación corregida
const carritoModel = require("../models/carrito.model");
const { verificarAutenticacion } = require("../middlewares/authMiddleware");
const sanitizarEntradas = require("../middlewares/sanitizeAndValidateMiddleware");

// ───────────────────────────────────────────────
// 🔐 Rutas protegidas (requieren JWT válido)
// ───────────────────────────────────────────────

/**
 * 📦 GET /carrito
 * Obtener todos los productos del carrito del usuario autenticado.
 */
router.get("/", verificarAutenticacion, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const carrito = await carritoModel.obtenerCarritoPorUsuario(usuario_id);
    res.status(200).json(carrito);
  } catch (error) {
    console.error("❌ Error al obtener el carrito:", error);
    res.status(500).json({ mensaje: "Error interno al obtener el carrito." });
  }
});

/**
 * ➕ POST /carrito
 * Agregar un producto al carrito o aumentar su cantidad si ya existe.
 * Body: { producto_id: INT, cantidad: INT }
 */
router.post("/", verificarAutenticacion, sanitizarEntradas, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { producto_id, cantidad } = req.body;

    if (!producto_id || !Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({ mensaje: "Producto y cantidad válidos son requeridos." });
    }

    const existente = await carritoModel.buscarProductoEnCarrito(usuario_id, producto_id);

    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidad;
      await carritoModel.actualizarCantidad(usuario_id, producto_id, nuevaCantidad);
    } else {
      await carritoModel.agregarProducto(usuario_id, producto_id, cantidad);
    }

    res.status(200).json({ mensaje: "Producto agregado al carrito correctamente." });
  } catch (error) {
    console.error("❌ Error al agregar producto al carrito:", error);
    res.status(500).json({ mensaje: "Error al agregar producto al carrito." });
  }
});

/**
 * 🗑️ DELETE /carrito/:id
 * Eliminar un producto específico del carrito por su ID interno.
 */
router.delete("/:id", verificarAutenticacion, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { id } = req.params;

    await carritoModel.eliminarProductoPorId(id, usuario_id);
    res.json({ mensaje: "Producto eliminado del carrito." });
  } catch (error) {
    console.error("❌ Error al eliminar producto del carrito:", error);
    res.status(500).json({ mensaje: "Error al eliminar el producto del carrito." });
  }
});

/**
 * 🧺 DELETE /carrito
 * Vaciar todo el carrito del usuario autenticado.
 */
router.delete("/", verificarAutenticacion, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    await carritoModel.vaciarCarritoPorUsuario(usuario_id);
    res.json({ mensaje: "Carrito vaciado correctamente." });
  } catch (error) {
    console.error("❌ Error al vaciar el carrito:", error);
    res.status(500).json({ mensaje: "Error al vaciar el carrito." });
  }
});

module.exports = router;
