/**
 * 📁 MODELO: configuracion.model.js
 * 📦 TABLA: configuraciones
 *
 * Modelo de configuración central del sistema TianguiStore.
 * Maneja claves de configuración global con validación por tipo.
 * Se incluye carga inicial por defecto y actualización dinámica segura.
 */

const db = require("../db/connection");

// ─────────────────────────────────────────────
// ⚙️ CONFIGURACIONES POR DEFECTO DEL SISTEMA
// ─────────────────────────────────────────────
const CONFIGURACION_DEFAULT = [
  { clave: "nombre_sitio", valor: "TianguiStore", tipo: "texto", descripcion: "Nombre comercial visible" },
  { clave: "modo_mantenimiento", valor: "false", tipo: "booleano", descripcion: "Modo mantenimiento activado/desactivado" },
  { clave: "moneda", valor: "MXN", tipo: "texto", descripcion: "Moneda predeterminada (ISO 4217)" },
  { clave: "porcentaje_impuesto", valor: "16", tipo: "número", descripcion: "Porcentaje de IVA" },
  { clave: "impuestos_incluidos", valor: "true", tipo: "booleano", descripcion: "¿Precios incluyen impuestos?" },
  { clave: "correo_contacto", valor: "soporte@tianguistore.com", tipo: "email", descripcion: "Correo visible de contacto" },
  { clave: "logo_url", valor: "/imagenes/logo.png", tipo: "url", descripcion: "Logo del sitio" },
  { clave: "promociones_activas", valor: "true", tipo: "booleano", descripcion: "¿Mostrar promociones activas?" },
  { clave: "mostrar_combos", valor: "true", tipo: "booleano", descripcion: "¿Combos de productos habilitados?" },
  { clave: "mostrar_cupones", valor: "true", tipo: "booleano", descripcion: "¿Permitir cupones en checkout?" },
  { clave: "max_productos_gratis", valor: "15", tipo: "número", descripcion: "Productos visibles en plan gratuito" },
  { clave: "dias_publicacion_destacada", valor: "7", tipo: "número", descripcion: "Duración de producto destacado" },
  { clave: "politica_privacidad_url", valor: "/legal/privacidad.html", tipo: "url", descripcion: "Ruta a aviso de privacidad" },
  { clave: "mensaje_bienvenida", valor: "¡Bienvenido a TianguiStore!", tipo: "texto", descripcion: "Texto para nuevos usuarios" },
];

// ─────────────────────────────────────────────
// 🧠 VALIDAR TIPO DE VALOR
// ─────────────────────────────────────────────
function validarTipoValor(tipo, valor) {
  switch (tipo) {
    case "booleano": return valor === "true" || valor === "false";
    case "número": return !isNaN(parseFloat(valor));
    case "json":
      try { JSON.parse(valor); return true; } catch { return false; }
    case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    case "url": return /^https?:\/\/|^\/[\w\-]/.test(valor);
    default: return typeof valor === "string";
  }
}

// ─────────────────────────────────────────────
// 🧩 CARGA AUTOMÁTICA DE CONFIGURACIÓN INICIAL
// ─────────────────────────────────────────────
async function inicializarConfiguracionDefault() {
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM configuraciones");
  if (rows[0].total === 0) {
    for (const conf of CONFIGURACION_DEFAULT) {
      await db.query(`
        INSERT INTO configuraciones (clave, valor, tipo, descripcion)
        VALUES (?, ?, ?, ?)
      `, [conf.clave, conf.valor, conf.tipo, conf.descripcion]);
    }
    console.log("✅ Configuración por defecto aplicada.");
  }
}

// ─────────────────────────────────────────────
// 📋 OBTENER TODAS LAS CONFIGURACIONES
// ─────────────────────────────────────────────
async function obtenerTodasConfiguraciones() {
  const [rows] = await db.query("SELECT * FROM configuraciones ORDER BY clave");
  return rows;
}

// ─────────────────────────────────────────────
// 🔍 OBTENER UNA CONFIGURACIÓN POR CLAVE
// ─────────────────────────────────────────────
async function obtenerConfiguracionPorClave(clave) {
  const [rows] = await db.query(
    "SELECT * FROM configuraciones WHERE clave = ? LIMIT 1",
    [clave.trim()]
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────
// 💾 GUARDAR O ACTUALIZAR CONFIGURACIÓN
// ─────────────────────────────────────────────
async function guardarConfiguracion(clave, valor, tipo = null, descripcion = null) {
  const claveVal = clave.trim();
  const tipoFinal = tipo || (await obtenerConfiguracionPorClave(claveVal))?.tipo || "texto";

  if (!validarTipoValor(tipoFinal, valor)) {
    throw new Error(`⚠️ Valor inválido para el tipo "${tipoFinal}" en la clave "${clave}"`);
  }

  const [res] = await db.query(`
    INSERT INTO configuraciones (clave, valor, tipo, descripcion, updated_at)
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      valor = VALUES(valor),
      tipo = COALESCE(VALUES(tipo), tipo),
      descripcion = COALESCE(VALUES(descripcion), descripcion),
      updated_at = NOW()
  `, [claveVal, valor, tipoFinal, descripcion]);

  return res;
}

// ─────────────────────────────────────────────
// 🗑️ ELIMINAR CONFIGURACIÓN POR CLAVE
// ─────────────────────────────────────────────
async function eliminarConfiguracion(clave) {
  return await db.query("DELETE FROM configuraciones WHERE clave = ?", [clave.trim()]);
}

// ─────────────────────────────────────────────
// 📤 EXPORTACIÓN
// ─────────────────────────────────────────────
module.exports = {
  inicializarConfiguracionDefault,
  obtenerTodasConfiguraciones,
  obtenerConfiguracionPorClave,
  guardarConfiguracion,
  eliminarConfiguracion,
  validarTipoValor
};
