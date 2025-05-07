/**
 * 📁 MODELO: producto.model.js
 * 📦 TABLA: productos
 *
 * Este modelo gestiona todas las operaciones CRUD asociadas a productos
 * dentro del sistema TianguiStore. Permite obtener productos publicados,
 * insertar nuevos registros con estructura extendida, actualizar
 * dinámicamente campos proporcionados y realizar eliminación física.
 */

const db = require("../db/connection");

// ───────────────────────────────────────────────
// 📋 OBTENER TODOS LOS PRODUCTOS PUBLICADOS
// Incluye JOIN con marcas y categorías.
// Solo productos con `publicado = TRUE` y `status = 'activo'`.
// ───────────────────────────────────────────────
async function obtenerProductosPublicados() {
  const [rows] = await db.query(`
    SELECT p.*, m.nombre_marca, c.nombre_categoria
    FROM productos p
    LEFT JOIN marcas m ON p.marca_id = m.marca_id
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
    WHERE p.publicado = TRUE AND p.status = 'activo'
  `);
  return rows;
}

// ───────────────────────────────────────────────
// 🔍 OBTENER PRODUCTO POR ID
// Devuelve un solo producto o `null` si no existe.
// ───────────────────────────────────────────────
async function obtenerProductoPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM productos WHERE producto_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

// ───────────────────────────────────────────────
// ➕ INSERTAR NUEVO PRODUCTO (con insertId)
// Estructura extendida para productos físicos y digitales.
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
    parseFloat(precio),
    parseFloat(descuento),
    parseInt(stock),
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
    estado_visible,
    status,
    tipo_pago,
    peso_kg,
    dimensiones_cm?.trim() || null,
    garantia_meses,
    Boolean(es_digital),
    tipo_digital,
    archivo_descarga_url?.trim() || null,
    clave_acceso?.trim() || null,
    duracion_dias
  ]);

  return result.insertId;
}

// ───────────────────────────────────────────────
// ✏️ ACTUALIZAR PRODUCTO (dinámico por campos)
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

  if (campos.length === 0) return;

  valores.push(parseInt(id));
  const sql = `UPDATE productos SET ${campos.join(", ")} WHERE producto_id = ?`;
  return await db.query(sql, valores);
}

// ───────────────────────────────────────────────
// 🗑️ ELIMINAR PRODUCTO (físico, no lógico)
// Recomendado implementar borrado lógico más adelante.
// ───────────────────────────────────────────────
async function eliminarProducto(id) {
  return await db.query(`
    DELETE FROM productos WHERE producto_id = ?
  `, [parseInt(id)]);
}

// ───────────────────────────────────────────────
// 📤 EXPORTACIÓN DE FUNCIONES
// ───────────────────────────────────────────────
module.exports = {
  obtenerProductosPublicados,
  obtenerProductoPorId,
  insertarProducto,
  actualizarProducto,
  eliminarProducto
};
