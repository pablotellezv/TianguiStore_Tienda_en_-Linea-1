const db = require("../db");

/**
 * 📦 Obtener todos los productos publicados
 */
exports.obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query(
            `SELECT p.*, m.nombre_marca, c.nombre_categoria
             FROM productos p
             LEFT JOIN marcas m ON p.marca_id = m.marca_id
             LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
             WHERE p.publicado = TRUE`
        );
        res.json(productos);
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
};

/**
 * 🔍 Obtener un producto por su ID
 */
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [productos] = await db.query(
            "SELECT * FROM productos WHERE producto_id = ?",
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(productos[0]);
    } catch (error) {
        console.error(`❌ Error al obtener el producto con ID ${id}:`, error);
        res.status(500).json({ mensaje: "Error al obtener el producto" });
    }
};

/**
 * ➕ Agregar un nuevo producto
 */
exports.agregarProducto = async (req, res) => {
    try {
        const {
            nombre, descripcion, marca_id, precio, descuento,
            stock, categoria_id, imagen_url, proveedor_id
        } = req.body;

        if (!nombre || !precio || !categoria_id || !proveedor_id) {
            return res.status(400).json({ mensaje: "Todos los campos obligatorios deben completarse" });
        }

        const [resultado] = await db.query(
            `INSERT INTO productos 
             (nombre, descripcion, marca_id, precio, descuento, stock, categoria_id, imagen_url, publicado, proveedor_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE, ?)`,
            [
                nombre.trim(),
                descripcion?.trim() || null,
                marca_id || null,
                precio,
                descuento || 0,
                stock || 0,
                categoria_id,
                imagen_url?.trim() || null,
                proveedor_id
            ]
        );

        res.status(201).json({
            mensaje: "Producto registrado correctamente. Aún no está publicado.",
            id: resultado.insertId
        });
    } catch (error) {
        console.error("❌ Error al agregar producto:", error);
        res.status(500).json({ mensaje: "Error al agregar producto" });
    }
};

/**
 * ✏️ Actualizar producto existente
 */
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre, descripcion, marca_id, precio, descuento,
            stock, categoria_id, imagen_url
        } = req.body;

        if (!nombre || !precio || !categoria_id) {
            return res.status(400).json({ mensaje: "Campos obligatorios incompletos" });
        }

        const [resultado] = await db.query(
            `UPDATE productos SET 
                nombre = ?, descripcion = ?, marca_id = ?, precio = ?, 
                descuento = ?, stock = ?, categoria_id = ?, imagen_url = ?
             WHERE producto_id = ?`,
            [
                nombre.trim(),
                descripcion?.trim() || null,
                marca_id || null,
                precio,
                descuento || 0,
                stock || 0,
                categoria_id,
                imagen_url?.trim() || null,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto actualizado correctamente" });
    } catch (error) {
        console.error(`❌ Error al actualizar el producto con ID ${id}:`, error);
        res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
};

/**
 * 🗑️ Eliminar producto por ID
 */
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            "DELETE FROM productos WHERE producto_id = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        console.error(`❌ Error al eliminar el producto con ID ${id}:`, error);
        res.status(500).json({ mensaje: "Error al eliminar producto" });
    }
};
