const db = require("../db");

// **📌 Obtener todos los productos**
exports.obtenerProductos = (req, res) => {
    db.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al obtener productos" });
        }
        res.json(resultados);
    });
};

// **📌 Obtener un producto por su ID**
exports.obtenerProductoPorId = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM productos WHERE id = ?", [id], (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al obtener el producto" });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(resultados[0]);
    });
};

// **📌 Agregar un nuevo producto**
exports.agregarProducto = (req, res) => {
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    db.query("INSERT INTO productos (nombre, precio) VALUES (?, ?)", [nombre, precio], (error) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al agregar producto" });
        }
        res.json({ mensaje: "Producto agregado correctamente" });
    });
};
