// backend/routes/pedidoRoutes.js
const express = require("express");
const router = express.Router();
const {
  obtenerPedidos,
  obtenerMisPedidos,
  crearPedido,
  cancelarPedido,
  crearPedidoDesdeCarrito
} = require("../controllers/pedidoController");

const {
  verificarAutenticacion,
  permitirRoles
} = require("../middlewares/authMiddleware");

// 📌 Obtener todos los pedidos (solo admin o soporte pueden ver todos los pedidos)
router.get("/", verificarAutenticacion, permitirRoles("admin", "soporte"), obtenerPedidos);

// 📌 Obtener pedidos propios del cliente autenticado
router.get("/mis", verificarAutenticacion, obtenerMisPedidos);

// 📌 Crear un nuevo pedido (cliente autenticado)
router.post("/", verificarAutenticacion, crearPedido);

// 📌 Crear un pedido directamente desde carrito
router.post("/desde-carrito", verificarAutenticacion, crearPedidoDesdeCarrito);

// 📌 Cancelar un pedido (cliente puede cancelar su pedido, admin puede cancelar cualquiera)
router.put("/:id/cancelar", verificarAutenticacion, cancelarPedido);

module.exports = router;
