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

const db = require("../db/connection"); // ✅ Corregido

/**
 * 🧾 GET /api/pedidos
 * Obtener todos los pedidos del sistema (solo admin o gerente).
 */
exports.obtenerPedidos = async (req, res) => {
  try {
    const [resultados] = await db.query(`
      SELECT p.*, u.correo_electronico AS cliente_correo, e.estado_nombre
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.usuario_id
      JOIN estados_pedido e ON p.estado_id = e.estado_id
      WHERE p.borrado_logico = 0
    `);
    res.status(200).json(resultados);
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
    const [resultados] = await db.query(`
      SELECT p.*, e.estado_nombre
      FROM pedidos p
      JOIN estados_pedido e ON p.estado_id = e.estado_id
      WHERE p.usuario_id = ?
      ORDER BY p.fecha_pedido DESC
    `, [usuario.usuario_id]);

    res.status(200).json(resultados);
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
    const [result] = await db.query(`
      CALL sp_crear_pedido_completo(?, ?, ?, ?, ?, ?)
    `, [
      usuario.usuario_id,
      parseFloat(total),
      metodo_pago,
      cupon || null,
      direccion_envio.trim(),
      notas?.trim() || ""
    ]);

    const pedido_id = result?.[0]?.[0]?.pedido_id;
    if (!pedido_id) return res.status(500).json({ mensaje: "Error al generar el pedido" });

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
    const [[{ total }]] = await db.query(`
      SELECT SUM(c.cantidad * p.precio) AS total
      FROM carrito c
      JOIN productos p ON c.producto_id = p.producto_id
      WHERE c.usuario_id = ?
    `, [usuario.usuario_id]);

    if (!total || total <= 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío o sin totales válidos" });
    }

    const { direccion_envio, metodo_pago, cupon = null, notas = "" } = req.body;

    if (!direccion_envio?.trim() || !metodo_pago?.trim()) {
      return res.status(400).json({ mensaje: "Faltan datos para procesar el pedido" });
    }

    const [result] = await db.query(`
      CALL sp_crear_pedido_completo(?, ?, ?, ?, ?, ?)
    `, [
      usuario.usuario_id,
      parseFloat(total),
      metodo_pago,
      cupon,
      direccion_envio.trim(),
      notas.trim()
    ]);

    const pedido_id = result?.[0]?.[0]?.pedido_id;
    if (!pedido_id) {
      return res.status(500).json({ mensaje: "No se generó el pedido correctamente" });
    }

    await db.query(`DELETE FROM carrito WHERE usuario_id = ?`, [usuario.usuario_id]);
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
    const [[pedido]] = await db.query(`
      SELECT * FROM pedidos
      WHERE pedido_id = ? AND usuario_id = ? AND borrado_logico = 0
    `, [pedido_id, usuario.usuario_id]);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado o no autorizado" });
    }

    if (![1, 2].includes(pedido.estado_id)) {
      return res.status(400).json({ mensaje: "El pedido ya no puede cancelarse" });
    }

    await db.query(`
      UPDATE pedidos SET estado_id = 6 WHERE pedido_id = ?
    `, [pedido_id]);

    res.status(200).json({ mensaje: "Pedido cancelado correctamente" });
  } catch (error) {
    console.error("❌ Error al cancelar pedido:", error);
    res.status(500).json({ mensaje: "Error al cancelar pedido" });
  }
};
