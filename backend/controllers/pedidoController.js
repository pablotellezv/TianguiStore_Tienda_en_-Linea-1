// backend/controllers/pedidoController.js
const db = require("../db");

// Obtener todos los pedidos del admin o gerente
exports.obtenerPedidos = (req, res) => {
    db.query(`
        SELECT p.*, u.usuario_correo AS cliente_correo, e.estado_nombre
        FROM pedidos p
        JOIN usuarios u ON p.cliente_id = u.usuario_id
        JOIN estados_pedido e ON p.estado_id = e.estado_id
    `, (err, resultados) => {
        if (err) {
            console.error("❌ Error al obtener pedidos:", err);
            return res.status(500).json({ mensaje: "Error al obtener pedidos" });
        }
        res.json(resultados);
    });
};

// Obtener los pedidos del cliente autenticado
exports.obtenerMisPedidos = (req, res) => {
    const usuario = req.session?.usuario;
    if (!usuario) {
        return res.status(403).json({ mensaje: "No autenticado" });
    }

    db.query(`
        SELECT p.*, e.estado_nombre
        FROM pedidos p
        JOIN estados_pedido e ON p.estado_id = e.estado_id
        WHERE cliente_id = ?
        ORDER BY fecha_pedido DESC
    `, [usuario.id], (err, resultados) => {
        if (err) {
            console.error("❌ Error al obtener pedidos del cliente:", err);
            return res.status(500).json({ mensaje: "Error al obtener pedidos" });
        }
        res.json(resultados);
    });
};

// Crear un pedido desde productos proporcionados directamente
exports.crearPedido = async (req, res) => {
    const usuario = req.session?.usuario;
    if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

    const { productos, notas } = req.body;

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ mensaje: "Debes incluir productos en el pedido" });
    }

    try {
        // Validar stock disponible
        const erroresStock = [];

        for (const item of productos) {
            const [producto] = await db.promise().query(
                "SELECT nombre, stock FROM productos WHERE producto_id = ?",
                [item.producto_id]
            );

            if (producto.length === 0) {
                erroresStock.push(`Producto ID ${item.producto_id} no encontrado.`);
            } else if (producto[0].stock < item.cantidad) {
                erroresStock.push(`"${producto[0].nombre}" solo tiene ${producto[0].stock} en stock.`);
            }
        }

        if (erroresStock.length > 0) {
            return res.status(400).json({
                mensaje: "Stock insuficiente en algunos productos",
                errores: erroresStock
            });
        }

        // Crear pedido
        const [insertPedido] = await db.promise().query(`
            INSERT INTO pedidos (cliente_id, estado_id, notas)
            VALUES (?, 1, ?)
        `, [usuario.id, notas || null]);

        const pedido_id = insertPedido.insertId;

        // Insertar detalle y actualizar stock
        for (const item of productos) {
            const [producto] = await db.promise().query(
                "SELECT precio, stock FROM productos WHERE producto_id = ?",
                [item.producto_id]
            );

            await db.promise().query(`
                INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            `, [pedido_id, item.producto_id, item.cantidad, producto[0].precio]);

            const nuevoStock = producto[0].stock - item.cantidad;
            await db.promise().query(
                "UPDATE productos SET stock = ? WHERE producto_id = ?",
                [nuevoStock, item.producto_id]
            );
        }

        res.status(201).json({ mensaje: "Pedido creado correctamente", pedido_id });

    } catch (error) {
        console.error("❌ Error al crear pedido:", error);
        res.status(500).json({ mensaje: "Error al crear el pedido" });
    }
};

// Crear un pedido directamente desde el carrito
exports.crearPedidoDesdeCarrito = async (req, res) => {
    const usuario = req.session?.usuario;
    if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

    try {
        // Obtener productos del carrito
        const [carrito] = await db.promise().query(
            "SELECT * FROM carrito WHERE usuario_id = ?", [usuario.id]
        );

        if (carrito.length === 0) {
            return res.status(400).json({ mensaje: "El carrito está vacío" });
        }

        // Verificar stock disponible
        const erroresStock = [];

        for (const item of carrito) {
            const [producto] = await db.promise().query(
                "SELECT nombre, stock FROM productos WHERE producto_id = ?",
                [item.producto_id]
            );

            if (producto.length === 0) {
                erroresStock.push(`Producto ID ${item.producto_id} no encontrado.`);
            } else if (producto[0].stock < item.cantidad) {
                erroresStock.push(`"${producto[0].nombre}" solo tiene ${producto[0].stock} en stock.`);
            }
        }

        if (erroresStock.length > 0) {
            return res.status(400).json({
                mensaje: "Stock insuficiente en algunos productos",
                errores: erroresStock
            });
        }

        // Crear pedido
        const [insert] = await db.promise().query(
            "INSERT INTO pedidos (cliente_id, estado_id) VALUES (?, 1)",
            [usuario.id]
        );
        const pedido_id = insert.insertId;

        // Insertar detalle y actualizar stock
        for (const item of carrito) {
            const [producto] = await db.promise().query(
                "SELECT precio, stock FROM productos WHERE producto_id = ?",
                [item.producto_id]
            );

            await db.promise().query(`
                INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
            `, [pedido_id, item.producto_id, item.cantidad, producto[0].precio]);

            // Actualizar stock
            const nuevoStock = producto[0].stock - item.cantidad;
            await db.promise().query(
                "UPDATE productos SET stock = ? WHERE producto_id = ?",
                [nuevoStock, item.producto_id]
            );
        }

        // Vaciar carrito
        await db.promise().query("DELETE FROM carrito WHERE usuario_id = ?", [usuario.id]);

        res.status(201).json({ mensaje: "Pedido generado correctamente", pedido_id });

    } catch (error) {
        console.error("❌ Error al generar pedido desde carrito:", error);
        res.status(500).json({ mensaje: "Error al procesar el pedido desde carrito" });
    }
};

// Cancelar un pedido si está pendiente
exports.cancelarPedido = (req, res) => {
    const usuario = req.session?.usuario;
    const pedido_id = req.params.id;

    if (!usuario) return res.status(403).json({ mensaje: "No autenticado" });

    db.query(
        "SELECT * FROM pedidos WHERE pedido_id = ? AND cliente_id = ?",
        [pedido_id, usuario.id],
        (err, resultados) => {
            if (err || resultados.length === 0) {
                return res.status(404).json({ mensaje: "Pedido no encontrado o no autorizado" });
            }

            const pedido = resultados[0];
            if (![1, 2].includes(pedido.estado_id)) {
                return res.status(400).json({ mensaje: "El pedido ya no puede cancelarse" });
            }

            db.query("UPDATE pedidos SET estado_id = 6 WHERE pedido_id = ?", [pedido_id], (error) => {
                if (error) {
                    console.error("❌ Error al cancelar pedido:", error);
                    return res.status(500).json({ mensaje: "Error al cancelar pedido" });
                }
                res.json({ mensaje: "Pedido cancelado correctamente" });
            });
        }
    );
};
