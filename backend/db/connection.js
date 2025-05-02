// 📦 Carga de librerías necesarias
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

// ✅ Cargar variables de entorno desde archivo .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 🛡️ Verificar que las variables esenciales estén definidas
const requiredEnvs = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = requiredEnvs.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `[${new Date().toISOString()}] ❌ Faltan variables de entorno: ${missing.join(", ")}`
  );
  process.exit(1); // Terminar el proceso si hay errores críticos
}

// 🧪 Diagnóstico básico de conexión (útil en modo desarrollo)
console.log("📡 Configuración de conexión MySQL:");
console.log("   DB_HOST:     ", process.env.DB_HOST);
console.log("   DB_PORT:     ", process.env.DB_PORT || 3306);
console.log("   DB_USER:     ", process.env.DB_USER);
console.log("   DB_PASSWORD: ", process.env.DB_PASSWORD ? "✔️ Oculta" : "❌ Vacía");
console.log("   DB_NAME:     ", process.env.DB_NAME);

// 🔗 Crear un pool de conexiones para eficiencia y reutilización
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones simultáneas
  queueLimit: 0,        // Sin límite de espera
});

// 🌐 Exportar el pool para usar en consultas con async/await
module.exports = pool;
