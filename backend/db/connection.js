/**
 * 📁 MÓDULO: Conexión a MySQL con Pool de Conexiones
 * 
 * 🎯 Descripción:
 *   Este archivo configura la conexión a la base de datos MySQL usando `mysql2/promise`.
 *   Se carga el archivo `.env` para acceder a las variables de entorno y se crea un pool de conexiones para eficiencia y reutilización.
 *   El pool de conexiones es ideal para aplicaciones que requieren múltiples conexiones simultáneas, mejorando el rendimiento al reutilizar conexiones existentes.
 * 
 * 🧩 Dependencias:
 *   - mysql2: Para la creación de conexiones a la base de datos.
 *   - dotenv: Para cargar las variables de entorno desde el archivo `.env`.
 *   - path: Para trabajar con rutas de archivos y asegurar que el archivo `.env` sea cargado correctamente.
 * 
 * 🔒 Seguridad:
 *   - Las credenciales de la base de datos (como usuario y contraseña) no deben estar en el código fuente, por lo que se utilizan variables de entorno.
 *   - Si las variables esenciales están ausentes, el script finalizará con un error.
 * 
 * 🛠️ Configuración:
 *   Asegúrese de que el archivo `.env` contenga las siguientes variables:
 *   - `DB_HOST`: Dirección del host de la base de datos.
 *   - `DB_PORT`: Puerto de la base de datos (opcional, por defecto 3306).
 *   - `DB_USER`: Usuario de la base de datos.
 *   - `DB_PASSWORD`: Contraseña del usuario de la base de datos.
 *   - `DB_NAME`: Nombre de la base de datos a la que se conecta.
 * 
 * ✅ Acceso:
 *   El pool de conexiones es exportado para ser utilizado en otros archivos del backend.
 */

// 📦 Carga de librerías necesarias
const mysql = require("mysql2/promise"); // Usamos la versión 'promise' para trabajar con async/await
const dotenv = require("dotenv"); // Para cargar variables de entorno desde el archivo .env
const path = require("path"); // Para asegurar que la ruta del archivo .env sea correcta

// ✅ Cargar variables de entorno desde archivo .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 🛡️ Verificar que las variables esenciales estén definidas
const requiredEnvs = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"]; // Lista de variables requeridas
const missing = requiredEnvs.filter((key) => !process.env[key]);

// Si faltan variables de entorno, mostrar mensaje de error y finalizar el proceso
if (missing.length > 0) {
  console.error(
    `[${new Date().toISOString()}] ❌ Faltan variables de entorno: ${missing.join(", ")}`
  );
  process.exit(1); // Terminar el proceso si hay errores críticos
}

// 🧪 Diagnóstico básico de conexión (útil en modo desarrollo)
console.log("📡 Configuración de conexión MySQL:");
console.log("   DB_HOST:     ", process.env.DB_HOST);
console.log("   DB_PORT:     ", process.env.DB_PORT || 3306); // Mostrar el puerto, por defecto 3306
console.log("   DB_USER:     ", process.env.DB_USER);
console.log("   DB_PASSWORD: ", process.env.DB_PASSWORD ? "✔️ Oculta" : "❌ Vacía"); // Contraseña oculta por seguridad
console.log("   DB_NAME:     ", process.env.DB_NAME);

// 🔗 Crear un pool de conexiones para eficiencia y reutilización
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Dirección del host de la base de datos
  port: process.env.DB_PORT || 3306, // Puerto (por defecto 3306)
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASSWORD || "", // Contraseña de la base de datos (opcional)
  database: process.env.DB_NAME, // Nombre de la base de datos
  waitForConnections: true, // Habilitar espera de nuevas conexiones si no hay disponibles
  connectionLimit: 10, // Número máximo de conexiones simultáneas
  queueLimit: 0, // Sin límite de espera en la cola
});

// 🌐 Exportar el pool para usar en consultas con async/await
module.exports = pool;
