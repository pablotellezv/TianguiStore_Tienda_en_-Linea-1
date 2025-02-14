const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Importar rutas (ejemplo)
const authRoutes = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes = require("./routes/carritoRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SECRET_KEY || "clave_por_defecto",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// SERVIR ARCHIVOS ESTÁTICOS: La carpeta public está en el directorio padre de backend
app.use(express.static(path.join(__dirname, "..", "public"), { dotfiles: "ignore" }));
// Ajustar la carpeta `public/` 
app.use(express.static(path.join(__dirname, "../public")));

// RUTA PARA ENVIAR index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});
app.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "carrito.html"));
});
app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "registro.html"));
});

// Otras rutas del servidor
app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
