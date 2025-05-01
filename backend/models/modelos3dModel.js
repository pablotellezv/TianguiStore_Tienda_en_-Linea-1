const db = require("../db");

/**
 * 🔍 Obtener la ruta del modelo 3D asociado a un producto
 * @param {number} producto_id - ID del producto
 * @returns {Promise} - Ruta del modelo 3D
 */
exports.obtenerPorProductoId = (producto_id) => {
  return db.query(
    "SELECT ruta_modelo FROM modelos_producto WHERE producto_id = ?",
    [producto_id]
  );
};

/**
 * 💾 Insertar un modelo 3D para un producto
 * @param {number} producto_id - ID del producto
 * @param {string} ruta - Ruta del archivo del modelo 3D
 * @returns {Promise}
 */
exports.insertarModelo = (producto_id, ruta) => {
  return db.query(
    "INSERT INTO modelos_producto (producto_id, ruta_modelo) VALUES (?, ?)",
    [producto_id, ruta]
  );
};
