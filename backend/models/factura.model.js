const db = require("../db/connection");

/* =============== FACTURAS =============== */

/**
 * 📋 Obtener todas las facturas emitidas.
 */
async function obtenerFacturas() {
  const [rows] = await db.query(`
    SELECT f.*, u.correo_electronico, p.total
    FROM facturas f
    JOIN usuarios u ON f.usuario_id = u.usuario_id
    JOIN pedidos p ON f.pedido_id = p.pedido_id
    ORDER BY f.fecha_emision DESC
  `);
  return rows;
}

/**
 * 🔍 Obtener factura por pedido.
 */
async function obtenerFacturaPorPedido(pedido_id) {
  const [rows] = await db.query(`
    SELECT * FROM facturas WHERE pedido_id = ?
  `, [parseInt(pedido_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar una nueva factura.
 */
async function crearFactura({
  pedido_id,
  usuario_id,
  folio_fiscal,
  razon_social,
  rfc,
  uso_cfdi,
  metodo_pago,
  forma_pago,
  archivo_pdf_url = null,
  archivo_xml_url = null,
  estatus = "emitida"
}) {
  await db.query(`
    INSERT INTO facturas (
      pedido_id, usuario_id, folio_fiscal,
      razon_social, rfc, uso_cfdi,
      metodo_pago, forma_pago, estatus,
      archivo_pdf_url, archivo_xml_url, fecha_emision
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    parseInt(pedido_id),
    parseInt(usuario_id),
    folio_fiscal?.trim(),
    razon_social?.trim(),
    rfc?.trim(),
    uso_cfdi,
    metodo_pago,
    forma_pago,
    estatus,
    archivo_pdf_url,
    archivo_xml_url
  ]);
}

/**
 * ✏️ Actualizar estado de una factura (por ejemplo, cancelación).
 */
async function actualizarEstatusFactura(factura_id, nuevo_estado) {
  await db.query(`
    UPDATE facturas SET estatus = ? WHERE factura_id = ?
  `, [nuevo_estado, parseInt(factura_id)]);
}

/* =============== MOVIMIENTOS CONTABLES =============== */

/**
 * 📋 Obtener todos los movimientos contables.
 */
async function obtenerMovimientosContables() {
  const [rows] = await db.query(`
    SELECT * FROM movimientos_contables
    ORDER BY fecha DESC
  `);
  return rows;
}

/**
 * ➕ Registrar movimiento contable (ingreso o egreso).
 */
async function registrarMovimiento({
  tipo,
  monto,
  referencia = "",
  descripcion = ""
}) {
  await db.query(`
    INSERT INTO movimientos_contables (
      tipo, monto, referencia, descripcion, fecha
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    tipo,
    parseFloat(monto),
    referencia?.trim(),
    descripcion?.trim()
  ]);
}

module.exports = {
  obtenerFacturas,
  obtenerFacturaPorPedido,
  crearFactura,
  actualizarEstatusFactura,
  obtenerMovimientosContables,
  registrarMovimiento
};
