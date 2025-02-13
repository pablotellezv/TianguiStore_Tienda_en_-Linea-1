require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes = require("./routes/carritoRoutes");

const app = express();
const PORT = 3000;

// ** Middleware de seguridad**
app.use(cors()); // Permitir solicitudes desde otros dominios
app.use(bodyParser.json()); // Procesar JSON en las peticiones

// ** Middleware de sesión seguro**
app.use(
    session({
        secret: process.env.SECRET_KEY || "clave_por_defecto", // Usa clave de .env o una por defecto
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Cambia a true si usas HTTPS en producción
            httpOnly: true, // Evita acceso a la cookie desde JavaScript
            maxAge: 1000 * 60 * 60 * 24 // Duración de la sesión: 1 día
        }
    })
);

// ** Servir archivos estáticos desde la carpeta `public/`**
app.use(express.static("public", { dotfiles: "ignore" })); // Evita mostrar archivos ocultos

// ** Rutas del servidor**
app.use("/auth", authRoutes); // Autenticación (registro, login, logout)
app.use("/productos", productosRoutes); // Gestión de productos
app.use("/carrito", carritoRoutes); // Gestión del carrito de compras

// ** Ruta de prueba**
app.get("/", (req, res) => {
    res.send("✅ Servidor Express en funcionamiento.");
});

// ** Iniciar el servidor**
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
