// 📁 routes/pedido.routes.js
const express = require("express");
const router = express.Router();

// 🧩 Controladores
const {
  obtenerPedidos,
  obtenerMisPedidos,
  crearPedido,
  cancelarPedido,
  crearPedidoDesdeCarrito,
  obtenerProductosDelPedido,
  listarTodosLosPedidos,
  obtenerDetalleCompleto
} = require("../controllers/pedidoController");

// 🔐 Middlewares de seguridad
const {
  verificarAutenticacion,
  verificarPermiso,
} = require("../middlewares/authMiddleware");

// 🧪 Validación de datos
const validarResultados = require("../middlewares/validacion/validarResultados");
const pedidoSchema = require("../middlewares/validacion/pedidoSchema");

// ════════════════════════════════════════════════════════════════
// 📦 CONSULTAS DE PEDIDOS
// ════════════════════════════════════════════════════════════════

// 📄 Obtener todos los pedidos (solo admin o soporte)
router.get(
  "/",
  verificarAutenticacion,
  verificarPermiso("pedidos", "leer"),
  obtenerPedidos
);

// 🧑‍💼 Obtener los pedidos del usuario autenticado
router.get("/mis", verificarAutenticacion, obtenerMisPedidos);

// 🔍 Obtener productos de un pedido específico
router.get("/:id/productos", verificarAutenticacion, obtenerProductosDelPedido);

// 📋 Obtener detalle completo de un pedido (cliente, fecha, total, productos…)
router.get("/:id/detalle", verificarAutenticacion, obtenerDetalleCompleto);

// 🗂️ Obtener todos los pedidos con filtros y paginación (solo admin)
router.get(
  "/admin/listado",
  verificarAutenticacion,
  verificarPermiso("pedidos", "leer"),
  listarTodosLosPedidos
);

// ════════════════════════════════════════════════════════════════
// 🛒 CREACIÓN DE PEDIDOS
// ════════════════════════════════════════════════════════════════

// 🛍️ Crear pedido desde selección directa de productos
router.post(
  "/",
  verificarAutenticacion,
  verificarPermiso("pedidos", "crear"),
  pedidoSchema,
  validarResultados,
  crearPedido
);

// 🛒 Crear pedido desde carrito persistido
router.post(
  "/desde-carrito",
  verificarAutenticacion,
  verificarPermiso("pedidos", "crear"),
  pedidoSchema,
  validarResultados,
  crearPedidoDesdeCarrito
);

// ════════════════════════════════════════════════════════════════
// ❌ GESTIÓN Y CANCELACIÓN
// ════════════════════════════════════════════════════════════════

// ❌ Cancelar pedido (solo si el usuario tiene permiso)
router.put(
  "/:id/cancelar",
  verificarAutenticacion,
  verificarPermiso("pedidos", "cancelar"),
  cancelarPedido
);

module.exports = router;
