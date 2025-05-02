const db = require("../db/connection");
const validator = require("validator");

/**
 * 📦 Obtener los productos del carrito del usuario autenticado.
 */
async function obtenerCarrito(req, res) {
  const usuario_id = req.usuario?.usuario_id;

  if (!usuario_id) return res.status(403).json({ mensaje: "No autenticado." });

  try {
    const [carrito] = await db.query(`
      SELECT c.id, c.cantidad, p.nombre AS producto_nombre, p.precio AS producto_precio
      FROM carrito c
      JOIN productos p ON c.producto_id = p.producto_id
      WHERE c.usuario_id = ?
    `, [usuario_id]);

    res.json(carrito);
  } catch (error) {
    console.error("❌ Error al obtener el carrito:", error);
    res.status(500).json({ mensaje: "Error interno al obtener el carrito." });
  }
}

/**
 * ➕ Agregar producto al carrito o actualizar cantidad si ya existe.
 */
async function agregarAlCarrito(req, res) {
  const usuario_id = req.usuario?.usuario_id;
  const { producto_id, cantidad } = req.body;

  if (!usuario_id) return res.status(403).json({ mensaje: "No autenticado." });

  if (
    !producto_id || !cantidad ||
    !validator.isInt(String(cantidad), { min: 1 }) ||
    !validator.isInt(String(producto_id), { min: 1 })
  ) {
    return res.status(400).json({ mensaje: "Producto y cantidad válidos son requeridos." });
  }

  try {
    const [resultados] = await db.query(
      "SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [usuario_id, producto_id]
    );

    if (resultados.length > 0) {
      const nuevaCantidad = resultados[0].cantidad + Number(cantidad);
      await db.query(
        "UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?",
        [nuevaCantidad, usuario_id, producto_id]
      );
      return res.json({ mensaje: "Cantidad actualizada en el carrito." });
    } else {
      await db.query(
        "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
        [usuario_id, producto_id, cantidad]
      );
      return res.status(201).json({ mensaje: "Producto agregado al carrito." });
    }
  } catch (error) {
    console.error("❌ Error al modificar el carrito:", error);
    res.status(500).json({ mensaje: "Error interno al modificar el carrito." });
  }
}

/**
 * 🗑️ Eliminar un producto específico del carrito.
 */
async function eliminarDelCarrito(req, res) {
  const usuario_id = req.usuario?.usuario_id;
  const { id } = req.params;

  if (!usuario_id) return res.status(403).json({ mensaje: "No autenticado." });
  if (!validator.isInt(id, { min: 1 })) {
    return res.status(400).json({ mensaje: "ID inválido para eliminar del carrito." });
  }

  try {
    await db.query("DELETE FROM carrito WHERE id = ? AND usuario_id = ?", [id, usuario_id]);
    res.json({ mensaje: "Producto eliminado del carrito." });
  } catch (error) {
    console.error("❌ Error al eliminar del carrito:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar del carrito." });
  }
}

/**
 * 🧺 Vaciar por completo el carrito del usuario autenticado.
 */
async function vaciarCarrito(req, res) {
  const usuario_id = req.usuario?.usuario_id;

  if (!usuario_id) return res.status(403).json({ mensaje: "No autenticado." });

  try {
    await db.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);
    res.json({ mensaje: "Carrito vaciado correctamente." });
  } catch (error) {
    console.error("❌ Error al vaciar el carrito:", error);
    res.status(500).json({ mensaje: "Error interno al vaciar el carrito." });
  }
}

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
};
