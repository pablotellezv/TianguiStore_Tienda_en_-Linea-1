const express = require("express");
const router = express.Router();

const {
  obtenerPedidos,
  obtenerMisPedidos,
  crearPedido,
  cancelarPedido,
  crearPedidoDesdeCarrito,
  obtenerProductosDelPedido
} = require("../controllers/pedidoController");

const {
  verificarAutenticacion,
  verificarPermiso
} = require("../middlewares/authMiddleware");

const validarResultados = require("../middlewares/validacion/validarResultados");
const pedidoSchema = require("../middlewares/validacion/pedidoSchema");

// 📦 Obtener todos los pedidos (solo admin o soporte)
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("pedidos", "leer"),
  obtenerPedidos
);

// 📦 Obtener solo los pedidos del usuario autenticado (cliente)
router.get(
  "/mis",
  verificarAutenticacion,
  obtenerMisPedidos
);

// 🛒 Crear pedido desde productos directos (frontend)
router.post(
  "/",
  verificarAutenticacion,
  verificarPermiso("pedidos", "crear"),
  pedidoSchema,
  validarResultados,
  crearPedido
);

// 🛍️ Crear pedido desde carrito persistido
router.post(
  "/desde-carrito",
  verificarAutenticacion,
  verificarPermiso("pedidos", "crear"),
  pedidoSchema,
  validarResultados,
  crearPedidoDesdeCarrito
);

// 🧾 Obtener productos de un pedido (cliente o admin)
router.get(
  "/:id/productos",
  verificarAutenticacion,
  obtenerProductosDelPedido
);

// ❌ Cancelar un pedido (cliente propio o admin)
router.put(
  "/:id/cancelar",
  verificarAutenticacion,
  verificarPermiso("pedidos", "cancelar"),
  cancelarPedido
);

module.exports = router;
