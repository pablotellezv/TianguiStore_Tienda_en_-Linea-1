const express = require("express");
const router = express.Router();
const {
    obtenerPedidos,
    obtenerMisPedidos,
    crearPedido,
    cancelarPedido,
    crearPedidoDesdeCarrito
} = require("../controllers/pedidoController");

// 📌 Obtener todos los pedidos (solo admin o gerente)
router.get("/", obtenerPedidos);

// 📌 Obtener los pedidos del cliente autenticado
router.get("/mis", obtenerMisPedidos);

// 📌 Crear un nuevo pedido con datos específicos
router.post("/", crearPedido);

// 📌 Crear un pedido directamente desde el carrito
router.post("/desde-carrito", crearPedidoDesdeCarrito);

// 📌 Cancelar un pedido (si aún está pendiente)
router.put("/:id/cancelar", cancelarPedido);

module.exports = router;
