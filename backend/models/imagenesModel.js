const db = require("../db");

/**
 * 🔍 Obtener todas las URLs de imágenes asociadas a un producto
 * @param {number} producto_id - ID del producto
 * @returns {Promise} - Lista de imágenes
 */
exports.obtenerPorProductoId = (producto_id) => {
  return db.query(
    "SELECT url FROM imagenes_producto WHERE producto_id = ?",
    [producto_id]
  );
};

/**
 * 💾 Insertar una nueva imagen para un producto
 * @param {number} producto_id - ID del producto
 * @param {string} url - Ruta o URL de la imagen
 * @returns {Promise}
 */
exports.insertarImagen = (producto_id, url) => {
  return db.query(
    "INSERT INTO imagenes_producto (producto_id, url) VALUES (?, ?)",
    [producto_id, url]
  );
};
