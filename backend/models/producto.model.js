/**
 * 📁 MODELO: producto.model.js
 * 📦 TABLA: productos
 *
 * Este modelo gestiona las operaciones CRUD para productos en TianguiStore.
 * Incluye control extendido para productos físicos y digitales,
 * soporte para galería multimedia, y lógica de publicación.
 */

const db = require("../db/connection");

// ───────────────────────────────────────────────
// 📋 OBTENER TODOS LOS PRODUCTOS PUBLICADOS
// Incluye JOIN con marcas y categorías.
// ───────────────────────────────────────────────
async function obtenerProductosPublicados() {
  const [rows] = await db.query(`
    SELECT p.*, m.nombre_marca, c.nombre_categoria
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.marca_id
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
    WHERE p.publicado = TRUE AND p.status = 'activo'
    ORDER BY p.nombre ASC
  `);
  return rows;
}

// ───────────────────────────────────────────────
// 🔍 OBTENER PRODUCTO POR ID
// ───────────────────────────────────────────────
async function obtenerProductoPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM productos WHERE producto_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

// ───────────────────────────────────────────────
// ➕ INSERTAR NUEVO PRODUCTO (estructura extendida)
// ───────────────────────────────────────────────
async function insertarProducto(datos) {
  const {
    nombre, slug_producto, descripcion, especificaciones = "",
    precio, descuento = 0, stock = 0,
    categoria_id, marca_id = null, proveedor_id = null, tipo_publicacion_id = null, sku = null,
    imagen_url = null, video_url = null, modelo_3d_url = null,
    stock_ilimitado = false, mostrar_sin_stock = false,
    publicado = false, destacado = false, meses_sin_intereses = false,
    tipo_pago = "efectivo", estado_visible = "visible", status = "activo",
    peso_kg = null, dimensiones_cm = null, garantia_meses = null,
    es_digital = false, tipo_digital = null, archivo_descarga_url = null,
    clave_acceso = null, duracion_dias = null
  } = datos;

  const [result] = await db.query(`
    INSERT INTO productos (
      nombre, slug_producto, descripcion, especificaciones,
      precio, descuento, stock,
      categoria_id, marca_id, proveedor_id, tipo_publicacion_id, sku,
      imagen_url, video_url, modelo_3d_url,
      stock_ilimitado, mostrar_sin_stock,
      publicado, destacado, meses_sin_intereses,
      estado_visible, status, tipo_pago,
      peso_kg, dimensiones_cm, garantia_meses,
      es_digital, tipo_digital, archivo_descarga_url, clave_acceso, duracion_dias
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nombre?.trim(),
    slug_producto?.trim(),
    descripcion?.trim(),
    especificaciones?.trim(),
    Number.isFinite(+precio) ? parseFloat(precio) : 0,
    Number.isFinite(+descuento) ? parseFloat(descuento) : 0,
    Number.isFinite(+stock) ? parseInt(stock) : 0,
    parseInt(categoria_id),
    marca_id ? parseInt(marca_id) : null,
    proveedor_id ? parseInt(proveedor_id) : null,
    tipo_publicacion_id ? parseInt(tipo_publicacion_id) : null,
    sku?.trim() || null,
    imagen_url?.trim() || null,
    video_url?.trim() || null,
    modelo_3d_url?.trim() || null,
    Boolean(stock_ilimitado),
    Boolean(mostrar_sin_stock),
    Boolean(publicado),
    Boolean(destacado),
    Boolean(meses_sin_intereses),
    estado_visible?.trim(),
    status?.trim(),
    tipo_pago?.trim(),
    peso_kg !== null ? parseFloat(peso_kg) : null,
    dimensiones_cm?.trim() || null,
    garantia_meses !== null ? parseInt(garantia_meses) : null,
    Boolean(es_digital),
    tipo_digital?.trim() || null,
    archivo_descarga_url?.trim() || null,
    clave_acceso?.trim() || null,
    duracion_dias !== null ? parseInt(duracion_dias) : null
  ]);

  return result.insertId;
}

// ───────────────────────────────────────────────
// ✏️ ACTUALIZAR PRODUCTO DINÁMICAMENTE
// ───────────────────────────────────────────────
async function actualizarProducto(id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return; // No hay datos a actualizar

  valores.push(parseInt(id));
  const sql = `UPDATE productos SET ${campos.join(", ")} WHERE producto_id = ?`;
  return await db.query(sql, valores);
}

// ───────────────────────────────────────────────
// 🗑️ ELIMINAR PRODUCTO (borrado físico actual)
// ⚠️ Se recomienda cambiar por borrado lógico en producción.
// ───────────────────────────────────────────────
async function eliminarProducto(id) {
  return await db.query(`
    DELETE FROM productos WHERE producto_id = ?
  `, [parseInt(id)]);
}

// 🔍 Obtener producto con datos extendidos (galería, marca, categoría, subcategoría, etc.)
async function obtenerProductoPorIdExtendido(id) {
  const [rows] = await db.query(`
    SELECT 
      p.*, 
      m.nombre_marca, 
      c.nombre_categoria, 
      s.nombre_subcategoria
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.marca_id
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
    LEFT JOIN subcategorias s ON p.subcategoria_id = s.subcategoria_id
    WHERE p.producto_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

// ───────────────────────────────────────────────
// 🔄 OBTENER PRODUCTOS RELACIONADOS POR CATEGORÍA
// (excluye el producto actual, solo productos activos)
// ───────────────────────────────────────────────
async function obtenerProductosRelacionados(producto_id, categoria_id) {
  const [rows] = await db.query(`
    SELECT p.*, m.nombre_marca, c.nombre_categoria
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.marca_id
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
    WHERE p.categoria_id = ?
      AND p.producto_id != ?
      AND p.status = 'activo'
      AND p.publicado = TRUE
    ORDER BY RAND()
    LIMIT 6
  `, [categoria_id, producto_id]);

  return rows;
}

// ───────────────────────────────────────────────
// 📤 EXPORTACIÓN DE FUNCIONES
// ───────────────────────────────────────────────
module.exports = {
  obtenerProductosPublicados,
  obtenerProductoPorId,
  obtenerProductoPorIdExtendido,
  insertarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosRelacionados 
};
