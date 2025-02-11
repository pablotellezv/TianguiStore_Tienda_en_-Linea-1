require("dotenv").config();
const mysql = require("mysql2"); // Usa mysql2 en lugar de mysql

// Crear conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar con MySQL:", err.message);
    } else {
        console.log("✅ Conectado a MySQL en phpMyAdmin");
    }
});

module.exports = db;
