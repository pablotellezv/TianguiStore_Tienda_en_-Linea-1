/**
 * 📁 MODELO: estadisticas.model.js
 * 📦 FUNCIONES: Métricas globales del sistema TianguiStore
 * 🔍 Este módulo proporciona funciones estadísticas para dashboards.
 * 🔐 Todas las funciones asumen conexión segura con MySQL desde `db/connection`.
 */

const db = require("../db/connection");

/**
 * 🧑‍🤝‍🧑 Función: contarUsuariosActivos
 * 🔹 Descripción:
 *   Cuenta el total de usuarios activos (sin borrado lógico) en el sistema.
 *   Se considera que un usuario es activo si la columna `activo` tiene valor 1 y no está marcado como borrado lógico.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para contar los usuarios activos.
 * 
 * 📦 Respuesta esperada:
 *   - Un número entero que indica el total de usuarios activos.
 */
async function contarUsuariosActivos() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM usuarios
    WHERE activo = 1 AND borrado_logico = 0
  `);
  return rows[0]?.total || 0; // Si no hay usuarios activos, devuelve 0
}

/**
 * 🛒 Función: contarProductosPublicados
 * 🔹 Descripción:
 *   Cuenta el total de productos que están publicados en el sistema.
 *   Un producto se considera publicado cuando su columna `publicado` tiene valor 1.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para contar los productos publicados.
 * 
 * 📦 Respuesta esperada:
 *   - Un número entero que indica el total de productos publicados.
 */
async function contarProductosPublicados() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM productos
    WHERE publicado = 1
  `);
  return rows[0]?.total || 0; // Si no hay productos publicados, devuelve 0
}

/**
 * 📦 Función: contarPedidos
 * 🔹 Descripción:
 *   Cuenta el total de pedidos realizados en la plataforma, sin considerar el borrado lógico.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para contar todos los pedidos.
 * 
 * 📦 Respuesta esperada:
 *   - Un número entero que indica el total de pedidos realizados.
 */
async function contarPedidos() {
  const [rows] = await db.query(`
    SELECT COUNT(*) AS total
    FROM pedidos
  `);
  return rows[0]?.total || 0; // Si no hay pedidos, devuelve 0
}

/**
 * 💰 Función: calcularTotalIngresos
 * 🔹 Descripción:
 *   Calcula la suma total de ingresos generados por pedidos cuyo estado de pago es 'pagado'.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para calcular los ingresos generados por pedidos pagados.
 * 
 * 📦 Respuesta esperada:
 *   - El total de ingresos generados, en formato decimal (float).
 */
async function calcularTotalIngresos() {
  const [rows] = await db.query(`
    SELECT SUM(total) AS ingresos
    FROM pedidos
    WHERE estado_pago = 'pagado'
  `);
  return rows[0]?.ingresos || 0; // Si no hay ingresos, devuelve 0
}

/**
 * 📊 Función: obtenerIngresosMensuales
 * 🔹 Descripción:
 *   Obtiene los ingresos generados por pedidos pagados durante los últimos 6 meses.
 *   Utiliza la función `DATE_FORMAT` de MySQL para agrupar los ingresos por mes.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para obtener los ingresos mensuales.
 * 
 * 📦 Respuesta esperada:
 *   - Un arreglo de objetos con el mes y los ingresos generados durante ese mes.
 */
async function obtenerIngresosMensuales() {
  const [rows] = await db.query(`
    SELECT 
      DATE_FORMAT(fecha_creacion, '%Y-%m') AS mes,
      SUM(total) AS ingresos
    FROM pedidos
    WHERE estado_pago = 'pagado'
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 6
  `);
  return rows;
}

/**
 * 🏆 Función: obtenerTopProductosVendidos
 * 🔹 Descripción:
 *   Obtiene los 5 productos más vendidos en términos de cantidad total vendida.
 *   Se agrupan por el producto y se ordenan de mayor a menor cantidad vendida.
 * 
 * 🔄 Proceso:
 *   - Realiza una consulta a la base de datos para obtener los 5 productos más vendidos.
 * 
 * 📦 Respuesta esperada:
 *   - Un arreglo de objetos con el nombre del producto y la cantidad total vendida.
 */
async function obtenerTopProductosVendidos() {
  const [rows] = await db.query(`
    SELECT 
      p.nombre AS producto,
      SUM(dp.cantidad) AS total_vendidos
    FROM detalle_pedido dp
    JOIN productos p ON dp.producto_id = p.producto_id
    GROUP BY dp.producto_id
    ORDER BY total_vendidos DESC
    LIMIT 5
  `);
  return rows;
}

// Exportar las funciones para que estén disponibles en otros archivos
module.exports = {
  contarUsuariosActivos,
  contarProductosPublicados,
  contarPedidos,
  calcularTotalIngresos,
  obtenerIngresosMensuales,
  obtenerTopProductosVendidos
};
