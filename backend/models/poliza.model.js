const db = require("../db/connection");

/* =============== CUENTAS CONTABLES =============== */

/**
 * 📋 Obtener catálogo de cuentas contables.
 */
async function obtenerCuentasContables() {
  const [rows] = await db.query(`
    SELECT * FROM cuentas_contables
    ORDER BY codigo ASC
  `);
  return rows;
}

/**
 * ➕ Crear nueva cuenta contable.
 */
async function crearCuentaContable({
  codigo,
  nombre_cuenta,
  tipo,
  descripcion = "",
  nivel = 1,
  padre_id = null
}) {
  await db.query(`
    INSERT INTO cuentas_contables (
      codigo, nombre_cuenta, tipo,
      descripcion, nivel, padre_id, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
  `, [
    codigo?.trim(),
    nombre_cuenta?.trim(),
    tipo,
    descripcion?.trim(),
    parseInt(nivel),
    padre_id ? parseInt(padre_id) : null
  ]);
}

/* =============== PÓLIZAS =============== */

/**
 * 📋 Obtener todas las pólizas (con usuario).
 */
async function obtenerPolizas() {
  const [rows] = await db.query(`
    SELECT p.*, u.nombre AS generado_por
    FROM polizas p
    LEFT JOIN usuarios u ON p.usuario_id = u.usuario_id
    ORDER BY p.fecha DESC
  `);
  return rows;
}

/**
 * ➕ Crear una nueva póliza con sus partidas.
 */
async function crearPolizaCompleta({
  tipo,
  referencia = "",
  descripcion = "",
  usuario_id,
  partidas = [] // [{ cuenta_id, tipo_movimiento, monto, descripcion }]
}) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(`
      INSERT INTO polizas (
        tipo, referencia, descripcion, usuario_id, fecha
      ) VALUES (?, ?, ?, ?, NOW())
    `, [
      tipo,
      referencia?.trim(),
      descripcion?.trim(),
      parseInt(usuario_id)
    ]);

    const poliza_id = result.insertId;

    for (const partida of partidas) {
      await conn.query(`
        INSERT INTO partidas_poliza (
          poliza_id, cuenta_id, tipo_movimiento, monto, descripcion
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        poliza_id,
        parseInt(partida.cuenta_id),
        partida.tipo_movimiento,
        parseFloat(partida.monto),
        partida.descripcion?.trim() || ""
      ]);
    }

    await conn.commit();
    return poliza_id;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

/**
 * 🔍 Obtener partidas de una póliza.
 */
async function obtenerPartidasDePoliza(poliza_id) {
  const [rows] = await db.query(`
    SELECT pp.*, cc.codigo, cc.nombre_cuenta
    FROM partidas_poliza pp
    JOIN cuentas_contables cc ON pp.cuenta_id = cc.cuenta_id
    WHERE pp.poliza_id = ?
    ORDER BY pp.partida_id ASC
  `, [parseInt(poliza_id)]);
  return rows;
}

module.exports = {
  obtenerCuentasContables,
  crearCuentaContable,
  obtenerPolizas,
  crearPolizaCompleta,
  obtenerPartidasDePoliza
};
