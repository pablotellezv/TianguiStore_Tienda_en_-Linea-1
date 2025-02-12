require("dotenv").config(); // Cargar variables de entorno
const mysql = require("mysql2");

// Verificar que las variables de entorno están cargando
console.log("🔍 Verificando credenciales MySQL:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "✔️ Tiene contraseña" : "❌ Sin contraseña");
console.log("DB_NAME:", process.env.DB_NAME);

// Crear conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar con MySQL:", err.message);
        return;
    }
    console.log("✅ Conectado a MySQL correctamente");
});

module.exports = db;
