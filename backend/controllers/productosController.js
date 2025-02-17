const db = require("../db");

// 📌 Obtener todos los productos
exports.obtenerProductos = (req, res) => {
    db.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            console.error("❌ Error al obtener productos:", error);
            return res.status(500).json({ mensaje: "Error al obtener productos" });
        }
        res.json(resultados);
    });
};

// 📌 Obtener un producto por su ID
exports.obtenerProductoPorId = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM productos WHERE id = ?", [id], (error, resultados) => {
        if (error) {
            console.error(`❌ Error al obtener el producto con ID ${id}:`, error);
            return res.status(500).json({ mensaje: "Error al obtener el producto" });
        }
        if (resultados.length === 0) {
            console.warn(`⚠️ Producto con ID ${id} no encontrado.`);
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(resultados[0]);
    });
};

// 📌 Agregar un nuevo producto
exports.agregarProducto = (req, res) => {
    const { producto_nombre, producto_precio, producto_existencias } = req.body;

    if (!producto_nombre || !producto_precio || !producto_existencias) {
        console.warn("⚠️ Faltan campos obligatorios al agregar producto.");
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    db.query(
        "INSERT INTO productos (producto_nombre, producto_precio, producto_existencias) VALUES (?, ?, ?)",
        [producto_nombre, producto_precio, producto_existencias],
        (error, resultado) => {
            if (error) {
                console.error("❌ Error al agregar producto:", error);
                return res.status(500).json({ mensaje: "Error al agregar producto" });
            }
            console.log(`✅ Producto "${producto_nombre}" agregado correctamente.`);
            res.status(201).json({ mensaje: "Producto agregado correctamente", id: resultado.insertId });
        }
    );
};

// 📌 Actualizar un producto existente
exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const { producto_nombre, producto_precio, producto_existencias } = req.body;

    if (!producto_nombre || !producto_precio || !producto_existencias) {
        console.warn(`⚠️ Falta información para actualizar el producto con ID ${id}.`);
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    db.query(
        "UPDATE productos SET producto_nombre = ?, producto_precio = ?, producto_existencias = ? WHERE id = ?",
        [producto_nombre, producto_precio, producto_existencias, id],
        (error, resultado) => {
            if (error) {
                console.error(`❌ Error al actualizar el producto con ID ${id}:`, error);
                return res.status(500).json({ mensaje: "Error al actualizar producto" });
            }
            if (resultado.affectedRows === 0) {
                console.warn(`⚠️ Producto con ID ${id} no encontrado.`);
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }
            console.log(`✅ Producto con ID ${id} actualizado correctamente.`);
            res.json({ mensaje: "Producto actualizado correctamente" });
        }
    );
};

// 📌 Eliminar un producto
exports.eliminarProducto = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM productos WHERE id = ?", [id], (error, resultado) => {
        if (error) {
            console.error(`❌ Error al eliminar el producto con ID ${id}:`, error);
            return res.status(500).json({ mensaje: "Error al eliminar producto" });
        }
        if (resultado.affectedRows === 0) {
            console.warn(`⚠️ Producto con ID ${id} no encontrado.`);
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        console.log(`✅ Producto con ID ${id} eliminado correctamente.`);
        res.json({ mensaje: "Producto eliminado correctamente" });
    });
};
