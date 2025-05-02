const db = require("../db/connection");

/**
 * 📋 Obtener todos los cupones activos y vigentes.
 */
async function obtenerCuponesActivos() {
  const [rows] = await db.query(`
    SELECT * FROM cupones
    WHERE activo = 1 
      AND (fecha_inicio IS NULL OR CURDATE() >= fecha_inicio)
      AND (fecha_fin IS NULL OR CURDATE() <= fecha_fin)
    ORDER BY fecha_creacion DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener un cupón por su código (para validación).
 * @param {string} codigo
 * @returns {Promise<Object|null>}
 */
async function buscarCuponPorCodigo(codigo) {
  const [rows] = await db.query(`
    SELECT * FROM cupones
    WHERE codigo = ?
      AND activo = 1
      AND (fecha_inicio IS NULL OR CURDATE() >= fecha_inicio)
      AND (fecha_fin IS NULL OR CURDATE() <= fecha_fin)
      AND (uso_maximo IS NULL OR usos_actuales < uso_maximo)
  `, [codigo?.trim()]);
  return rows[0] || null;
}

/**
 * ➕ Crear un nuevo cupón.
 */
async function crearCupon({
  codigo,
  descripcion = "",
  tipo_descuento = "monto",
  valor,
  uso_maximo = null,
  fecha_inicio = null,
  fecha_fin = null,
  activo = true
}) {
  await db.query(`
    INSERT INTO cupones (
      codigo, descripcion, tipo_descuento, valor,
      uso_maximo, usos_actuales, fecha_inicio, fecha_fin,
      activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, NOW())
  `, [
    codigo?.trim(),
    descripcion?.trim(),
    tipo_descuento,
    parseFloat(valor),
    uso_maximo !== null ? parseInt(uso_maximo) : null,
    fecha_inicio,
    fecha_fin,
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar un cupón existente.
 */
async function actualizarCupon(cupon_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(
        typeof valor === "string" ? valor.trim() : valor
      );
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(cupon_id));
  const sql = `UPDATE cupones SET ${campos.join(", ")} WHERE cupon_id = ?`;
  await db.query(sql, valores);
}

/**
 * 🧮 Incrementar uso de un cupón.
 */
async function registrarUsoCupon(codigo) {
  await db.query(`
    UPDATE cupones 
    SET usos_actuales = usos_actuales + 1
    WHERE codigo = ?
  `, [codigo?.trim()]);
}

module.exports = {
  obtenerCuponesActivos,
  buscarCuponPorCodigo,
  crearCupon,
  actualizarCupon,
  registrarUsoCupon
};
