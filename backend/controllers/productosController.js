/**
 * 📁 CONTROLADOR: productosController.js
 * 📦 Módulo: Gestión de productos (catálogo principal)
 * 
 * Funcionalidades:
 * - Obtener productos visibles
 * - Consultar detalle con galería
 * - Crear producto (JSON o archivos)
 * - Actualizar producto existente
 * - Eliminar producto (borrado lógico)
 * 
 * Modelos utilizados:
 * - productosModel.js
 * - galeriaModel.js
 */

const productosModel = require("../models/producto.model");
const galeriaModel = require("../models/galeria.model");

// ─────────────────────────────────────────────
// 📥 GET /api/productos
// ─────────────────────────────────────────────
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await productosModel.obtenerProductosPublicados();
    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error interno al obtener productos." });
  }
};

// ─────────────────────────────────────────────
// 🔍 GET /api/productos/:id
// ─────────────────────────────────────────────
exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await productosModel.obtenerProductoPorId(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    const galeria = await galeriaModel.obtenerGaleriaPorProducto(id);
    const imagenes = galeria.filter(g => g.tipo === "imagen").map(g => g.url);
    const modelo3d = galeria.find(g => g.tipo === "modelo_3d")?.url || null;

    res.status(200).json({ ...producto, imagenes, modelo3d });
  } catch (error) {
    console.error(`❌ Error al obtener producto ID ${id}:`, error);
    res.status(500).json({ mensaje: "Error interno al obtener el producto." });
  }
};

// ─────────────────────────────────────────────
// ➕ POST /api/productos
// ─────────────────────────────────────────────
exports.agregarProducto = async (req, res) => {
  const producto = req.body;
  const camposObligatorios = ["nombre", "precio", "categoria_id", "proveedor_id"];

  for (const campo of camposObligatorios) {
    if (!producto[campo]) {
      return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
    }
  }

  try {
    const insertId = await productosModel.insertarProducto(producto);
    res.status(201).json({
      mensaje: "✅ Producto registrado correctamente.",
      id: insertId
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    res.status(500).json({ mensaje: "Error interno al agregar producto." });
  }
};

// ─────────────────────────────────────────────
// 🖼️ POST /api/productos/archivos
// ─────────────────────────────────────────────
exports.agregarProductoConArchivos = async (req, res) => {
  const datos = req.body;
  const camposObligatorios = ["nombre", "precio", "categoria_id", "tipo_pago"];

  for (const campo of camposObligatorios) {
    if (!datos[campo]) {
      return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
    }
  }

  try {
    const productoId = await productosModel.insertarProducto(datos);

    const imagenes = req.files?.imagenes || [];
    for (const archivo of imagenes) {
      await galeriaModel.insertarElemento({
        producto_id: productoId,
        tipo: "imagen",
        url: `/uploads/imagenes/${archivo.filename}`,
        alt_text: datos.nombre
      });
    }

    const modelo3d = req.files?.modelo3d?.[0];
    if (modelo3d) {
      await galeriaModel.insertarElemento({
        producto_id: productoId,
        tipo: "modelo_3d",
        url: `/uploads/modelos/${modelo3d.filename}`
      });
    }

    res.status(201).json({
      mensaje: "✅ Producto creado correctamente con archivos.",
      id: productoId
    });
  } catch (error) {
    console.error("❌ Error al agregar producto con archivos:", error);
    res.status(500).json({ mensaje: "Error interno al crear producto con archivos." });
  }
};

// ─────────────────────────────────────────────
// ✏️ PUT /api/productos/:id
// ─────────────────────────────────────────────
exports.actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const camposObligatorios = ["nombre", "precio", "categoria_id"];

  for (const campo of camposObligatorios) {
    if (!datos[campo]) {
      return res.status(400).json({ mensaje: `El campo '${campo}' es obligatorio.` });
    }
  }

  try {
    await productosModel.actualizarProducto(id, datos);
    res.status(200).json({ mensaje: "✅ Producto actualizado correctamente." });
  } catch (error) {
    console.error(`❌ Error al actualizar producto ID ${id}:`, error);
    res.status(500).json({ mensaje: "Error interno al actualizar producto." });
  }
};

// ─────────────────────────────────────────────
// 🗑️ DELETE /api/productos/:id
// ─────────────────────────────────────────────
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    await productosModel.eliminarProducto(id);
    res.status(200).json({ mensaje: "🗑️ Producto eliminado correctamente." });
  } catch (error) {
    console.error(`❌ Error al eliminar producto ID ${id}:`, error);
    res.status(500).json({ mensaje: "Error interno al eliminar producto." });
  }
};
