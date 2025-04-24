const db = require("../db");

/**
 * 📦 Obtener todos los productos publicados
 * Consulta todos los productos cuyo campo `publicado = TRUE`
 * e incluye nombre de marca y nombre de categoría mediante LEFT JOIN
 */
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

/**
 * 🔍 Obtener un producto por su ID
 * Busca un solo producto mediante `producto_id`
 */
exports.obtenerProductoPorId = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT * FROM productos WHERE producto_id = ?",
        [id],
        (error, resultados) => {
            if (error) {
                console.error(`❌ Error al obtener el producto con ID ${id}:`, error);
                return res.status(500).json({ mensaje: "Error al obtener el producto" });
            }
            if (resultados.length === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }
            res.json(resultados[0]);
        }
    );
};

/**
 * ➕ Agregar un nuevo producto
 * Los productos nuevos se insertan como no publicados (`publicado = FALSE`)
 * Algunos campos son opcionales (descuento, stock, marca, imagen)
 */
exports.agregarProducto = (req, res) => {
    const {
        nombre, descripcion, marca_id, precio, descuento,
        stock, categoria_id, imagen_url, proveedor_id
    } = req.body;

    // Validación de campos requeridos
    if (!nombre || !precio || !categoria_id || !proveedor_id) {
        return res.status(400).json({ mensaje: "Todos los campos obligatorios deben completarse" });
    }

    // Inserción del producto
    db.query(
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
        ],
        (error, resultado) => {
            if (error) {
                console.error("❌ Error al agregar producto:", error);
                return res.status(500).json({ mensaje: "Error al agregar producto" });
            }

            res.status(201).json({
                mensaje: "Producto registrado correctamente. Aún no está publicado.",
                id: resultado.insertId
            });
        }
    );
};

/**
 * ✏️ Actualizar producto existente
 * Todos los campos del formulario deben reenviarse incluso si no cambiaron
 * Se realiza una validación básica y se actualiza por ID
 */
exports.actualizarProducto = (req, res) => {
    const { id } = req.params;
    const {
        nombre, descripcion, marca_id, precio, descuento,
        stock, categoria_id, imagen_url
    } = req.body;

    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ mensaje: "Campos obligatorios incompletos" });
    }

    // Actualización por ID
    db.query(
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
        ],
        (error, resultado) => {
            if (error) {
                console.error(`❌ Error al actualizar el producto con ID ${id}:`, error);
                return res.status(500).json({ mensaje: "Error al actualizar el producto" });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            res.json({ mensaje: "Producto actualizado correctamente" });
        }
    );
};

/**
 * 🗑️ Eliminar producto por ID
 * Elimina completamente el producto si existe en la tabla
 * Es recomendable añadir confirmación desde el frontend
 */
exports.eliminarProducto = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM productos WHERE producto_id = ?", [id], (error, resultado) => {
        if (error) {
            console.error(`❌ Error al eliminar el producto con ID ${id}:`, error);
            return res.status(500).json({ mensaje: "Error al eliminar producto" });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    });
};
