const db = require("../db");

// **📌 Obtener los productos en el carrito**
exports.obtenerCarrito = (req, res) => {
    db.query("SELECT * FROM carrito", (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al obtener el carrito" });
        }
        res.json(resultados);
    });
};

// **📌 Agregar un producto al carrito**
exports.agregarAlCarrito = (req, res) => {
    const { producto_id, cantidad } = req.body;

    if (!producto_id || !cantidad) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    db.query("INSERT INTO carrito (producto_id, cantidad) VALUES (?, ?)", [producto_id, cantidad], (error) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al agregar al carrito" });
        }
        res.json({ mensaje: "Producto agregado al carrito" });
    });
};

// **📌 Eliminar un producto del carrito**
exports.eliminarDelCarrito = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM carrito WHERE id = ?", [id], (error) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al eliminar del carrito" });
        }
        res.json({ mensaje: "Producto eliminado del carrito" });
    });
};
