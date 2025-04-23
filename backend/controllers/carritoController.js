const db = require("../db");

// 📌 Obtener los productos en el carrito
exports.obtenerCarrito = (req, res) => {
    const usuario_id = req.session?.usuario?.id;

    if (!usuario_id) {
        return res.status(403).json({ mensaje: "No autenticado" });
    }

    db.query("SELECT * FROM carrito WHERE usuario_id = ?", [usuario_id], (error, resultados) => {
        if (error) {
            console.error("❌ Error al obtener el carrito:", error);
            return res.status(500).json({ mensaje: "Error al obtener el carrito" });
        }
        res.json(resultados);
    });
};

// 📌 Agregar un producto al carrito
exports.agregarAlCarrito = (req, res) => {
    const usuario_id = req.session?.usuario?.id;
    const { producto_id, cantidad } = req.body;

    if (!usuario_id) {
        return res.status(403).json({ mensaje: "No autenticado" });
    }

    if (!producto_id || !cantidad || cantidad < 1) {
        return res.status(400).json({ mensaje: "Producto y cantidad obligatorios" });
    }

    // Verificar si ya existe en el carrito
    db.query("SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?", [usuario_id, producto_id], (err, resultados) => {
        if (err) {
            console.error("❌ Error al buscar producto en el carrito:", err);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }

        if (resultados.length > 0) {
            // Ya existe, actualizamos cantidad
            const nuevaCantidad = resultados[0].cantidad + cantidad;
            db.query("UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?",
                [nuevaCantidad, usuario_id, producto_id],
                (error) => {
                    if (error) {
                        return res.status(500).json({ mensaje: "Error al actualizar carrito" });
                    }
                    res.json({ mensaje: "Cantidad actualizada en carrito" });
                }
            );
        } else {
            // No existe, insertamos
            db.query("INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
                [usuario_id, producto_id, cantidad],
                (error) => {
                    if (error) {
                        return res.status(500).json({ mensaje: "Error al agregar al carrito" });
                    }
                    res.json({ mensaje: "Producto agregado al carrito" });
                }
            );
        }
    });
};

// 📌 Eliminar un producto del carrito
exports.eliminarDelCarrito = (req, res) => {
    const usuario_id = req.session?.usuario?.id;
    const { id } = req.params;

    if (!usuario_id) {
        return res.status(403).json({ mensaje: "No autenticado" });
    }

    db.query("DELETE FROM carrito WHERE id = ? AND usuario_id = ?", [id, usuario_id], (error) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al eliminar del carrito" });
        }
        res.json({ mensaje: "Producto eliminado del carrito" });
    });
};

// 📌 Vaciar completamente el carrito del usuario autenticado
exports.vaciarCarrito = (req, res) => {
    const usuario_id = req.session?.usuario?.id;

    if (!usuario_id) {
        return res.status(403).json({ mensaje: "No autenticado" });
    }

    db.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id], (error) => {
        if (error) {
            console.error("❌ Error al vaciar el carrito:", error);
            return res.status(500).json({ mensaje: "Error al vaciar el carrito" });
        }
        res.json({ mensaje: "Carrito vaciado correctamente" });
    });
};
