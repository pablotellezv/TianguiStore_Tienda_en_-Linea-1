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

// 📌 Obtener todos los pedidos (solo admin o gerente)
router.get("/", verificarAutenticacion, permitirRoles(1, 2), obtenerPedidos);

// 📌 Obtener los pedidos del cliente autenticado
router.get("/mis", verificarAutenticacion, obtenerMisPedidos);

// 📌 Crear un nuevo pedido con datos específicos
router.post("/", verificarAutenticacion, crearPedido);

// 📌 Crear un pedido directamente desde el carrito
router.post("/desde-carrito", verificarAutenticacion, crearPedidoDesdeCarrito);

// 📌 Cancelar un pedido (si aún está pendiente)
router.put("/:id/cancelar", verificarAutenticacion, cancelarPedido);

module.exports = router;
