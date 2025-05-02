const db = require("../db/connection");

/* =============== CATÁLOGO DE REPORTES =============== */

/**
 * 📋 Obtener todos los reportes activos.
 */
async function obtenerReportesActivos() {
  const [rows] = await db.query(`
    SELECT * FROM reportes
    WHERE activo = 1
    ORDER BY nombre_reporte ASC
  `);
  return rows;
}

/**
 * 🔍 Obtener un reporte por ID.
 */
async function obtenerReportePorId(reporte_id) {
  const [rows] = await db.query(`
    SELECT * FROM reportes WHERE reporte_id = ?
  `, [parseInt(reporte_id)]);
  return rows[0] || null;
}

/**
 * ➕ Registrar un nuevo tipo de reporte.
 */
async function crearReporte({
  nombre_reporte,
  descripcion = "",
  tipo = "ventas",
  activo = true
}) {
  await db.query(`
    INSERT INTO reportes (
      nombre_reporte, descripcion, tipo, activo, fecha_creacion
    ) VALUES (?, ?, ?, ?, NOW())
  `, [
    nombre_reporte?.trim(),
    descripcion?.trim(),
    tipo,
    Boolean(activo)
  ]);
}

/**
 * ✏️ Actualizar los datos de un reporte.
 */
async function actualizarReporte(reporte_id, datos) {
  const campos = [];
  const valores = [];

  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== undefined) {
      campos.push(`${clave} = ?`);
      valores.push(typeof valor === "string" ? valor.trim() : valor);
    }
  }

  if (campos.length === 0) return;

  valores.push(parseInt(reporte_id));
  const sql = `UPDATE reportes SET ${campos.join(", ")} WHERE reporte_id = ?`;
  await db.query(sql, valores);
}

/* =============== EJECUCIÓN DE REPORTES =============== */

/**
 * ➕ Registrar una ejecución de reporte.
 */
async function registrarEjecucionReporte({
  reporte_id,
  ejecutado_por,
  exito = true,
  resumen = ""
}) {
  await db.query(`
    INSERT INTO ejecucion_reportes (
      reporte_id, ejecutado_por, fecha_ejecucion, exito, resumen
    ) VALUES (?, ?, NOW(), ?, ?)
  `, [
    parseInt(reporte_id),
    ejecutado_por?.trim(),
    Boolean(exito),
    resumen?.trim()
  ]);
}

/**
 * 📋 Obtener historial de ejecuciones de un reporte.
 */
async function obtenerHistorialEjecuciones(reporte_id) {
  const [rows] = await db.query(`
    SELECT * FROM ejecucion_reportes
    WHERE reporte_id = ?
    ORDER BY fecha_ejecucion DESC
  `, [parseInt(reporte_id)]);
  return rows;
}

module.exports = {
  obtenerReportesActivos,
  obtenerReportePorId,
  crearReporte,
  actualizarReporte,
  registrarEjecucionReporte,
  obtenerHistorialEjecuciones
};
