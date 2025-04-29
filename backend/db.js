// 📦 Carga de entorno
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// 🔍 Verificación de variables críticas
const requiredEnvs = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = requiredEnvs.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`[${new Date().toISOString()}] ❌ Variables de entorno faltantes:`, missing.join(", "));
  process.exit(1);
}

// 🎯 Diagnóstico
console.log("🔍 Verificando credenciales MySQL:");
console.log("  DB_HOST:    ", process.env.DB_HOST);
console.log("  DB_PORT:    ", process.env.DB_PORT || 3306);
console.log("  DB_USER:    ", process.env.DB_USER);
console.log("  DB_PASSWORD:", process.env.DB_PASSWORD ? "✔️ Tiene contraseña" : "❌ Sin contraseña");
console.log("  DB_NAME:    ", process.env.DB_NAME);

// 🔗 Crear pool de conexiones
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Exportar pool para consultas asíncronas
module.exports = pool;
