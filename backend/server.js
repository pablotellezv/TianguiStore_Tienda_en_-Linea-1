const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Usamos el pool de conexiones, no db.connect()

// Cargar variables de entorno
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

// Detectar entorno
const ENV = process.env.NODE_ENV || "development";
const IS_DEV = ENV !== "production";

// Validar variables críticas
const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `[${new Date().toISOString()}] ❌ Variables de entorno faltantes:`,
    missing.join(", ")
  );
  process.exit(1);
}

// DB_PASSWORD es opcional
if (!process.env.DB_PASSWORD) {
  console.warn(
    `⚠️ [${new Date().toISOString()}] [WARN] DB_PASSWORD no definida; usando "" por defecto.`
  );
  process.env.DB_PASSWORD = "";
}

// Configuración de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 📂 Ruta correcta al directorio public (afuera de backend/)
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Middlewares globales
app.use(express.json()); // Leer JSON
app.use(cors()); // Permitir CORS
app.use(express.static(PUBLIC_DIR)); // Servir archivos estáticos

// Importar rutas API
const authRoutes = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes = require("./routes/carritoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const marcasRoutes = require("./routes/marcasRoutes");

// Registrar rutas API
app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/marcas", marcasRoutes);

// Rutas específicas de HTML
["", "login", "carrito", "registro"].forEach((r) =>
  app.get(`/${r}`, (req, res) =>
    res.sendFile(path.join(PUBLIC_DIR, `${r || "index"}.html`))
  )
);

// Ruta 404 (cuando no encuentra la página)
app.use((req, res) =>
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"))
);

// Middleware global de errores (por si algo falla)
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  res.status(500).json({
    mensaje: "Ha ocurrido un error inesperado.",
    detalles: err.message || err,
  });
});

// 🔌 Verificar conexión a la base de datos antes de arrancar el servidor
async function verificarConexionDB() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexión exitosa a MySQL");
  } catch (error) {
    console.error("❌ Error de conexión a MySQL:", error);
    process.exit(1); // No arranca si falla la DB
  }
}

// 🚀 Función para iniciar el servidor
async function iniciarServidor() {
  await verificarConexionDB();
  app.listen(PORT, () => {
    logStartup();
    console.log(`✅ El servidor está corriendo en http://localhost:${PORT}\n`);
  });
}

// 📋 Función de log al iniciar
function logStartup() {
  const t = new Date().toISOString();
  const url = `http://localhost:${PORT}`;
  console.log(`\n🚀 [${t}] === INICIO DEL SERVIDOR ===`);
  console.log(`  🌐 Entorno     : ${ENV}`);
  console.log(`  🔌 Puerto      : ${PORT}`);
  console.log(`  🗄️  DB_HOST    : ${process.env.DB_HOST}`);
  console.log(`  🔢 DB_PORT     : ${process.env.DB_PORT}`);
  console.log(`  👤 DB_USER     : ${process.env.DB_USER}`);
  console.log(`  📛 DB_NAME     : ${process.env.DB_NAME}`);
  console.log(`  🔓 DB_PASSWORD : ${process.env.DB_PASSWORD ? "✔️ Definido" : "❌ No definido"}`);
  console.log(`  🛣️  Rutas estáticas : /, /login, /carrito, /registro`);
  console.log(`  🔗 API disponible : /auth, /productos, /carrito, /pedidos, /categorias, /marcas`);
  console.log(`  🔐 Autenticación  : JWT`);
  console.log(`  🌍 Servidor en     : ${url}`);
  console.log(`========================================\n`);
}

// Iniciar el servidor
iniciarServidor();
