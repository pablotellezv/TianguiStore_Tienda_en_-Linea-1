require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const { registrarUsuario, verificarUsuario } = require("./auth");
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// Middleware de seguridad
app.use(bodyParser.json()); // Procesar JSON en las peticiones
// Middleware de sesión seguro
app.use(
    session({
        secret: process.env.SECRET_KEY, // 🔹 Usa el SECRET_KEY del archivo .env
        resave: false, // No volver a guardar la sesión si no hay cambios
        saveUninitialized: true, // Guardar sesiones no inicializadas (usuarios nuevos)
        cookie: {
            secure: false, // 🔹 Cambia a true si usas HTTPS en producción
            httpOnly: true, // 🔹 Evita acceso a la cookie desde JavaScript
            maxAge: 1000 * 60 * 60 * 24 // 🔹 Duración de la sesión: 1 día
        }
    })
);


// Servir archivos estáticos desde la carpeta `public/`
app.use(express.static("public", { dotfiles: "ignore" })); // Evita mostrar archivos ocultos

// **📌 Ruta para registrar usuario**
app.post("/registro", async (req, res) => {
    const { email, contraseña } = req.body;
    registrarUsuario(email, contraseña, res);
});

// **📌 Ruta para iniciar sesión**
app.post("/login", (req, res) => {
    const { email, contraseña } = req.body;
    verificarUsuario(email, contraseña, req, res);
});

// **📌 Ruta para cerrar sesión**
app.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ mensaje: "Sesión cerrada" });
});

// **📌 Iniciar el servidor**
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
