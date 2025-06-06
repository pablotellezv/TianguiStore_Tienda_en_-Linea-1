/**
 * 📁 MODELO: marketing.model.js
 * 📦 TABLAS: promociones, cupones, precio_volumen, combos
 *
 * Este modelo gestiona las estrategias de marketing y ventas en TianguiStore.
 * Incluye promociones por producto/marca/categoría, cupones, descuentos por volumen,
 * y combos estratégicos con validaciones de vigencia, elegibilidad y prioridad.
 */

const db = require("../db/connection");

// ───────────────────────────────────────────────
// 📋 PROMOCIONES
// ───────────────────────────────────────────────

async function obtenerPromocionesActivas() {
  const [rows] = await db.query(`
    SELECT * FROM promociones
    WHERE activo = TRUE
      AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
    ORDER BY prioridad DESC, fecha_inicio DESC
  `);
  return rows;
}

async function obtenerPromocionPorId(id) {
  const [rows] = await db.query(`
    SELECT * FROM promociones WHERE promocion_id = ?
  `, [parseInt(id)]);
  return rows[0] || null;
}

async function crearPromocion(data) {
  const {
    nombre, descripcion, tipo, valor, tipo_valor = "porcentaje",
    fecha_inicio, fecha_fin,
    categoria_id = null, marca_id = null, producto_id = null,
    cantidad_minima = null, cliente_segmento = null,
    prioridad = 1, etiquetas = null, exclusiva = false,
    activo = true, visible = true
  } = data;

  const [result] = await db.query(`
    INSERT INTO promociones (
      nombre, descripcion, tipo, valor, tipo_valor,
      fecha_inicio, fecha_fin,
      categoria_id, marca_id, producto_id,
      cantidad_minima, cliente_segmento,
      prioridad, etiquetas, exclusiva,
      activo, visible
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nombre?.trim(), descripcion?.trim(), tipo, parseFloat(valor), tipo_valor,
    fecha_inicio, fecha_fin,
    categoria_id ? parseInt(categoria_id) : null,
    marca_id ? parseInt(marca_id) : null,
    producto_id ? parseInt(producto_id) : null,
    cantidad_minima !== null ? parseInt(cantidad_minima) : null,
    cliente_segmento?.trim() || null,
    parseInt(prioridad), etiquetas?.trim() || null, Boolean(exclusiva), Boolean(activo), Boolean(visible)
  ]);

  return result.insertId;
}

async function actualizarPromocion(id, data) {
  const campos = [], valores = [];
  for (const [clave, valor] of Object.entries(data)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }
  if (campos.length === 0) return;
  valores.push(parseInt(id));
  return await db.query(`UPDATE promociones SET ${campos.join(", ")} WHERE promocion_id = ?`, valores);
}

async function eliminarPromocion(id) {
  return await db.query(`UPDATE promociones SET activo = FALSE, visible = FALSE WHERE promocion_id = ?`, [parseInt(id)]);
}

// ───────────────────────────────────────────────
// 🎟️ CUPONES
// ───────────────────────────────────────────────

async function validarCupon(codigo) {
  const [rows] = await db.query(`
    SELECT * FROM cupones
    WHERE codigo = ? AND activo = TRUE AND CURDATE() BETWEEN valido_desde AND valido_hasta
  `, [codigo.trim()]);
  return rows[0] || null;
}

async function crearCupon(data) {
  const {
    codigo, descripcion, valor, tipo_valor = "porcentaje",
    valido_desde, valido_hasta,
    uso_maximo = null, usos_actuales = 0,
    cliente_segmento = null, exclusivo = false, activo = true
  } = data;

  const [result] = await db.query(`
    INSERT INTO cupones (
      codigo, descripcion, valor, tipo_valor,
      valido_desde, valido_hasta,
      uso_maximo, usos_actuales,
      cliente_segmento, exclusivo, activo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    codigo.trim(), descripcion?.trim() || null, parseFloat(valor), tipo_valor,
    valido_desde, valido_hasta,
    uso_maximo !== null ? parseInt(uso_maximo) : null,
    parseInt(usos_actuales),
    cliente_segmento?.trim() || null,
    Boolean(exclusivo), Boolean(activo)
  ]);

  return result.insertId;
}

// ───────────────────────────────────────────────
// 📦 COMBOS Y DESCUENTOS POR VOLUMEN
// ───────────────────────────────────────────────

async function obtenerCombosActivos() {
  const [rows] = await db.query(`
    SELECT * FROM combos WHERE activo = TRUE AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
  `);
  return rows;
}

async function obtenerDescuentosPorVolumen(producto_id) {
  const [rows] = await db.query(`
    SELECT * FROM precio_volumen
    WHERE producto_id = ?
    ORDER BY cantidad_minima ASC
  `, [parseInt(producto_id)]);
  return rows;
}
/**
 * 🔍 Obtener promociones activas específicas para un producto
 */
async function obtenerPromocionesPorProducto(producto_id) {
  const [rows] = await db.query(`
    SELECT *
    FROM promociones
    WHERE activa = TRUE
      AND aplica_a = 'producto'
      AND JSON_EXTRACT(restriccion_json, '$.producto_id') = ?
      AND CURDATE() BETWEEN DATE(fecha_inicio) AND DATE(fecha_fin)
    ORDER BY prioridad DESC, fecha_inicio DESC
  `, [parseInt(producto_id)]);
  return rows;
}



// ───────────────────────────────────────────────
// 📤 EXPORTACIÓN DE FUNCIONES
// ───────────────────────────────────────────────

module.exports = {
  // Promociones
  obtenerPromocionesActivas,
  obtenerPromocionPorId,
  obtenerPromocionesPorProducto,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,

  // Cupones
  validarCupon,
  crearCupon,

  // Combos y volumen
  obtenerCombosActivos,
  obtenerDescuentosPorVolumen
};
