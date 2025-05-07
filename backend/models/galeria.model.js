/**
 * 📁 MODELO: galeria.model.js
 * 📦 TABLA: galeria_productos
 *
 * Este modelo permite gestionar todos los elementos multimedia asociados
 * a un producto: imágenes, videos, modelos 3D. Soporta inserción, obtención,
 * edición de metadatos y eliminación por ID.
 */

const db = require("../db/connection");

// ───────────────────────────────────────────────
// 🔍 OBTENER GALERÍA COMPLETA DE UN PRODUCTO
// Incluye cualquier tipo ('imagen', 'video', 'modelo_3d')
// Ordenado por orden_visual y fecha_subida
// ───────────────────────────────────────────────
async function obtenerGaleriaPorProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM galeria_productos 
    WHERE producto_id = ? 
    ORDER BY orden_visual ASC, fecha_subida ASC
  `, [parseInt(producto_id)]);
  return rows;
}

// ───────────────────────────────────────────────
// 🖼️ OBTENER SOLO LAS IMÁGENES
// Filtra por tipo = 'imagen'
// ───────────────────────────────────────────────
async function obtenerImagenes(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM galeria_productos 
    WHERE producto_id = ? AND tipo = 'imagen'
    ORDER BY orden_visual ASC
  `, [parseInt(producto_id)]);
  return rows;
}

// ───────────────────────────────────────────────
// 💾 INSERTAR NUEVO ELEMENTO MULTIMEDIA
// El campo `tipo` debe ser: 'imagen', 'video', 'modelo_3d'
// ───────────────────────────────────────────────
async function insertarElemento({
  producto_id,
  tipo = "imagen",
  url,
  alt_text = "",
  orden_visual = 0,
  destacada = false
}) {
  await db.query(`
    INSERT INTO galeria_productos (
      producto_id, tipo, url, alt_text, orden_visual, destacada
    ) VALUES (?, ?, ?, ?, ?, ?)
  `, [
    parseInt(producto_id),
    tipo,
    url?.trim(),
    alt_text?.trim(),
    parseInt(orden_visual),
    Boolean(destacada)
  ]);
}

// ───────────────────────────────────────────────
// ✏️ ACTUALIZAR UN ELEMENTO MULTIMEDIA
// Permite modificar campos dinámicamente.
// ───────────────────────────────────────────────
async function actualizarElemento(media_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return; // Nada que actualizar

  valores.push(parseInt(media_id));
  const sql = `UPDATE galeria_productos SET ${campos.join(", ")} WHERE media_id = ?`;
  await db.query(sql, valores);
}

// ───────────────────────────────────────────────
// 🗑️ ELIMINAR UN ELEMENTO MULTIMEDIA POR ID
// ───────────────────────────────────────────────
async function eliminarElemento(media_id) {
  await db.query(`
    DELETE FROM galeria_productos WHERE media_id = ?
  `, [parseInt(media_id)]);
}

// ───────────────────────────────────────────────
// 📦 EXPORTACIÓN DEL MODELO
// ───────────────────────────────────────────────
module.exports = {
  obtenerGaleriaPorProducto,
  obtenerImagenes,
  insertarElemento,
  actualizarElemento,
  eliminarElemento
};
