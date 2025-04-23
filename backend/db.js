const path = require("path");
const dotenv = require("dotenv");
require("dotenv").config({
  path: path.resolve(__dirname, ".env")
});
const mysql = require("mysql2");

const requiredEnvs = ["DB_HOST","DB_PORT","DB_USER","DB_NAME"];
const missing = requiredEnvs.filter(key => !process.env[key]);

if (missing.length) {
  console.error(
    `[${new Date().toISOString()}] [FATAL] Variables de entorno faltantes:`,
    missing.join(", ")
  );
  process.exit(1);
}

// Función auxiliar para loggear errores con timestamp y detalles
function logError(label, err) {
    const timestamp = new Date().toISOString();
    console.error(
        `[${timestamp}] [ERROR] [${label}]`,
        {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            message: err.message,
        },
        "\nStack:",
        err.stack
    );
}

// Mostrar valores de conexión (cuidado en producción)
console.log("🔍 Verificando credenciales MySQL:");
console.log("  DB_HOST:    ", process.env.DB_HOST);
console.log("  DB_PORT:    ", process.env.DB_PORT || 3306);
console.log("  DB_USER:    ", process.env.DB_USER);
console.log("  DB_PASSWORD:", process.env.DB_PASSWORD ? "✔️ Tiene contraseña" : "❌ Sin contraseña");
console.log("  DB_NAME:    ", process.env.DB_NAME);

// Crear conexión a MySQL con puerto incluido
const db = mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Intentar conectar
db.connect((err) => {
    if (err) {
        logError("MySQL Connection", err);
        // Opcional: salir si no hay conexión
        process.exit(1);
    }
    console.log(`[${new Date().toISOString()}] ✅ Conectado a MySQL correctamente`);
});

// Escuchar errores en tiempo de ejecución
db.on("error", (err) => {
    logError("MySQL Runtime", err);
});

module.exports = db;
