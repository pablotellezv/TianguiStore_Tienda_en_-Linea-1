const db = require("../db");

// 📌 Obtener todos los productos publicados
exports.obtenerProductos = (req, res) => {
    db.query(
        `SELECT p.*, m.nombre_marca, c.nombre_categoria
         FROM productos p
         LEFT JOIN marcas m ON p.marca_id = m.marca_id
         LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
         WHERE p.publicado = TRUE`,
        (error, resultados) => {
            if (error) {
                console.error("❌ Error al obtener productos:", error);
                return res.status(500).json({ mensaje: "Error al obtener productos" });
            }
            res.json(resultados);
        }
    );
};

// 📌 Obtener un producto por su ID
exports.obtenerProductoPorId = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM productos WHERE producto_id = ?", [id], (error, resultados) => {
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
    const {
        nombre, descripcion, marca_id, precio, descuento,
        stock, categoria_id, imagen_url, proveedor_id
    } = req.body;

    if (!nombre || !precio || !categoria_id || !proveedor_id) {
        console.warn("⚠️ Faltan campos obligatorios al agregar producto.");
        return res.status(400).json({ mensaje: "Todos los campos obligatorios deben completarse" });
    }

    db.query(
        `INSERT INTO productos 
        (nombre, descripcion, marca_id, precio, descuento, stock, categoria_id, imagen_url, publicado, proveedor_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, ?)`,
        [nombre, descripcion, marca_id || null, precio, descuento || 0, stock || 0, categoria_id, imagen_url || null, proveedor_id],
        (error, resultado) => {
            if (error) {
                console.error("❌ Error al agregar producto:", error);
                return res.status(500).json({ mensaje: "Error al agregar producto" });
            }
            console.log(`✅ Producto "${nombre}" agregado correctamente.`);
            res.status(201).json({ mensaje: "Producto registrado, pendiente de publicación", id: resultado.insertId });
        }
    );
};

// 📌 Actualizar un producto existente
exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const {
        nombre, descripcion, marca_id, precio, descuento,
        stock, categoria_id, imagen_url
    } = req.body;

    if (!nombre || !precio || !categoria_id) {
        console.warn(`⚠️ Falta información para actualizar el producto con ID ${id}.`);
        return res.status(400).json({ mensaje: "Todos los campos obligatorios deben completarse" });
    }

    db.query(
        `UPDATE productos SET 
            nombre = ?, descripcion = ?, marca_id = ?, precio = ?, 
            descuento = ?, stock = ?, categoria_id = ?, imagen_url = ? 
         WHERE producto_id = ?`,
        [nombre, descripcion, marca_id, precio, descuento, stock, categoria_id, imagen_url, id],
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

    db.query("DELETE FROM productos WHERE producto_id = ?", [id], (error, resultado) => {
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
