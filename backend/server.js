const path    = require("path");
const dotenv  = require("dotenv");
const express = require("express");
const session = require("express-session");
const cors    = require("cors");
const db      = require("./db");

// Rutas del backend
const authRoutes      = require("./routes/authRoutes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes   = require("./routes/carritoRoutes");
const pedidoRoutes    = require("./routes/pedidoRoutes");

// 🌱 1. Cargar .env desde backend
dotenv.config({ path: path.resolve(__dirname, ".env") });

// 2. Detectar entorno
const ENV    = process.env.NODE_ENV || "development";
const IS_DEV = ENV !== "production";

// 3. Validar variables críticas (¡sin DB_PASSWORD!)
const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
console.log("🔧 Debug → required:", required);
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`❌ [${new Date().toISOString()}] [FATAL] Faltan variables: ${missing.join(", ")}`);
  process.exit(1);
}

// 🔐 4. DB_PASSWORD es opcional
let dbPassword = process.env.DB_PASSWORD;
if (!dbPassword) {
  console.warn(`⚠️ [${new Date().toISOString()}] [WARN] DB_PASSWORD no definida; usando "" por defecto.`);
  process.env.DB_PASSWORD = "";
}

// 🚀 5. Setup de Express
const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: IS_DEV ? "http://localhost:3000" : process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SECRET_KEY || "clave_por_defecto",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: !IS_DEV,
    maxAge: 1000 * 60 * 60 * 24  // 1 día
  },
}));

// 🌐 6. Archivos estáticos y rutas multipágina
app.use(express.static(path.join(__dirname, "..", "public")));
["", "login", "carrito", "registro"].forEach(r =>
  app.get(`/${r}`, (req, res) =>
    res.sendFile(path.join(__dirname, "..", "public", `${r || "index"}.html`))
  )
);

// 🔗 7. Rutas API
app.use("/auth",      authRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito",   carritoRoutes);
app.use("/pedidos",   pedidoRoutes);

// 🚧 8. Ruta 404
app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, "..", "public", "404.html"))
);

// 📊 9. Log de arranque
function logStartup() {
  const t = new Date().toISOString();
  console.log(`\n🚀 [${t}] === SERVER START ===`);
  console.log(`  🌐 ENV        : ${ENV}`);
  console.log(`  🔌 PORT       : ${PORT}`);
  console.log(`  🗄️  DB_HOST     : ${process.env.DB_HOST}`);
  console.log(`  🔢 DB_PORT     : ${process.env.DB_PORT}`);
  console.log(`  👤 DB_USER     : ${process.env.DB_USER}`);
  console.log(`  📛 DB_NAME     : ${process.env.DB_NAME}`);
  console.log(`  🔓 DB_PASSWORD : ${process.env.DB_PASSWORD ? "✔️ definido" : "🔒 vacío"}`);
  console.log(`  🛣️  STATIC     : /, /login, /carrito, /registro`);
  console.log(`  🔗 API        : /auth, /productos, /carrito, /pedidos`);
  console.log(`========================================\n`);
}

// 🔗 10. Iniciar servidor
db.connect(err => {
  if (err) return;  // db.js ya imprime el error
  app.listen(PORT, () => {
    logStartup();
    console.log(`✅ [${new Date().toISOString()}] Server listening on http://localhost:${PORT}\n`);
  });
});
