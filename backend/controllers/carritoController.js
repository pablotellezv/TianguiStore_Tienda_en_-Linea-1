const db = require("../db");
const validator = require("validator");

// 📦 Obtener el contenido del carrito
exports.obtenerCarrito = (req, res) => {
  const usuario_id = req.usuario?.usuario_id;

  if (!usuario_id) {
    return res.status(403).json({ mensaje: "No autenticado." });
  }

  db.query(
    `SELECT c.id, c.cantidad, p.producto_nombre, p.producto_precio
     FROM carrito c
     JOIN productos p ON c.producto_id = p.producto_id
     WHERE c.usuario_id = ?`,
    [usuario_id],
    (err, resultados) => {
      if (err) {
        console.error("❌ Error al obtener el carrito:", err);
        return res.status(500).json({ mensaje: "Error interno al obtener el carrito." });
      }
      res.json(resultados);
    }
  );
};

// ➕ Agregar producto al carrito
exports.agregarAlCarrito = (req, res) => {
  const usuario_id = req.usuario?.usuario_id;
  const { producto_id, cantidad } = req.body;

  if (!usuario_id) {
    return res.status(403).json({ mensaje: "No autenticado." });
  }

  if (
    !producto_id || !cantidad ||
    !validator.isInt(String(cantidad), { min: 1 }) ||
    !validator.isInt(String(producto_id), { min: 1 })
  ) {
    return res.status(400).json({ mensaje: "Producto y cantidad válidos son requeridos." });
  }

  db.query(
    "SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?",
    [usuario_id, producto_id],
    (err, resultados) => {
      if (err) {
        console.error("❌ Error al consultar producto en carrito:", err);
        return res.status(500).json({ mensaje: "Error interno al consultar el carrito." });
      }

      if (resultados.length > 0) {
        // Ya existe → actualizar cantidad
        const nuevaCantidad = resultados[0].cantidad + Number(cantidad);
        db.query(
          "UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?",
          [nuevaCantidad, usuario_id, producto_id],
          (error) => {
            if (error) {
              return res.status(500).json({ mensaje: "Error al actualizar el carrito." });
            }
            res.json({ mensaje: "Cantidad actualizada en el carrito." });
          }
        );
      } else {
        // Nuevo producto en el carrito
        db.query(
          "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
          [usuario_id, producto_id, cantidad],
          (error) => {
            if (error) {
              console.error("❌ Error al insertar en carrito:", error);
              return res.status(500).json({ mensaje: "Error al agregar producto al carrito." });
            }
            res.status(201).json({ mensaje: "Producto agregado al carrito." });
          }
        );
      }
    }
  );
};

// 🗑️ Eliminar producto del carrito
exports.eliminarDelCarrito = (req, res) => {
  const usuario_id = req.usuario?.usuario_id;
  const { id } = req.params;

  if (!usuario_id) {
    return res.status(403).json({ mensaje: "No autenticado." });
  }

  if (!validator.isInt(id, { min: 1 })) {
    return res.status(400).json({ mensaje: "ID de producto inválido." });
  }

  db.query(
    "DELETE FROM carrito WHERE id = ? AND usuario_id = ?",
    [id, usuario_id],
    (err) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error al eliminar el producto del carrito." });
      }
      res.json({ mensaje: "Producto eliminado del carrito." });
    }
  );
};

// 🧺 Vaciar carrito completamente
exports.vaciarCarrito = (req, res) => {
  const usuario_id = req.usuario?.usuario_id;

  if (!usuario_id) {
    return res.status(403).json({ mensaje: "No autenticado." });
  }

  db.query(
    "DELETE FROM carrito WHERE usuario_id = ?",
    [usuario_id],
    (err) => {
      if (err) {
        console.error("❌ Error al vaciar el carrito:", err);
        return res.status(500).json({ mensaje: "Error al vaciar el carrito." });
      }
      res.json({ mensaje: "Carrito vaciado correctamente." });
    }
  );
};
