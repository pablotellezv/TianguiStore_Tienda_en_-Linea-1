const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes = require("./routes/carritoRoutes");

const app = express();
const PORT = 3000;

// Habilitar CORS con credenciales para sesiones
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(bodyParser.json());

// 📌 Configuración de sesiones
app.use(
    session({
        secret: process.env.SECRET_KEY || "clave_por_defecto",
        resave: false,
        saveUninitialized: false, // Se cambia a false para evitar sesiones innecesarias
        cookie: {
            secure: false, // ⚠️ Cambiar a `true` en producción con HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 día
        },
    })
);

// 📌 Servir archivos estáticos desde `public`
app.use(express.static(path.join(__dirname, "..", "public")));

// 📌 Definir rutas para servir HTML directamente
const paginas = ["", "login", "carrito", "registro"];
paginas.forEach(pagina => {
    app.get(`/${pagina}`, (req, res) => {
        res.sendFile(path.join(__dirname, "..", "public", `${pagina || "index"}.html`));
    });
});

// 📌 Definir las rutas de la API
app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);

// 📌 Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
