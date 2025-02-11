require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const { registrarUsuario, verificarUsuario } = require("./auth");

const app = express();
const PORT = 3000;

// Middleware de seguridad
app.use(helmet()); // Protege contra XSS y otras amenazas
app.use(cors()); // Permite solicitudes desde el frontend
app.use(bodyParser.json()); // Procesar JSON en las peticiones

// Configurar sesiones
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
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
