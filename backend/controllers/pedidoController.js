/**
 * 📁 CONTROLADOR: pedidoController.js
 * 📦 Módulo: Gestión de pedidos en TianguiStore
 *
 * 🎯 Funcionalidades:
 *   - Obtener todos los pedidos (admin/gerente)
 *   - Obtener pedidos del usuario autenticado
 *   - Crear pedido desde formulario
 *   - Crear pedido desde carrito
 *   - Cancelar pedido (condicional por estado)
 *
 * 🔐 Requiere autenticación JWT (req.usuario)
 * 🧠 Basado en procedimiento almacenado: sp_crear_pedido_completo
 */

const pedidoModel = require("../models/pedido.model"); // Uso del modelo para lógica de negocio

/**
 * 🧾 GET /api/pedidos
 * Obtener todos los pedidos del sistema (solo admin o gerente).
 */
exports.obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.obtenerPedidos();
    res.status(200).json(pedidos);
  } catch (err) {
    console.error("❌ Error al obtener pedidos:", err);
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};

/**
 * 🧾 GET /api/mis-pedidos
 * Obtener pedidos del usuario autenticado.
 */
exports.obtenerMisPedidos = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

  try {
    const pedidos = await pedidoModel.obtenerMisPedidos(usuario.usuario_id);
    res.status(200).json(pedidos);
  } catch (err) {
    console.error("❌ Error al obtener pedidos del cliente:", err);
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};

/**
 * ➕ POST /api/pedidos
 * Crear pedido desde formulario manual (con parámetros individuales).
 */
exports.crearPedido = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

  const { total, metodo_pago, cupon, direccion_envio, notas } = req.body;
  if (!total || !metodo_pago || !direccion_envio) {
    return res.status(400).json({ mensaje: "Faltan campos requeridos" });
  }

  try {
    const pedido_id = await pedidoModel.crearPedidoConSP({
      usuario_id: usuario.usuario_id,
      total,
      metodo_pago,
      cupon,
      direccion_envio,
      notas
    });

    res.status(201).json({ mensaje: "Pedido creado correctamente", pedido_id });
  } catch (error) {
    console.error("❌ Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error interno al crear el pedido" });
  }
};

/**
 * 🛒 POST /api/pedidos/carrito
 * Crear pedido a partir del carrito del usuario.
 */
exports.crearPedidoDesdeCarrito = async (req, res) => {
  const usuario = req.usuario;
  if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

  try {
    const totalCarrito = await pedidoModel.calcularTotalCarrito(usuario.usuario_id);
    if (totalCarrito <= 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío o sin totales válidos" });
    }

    const { direccion_envio, metodo_pago, cupon, notas } = req.body;
    if (!direccion_envio || !metodo_pago) {
      return res.status(400).json({ mensaje: "Faltan datos para procesar el pedido" });
    }

    const pedido_id = await pedidoModel.crearPedidoConSP({
      usuario_id: usuario.usuario_id,
      total: totalCarrito,
      metodo_pago,
      cupon,
      direccion_envio,
      notas
    });

    await pedidoModel.limpiarCarrito(usuario.usuario_id);
    res.status(201).json({ mensaje: "Pedido generado correctamente", pedido_id });
  } catch (error) {
    console.error("❌ Error al generar pedido desde carrito:", error);
    res.status(500).json({ mensaje: "Error al procesar el pedido desde carrito" });
  }
};

/**
 * ❌ DELETE /api/pedidos/:id
 * Cancelar un pedido (si es del usuario actual y aún está pendiente).
 */
exports.cancelarPedido = async (req, res) => {
  const usuario = req.usuario;
  const pedido_id = req.params.id;

  if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

  try {
    const pedido = await pedidoModel.obtenerPedidoPorId(pedido_id, usuario.usuario_id);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado o no autorizado" });
    }

    if (![1, 2].includes(pedido.estado_id)) {
      return res.status(400).json({ mensaje: "El pedido ya no puede cancelarse" });
    }

    await pedidoModel.actualizarEstadoPedido(pedido_id, 6); // Estado 6: Cancelado
    res.status(200).json({ mensaje: "Pedido cancelado correctamente" });
  } catch (error) {
    console.error("❌ Error al cancelar pedido:", error);
    res.status(500).json({ mensaje: "Error al cancelar pedido" });
  }
};
