/**
 * 📁 UTILIDAD: estadisticasUtil.js
 * 📦 Funciones adicionales para cálculos de estadísticas.
 *
 * 🎯 Funcionalidades:
 *   - Calcular estadísticas personalizadas como ventas en un rango de fechas.
 *   - Calcular estadísticas adicionales (como productos más vendidos, ingresos por categoría, etc.)
 *
 * 💻 Este archivo contiene funciones útiles para calcular estadísticas
 * relacionadas con las ventas, productos y otros datos específicos del sistema.
 * 
 * 🧠 Este archivo también incluye validaciones comunes para asegurarse de que
 * las fechas y otros parámetros sean correctos antes de realizar consultas.
 */

const db = require('../db/connection'); // Asegúrate de importar correctamente la conexión a la base de datos

/**
 * 📝 Función: calcularEstadisticasVentas
 * 🔹 Descripción:
 *   Esta función calcula las ventas totales generadas entre un rango de fechas
 *   proporcionado. Se usa para analizar el rendimiento del sistema de ventas en
 *   un periodo determinado.
 * 
 * 🔄 Proceso:
 *   - Valida que las fechas proporcionadas sean correctas.
 *   - Realiza una consulta para obtener el total de ventas entre las fechas.
 * 
 * 📦 Respuesta esperada:
 *   - Un objeto que contiene el total de ventas dentro del rango especificado.
 *
 * @param {string} fechaInicio - Fecha de inicio en formato 'YYYY-MM-DD'.
 * @param {string} fechaFin - Fecha de fin en formato 'YYYY-MM-DD'.
 * @returns {Promise<Object>} El total de ventas entre el rango de fechas.
 */
async function calcularEstadisticasVentas(fechaInicio, fechaFin) {
  // Validar que las fechas sean correctas
  if (!fechaInicio || !fechaFin) {
    throw new Error('Las fechas de inicio y fin son necesarias.');
  }

  const fechaInicioValida = Date.parse(fechaInicio);
  const fechaFinValida = Date.parse(fechaFin);

  if (isNaN(fechaInicioValida) || isNaN(fechaFinValida)) {
    throw new Error('Las fechas proporcionadas no son válidas.');
  }

  if (fechaFinValida < fechaInicioValida) {
    throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
  }

  // Realizar consulta a la base de datos para obtener las ventas entre las fechas
  const [result] = await db.query(`
    SELECT SUM(total) AS totalVentas
    FROM pedidos
    WHERE fecha BETWEEN ? AND ?
    AND estado = 'completado'
  `, [fechaInicio, fechaFin]);

  // Verificar si hay resultados
  if (!result || result.totalVentas === null) {
    return { totalVentas: 0 }; // Si no hay ventas, retornar 0
  }

  return result; // Retornar el total de ventas
}

/**
 * 📝 Función: calcularEstadisticasProductosVendidos
 * 🔹 Descripción:
 *   Calcula el número total de productos vendidos dentro de un rango de fechas.
 *   Esta función puede ser útil para obtener una visión más detallada de las ventas.
 * 
 * 🔄 Proceso:
 *   - Valida las fechas.
 *   - Consulta el número total de productos vendidos entre las fechas.
 * 
 * 📦 Respuesta esperada:
 *   - Un objeto con el número total de productos vendidos.
 *
 * @param {string} fechaInicio - Fecha de inicio en formato 'YYYY-MM-DD'.
 * @param {string} fechaFin - Fecha de fin en formato 'YYYY-MM-DD'.
 * @returns {Promise<Object>} El número total de productos vendidos en el rango de fechas.
 */
async function calcularEstadisticasProductosVendidos(fechaInicio, fechaFin) {
  // Validar fechas
  if (!fechaInicio || !fechaFin) {
    throw new Error('Las fechas de inicio y fin son necesarias.');
  }

  const fechaInicioValida = Date.parse(fechaInicio);
  const fechaFinValida = Date.parse(fechaFin);

  if (isNaN(fechaInicioValida) || isNaN(fechaFinValida)) {
    throw new Error('Las fechas proporcionadas no son válidas.');
  }

  if (fechaFinValida < fechaInicioValida) {
    throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.');
  }

  // Realizar consulta para contar productos vendidos
  const [result] = await db.query(`
    SELECT SUM(dp.cantidad) AS productosVendidos
    FROM detalle_pedido dp
    JOIN pedidos p ON dp.pedido_id = p.pedido_id
    WHERE p.fecha BETWEEN ? AND ?
    AND p.estado = 'completado'
  `, [fechaInicio, fechaFin]);

  // Verificar si hay resultados
  if (!result || result.productosVendidos === null) {
    return { productosVendidos: 0 }; // Si no hay productos vendidos, retornar 0
  }

  return result; // Retornar la cantidad total de productos vendidos
}

// Exportación de funciones para que estén disponibles en otros archivos
module.exports = {
  calcularEstadisticasVentas,
  calcularEstadisticasProductosVendidos,
};
