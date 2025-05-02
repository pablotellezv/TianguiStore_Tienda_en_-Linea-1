const db = require("../db/connection");

/**
 * 🔍 Obtener todos los elementos multimedia asociados a un producto.
 * @param {number} producto_id - ID del producto.
 * @returns {Promise<Array>}
 */
async function obtenerGaleriaPorProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM galeria_productos 
    WHERE producto_id = ? 
    ORDER BY orden_visual ASC, fecha_subida ASC
  `, [parseInt(producto_id)]);
  return rows;
}

/**
 * 🖼️ Obtener solo las imágenes asociadas a un producto.
 * @param {number} producto_id
 * @returns {Promise<Array>}
 */
async function obtenerImagenes(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM galeria_productos 
    WHERE producto_id = ? AND tipo = 'imagen'
    ORDER BY orden_visual ASC
  `, [parseInt(producto_id)]);
  return rows;
}

/**
 * 💾 Insertar un nuevo archivo multimedia en la galería de un producto.
 * @param {Object} datos - Objeto con los datos del nuevo elemento.
 */
async function insertarElemento({
  producto_id,
  tipo = "imagen", // 'imagen', 'video', 'modelo_3d'
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

/**
 * ✏️ Actualizar metadatos de un archivo multimedia por su ID.
 * @param {number} media_id
 * @param {Object} datos
 */
async function actualizarElemento(media_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(media_id));
  const sql = `UPDATE galeria_productos SET ${campos.join(", ")} WHERE media_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🗑️ Eliminar un elemento multimedia por su ID.
 * @param {number} media_id
 */
async function eliminarElemento(media_id) {
  await db.query(`
    DELETE FROM galeria_productos WHERE media_id = ?
  `, [parseInt(media_id)]);
}

module.exports = {
  obtenerGaleriaPorProducto,
  obtenerImagenes,
  insertarElemento,
  actualizarElemento,
  eliminarElemento
};
