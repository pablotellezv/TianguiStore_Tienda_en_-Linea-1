const productosModel = require("../models/productosModel");
const imagenesModel = require("../models/imagenesModel");
const modelos3dModel = require("../models/modelos3dModel");

// 📦 Obtener todos los productos publicados
exports.obtenerProductos = async (req, res) => {
  try {
    const [productos] = await productosModel.obtenerPublicados();
    res.json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

// 🔍 Obtener un producto por su ID (con imágenes y modelo 3D)
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [productos] = await productosModel.obtenerPorId(id);

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const [imagenes] = await imagenesModel.obtenerPorProductoId(id);
    const [modelos] = await modelos3dModel.obtenerPorProductoId(id);

    res.json({
      ...productos[0],
      imagenes: imagenes.map(img => img.url),
      modelo3d: modelos[0]?.ruta_modelo || null
    });
  } catch (error) {
    console.error(`❌ Error al obtener el producto con ID ${req.params.id}:`, error);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

// ➕ Agregar producto vía JSON (API tradicional)
exports.agregarProducto = async (req, res) => {
  try {
    const producto = req.body;

    const campos = ["nombre", "precio", "categoria_id", "proveedor_id"];
    for (const campo of campos) {
      if (!producto[campo]) {
        return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio` });
      }
    }

    const [resultado] = await productosModel.insertarProductoJSON(producto);
    res.status(201).json({
      mensaje: "Producto registrado correctamente. Aún no está publicado.",
      id: resultado.insertId
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    res.status(500).json({ mensaje: "Error al agregar producto" });
  }
};

// 🆕 Agregar producto con imágenes y modelo 3D
exports.agregarProductoConArchivos = async (req, res) => {
  try {
    const datos = req.body;
    const campos = ["nombre", "precio", "categoria_id", "tipo_pago"];
    for (const campo of campos) {
      if (!datos[campo]) {
        return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio` });
      }
    }

    const [resultado] = await productosModel.insertar(datos);
    const productoId = resultado.insertId;

    if (req.files?.imagenes) {
      for (const file of req.files.imagenes) {
        const url = `/uploads/imagenes/${file.filename}`;
        await imagenesModel.insertarImagen(productoId, url);
      }
    }

    if (req.files?.modelo3d?.[0]) {
      const ruta = `/uploads/modelos/${req.files.modelo3d[0].filename}`;
      await modelos3dModel.insertarModelo(productoId, ruta);
    }

    res.status(201).json({ mensaje: "Producto creado correctamente con archivos", id: productoId });
  } catch (error) {
    console.error("❌ Error al agregar producto con archivos:", error);
    res.status(500).json({ mensaje: "Error al agregar producto con archivos" });
  }
};

// ✏️ Actualizar producto existente
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const campos = ["nombre", "precio", "categoria_id"];
    for (const campo of campos) {
      if (!datos[campo]) {
        return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio` });
      }
    }

    const [resultado] = await productosModel.actualizar(id, datos);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto actualizado correctamente" });
  } catch (error) {
    console.error(`❌ Error al actualizar el producto con ID ${req.params.id}:`, error);
    res.status(500).json({ mensaje: "Error al actualizar el producto" });
  }
};

// 🗑️ Eliminar producto por ID
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [resultado] = await productosModel.eliminar(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(`❌ Error al eliminar el producto con ID ${req.params.id}:`, error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
};
