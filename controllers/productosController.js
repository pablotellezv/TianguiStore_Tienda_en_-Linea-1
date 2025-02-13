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
