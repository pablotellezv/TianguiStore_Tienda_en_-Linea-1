/**
 * TianguiStore | Backend Express Server
 * --------------------------------------
 * @version     0.2.1
 * @description Servidor principal para el backend de TianguiStore.
 *              Maneja las rutas API, seguridad, configuración CORS, validación
 *              de conexión a la base de datos MySQL, manejo de errores y arranque seguro.
 *
 * @author      I.S.C. Erick Renato Vega Ceron
 * @licencia    UNLICENSED-COMMERCIAL-DUAL
 * @fecha       2025-05-08
 */

// ─────────────────────────────────────────────────────────────
// IMPORTACIONES BÁSICAS Y UTILIDADES 🛠️
// ─────────────────────────────────────────────────────────────
const path = require("path"); // Utilizado para gestionar rutas de archivos
const dotenv = require("dotenv"); // Cargar variables de entorno desde un archivo .env
const express = require("express"); // Framework para construir el servidor
const cors = require("cors"); // Habilitar CORS (Cross-Origin Resource Sharing)
const helmet = require("helmet"); // Seguridad HTTP para proteger de vulnerabilidades comunes
const rateLimit = require("express-rate-limit"); // Limitar el número de solicitudes a la API
const hpp = require("hpp"); // Prevención de ataques por contaminación de parámetros
const Gauge = require("gauge"); // Mostrar barras de progreso en la terminal
const { execSync } = require("child_process"); // Ejecutar comandos del sistema (como `npm audit`)
const pool = require("./db/connection"); // Conexión a la base de datos MySQL


// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN Y VARIABLES DE ENTORNO 🌐
// ─────────────────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, ".env") });
const ENV = process.env.NODE_ENV || "development";
const IS_DEV = ENV !== "production";
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Validación de variables obligatorias
const REQUIRED_VARS = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = REQUIRED_VARS.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`[${new Date().toISOString()}] ❌ Variables faltantes: ${missing.join(", ")}`);
  process.exit(1); // Terminar el proceso si faltan variables críticas
}

if (!process.env.DB_PASSWORD) {
  console.warn(`[${new Date().toISOString()}] ⚠️ DB_PASSWORD no definida. Usando cadena vacía.`);
  process.env.DB_PASSWORD = "";
}

// ─────────────────────────────────────────────────────────────
// CONTROL DE DEPENDENCIAS 🔧
// ─────────────────────────────────────────────────────────────
const pkg = require(path.resolve(__dirname, "..", "package.json"));

if (process.env.AUTO_AUDIT === "true" && IS_DEV) {
  try {
    console.log(`[${new Date().toISOString()}] 🔄 Ejecutando auditoría de seguridad...`);
    execSync("npm audit fix", { stdio: "inherit" });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error al ejecutar 'npm audit fix':`, error);
  }
}

// ─────────────────────────────────────────────────────────────
// INSTANCIA DE APP EXPRESS Y MIDDLEWARES DE SEGURIDAD 🛡️
// ─────────────────────────────────────────────────────────────
const app = express();
const gauge = new Gauge();

// Confianza de proxy en producción
if (!IS_DEV) app.set("trust proxy", 1);

// Seguridad HTTP con Helmet
app.use(helmet());
if (!IS_DEV) {
  app.use(
    helmet.hsts({
      maxAge: 31536000,  // 1 año
      includeSubDomains: true,
      preload: true
    })
  );
}
app.disable("x-powered-by"); // Desactiva la cabecera X-Powered-By

// Rate Limiting (limitar el número de peticiones para prevenir ataques DDoS)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 100,  // Máximo de 100 peticiones por ventana
    message: "Demasiadas solicitudes. Intente más tarde."
  })
);

// Prevención de contaminación por parámetros (HPP - HTTP Parameter Pollution)
app.use(hpp());

// Configuración CORS
app.use(cors({ origin: IS_DEV ? "*" : (process.env.CORS_ORIGIN || "https://tutiendaonline.com") }));

// Lectura de JSON
app.use(express.json());

// Archivos estáticos
const PUBLIC_DIR = path.join(__dirname, "..", "public");
app.use(express.static(PUBLIC_DIR));

// ─────────────────────────────────────────────────────────────
// RUTAS DE LA API Y PÁGINAS HTML 📦
// ─────────────────────────────────────────────────────────────
app.use("/auth", require("./routes/auth.routes"));
app.use("/productos", require("./routes/productos.routes"));
app.use("/carrito", require("./routes/carrito.routes"));
app.use("/pedidos", require("./routes/pedido.routes"));
app.use("/categorias", require("./routes/categorias.routes"));
app.use("/marcas", require("./routes/marcas.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));
app.use("/configuracion", require("./routes/configuracion.routes"));
app.use("/estadisticas", require("./routes/estadisticas.routes"));

// Páginas públicas permitidas (whitelist)
["", "login", "carrito", "registro"].forEach((page) => {
  const file = `${page || "index"}.html`;
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
});

// Página 404 personalizada
app.use((req, res) => {
  console.error(`[${new Date().toISOString()}] 404 - Página no encontrada: ${req.originalUrl}`);
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

// ─────────────────────────────────────────────────────────────
// MANEJO GLOBAL DE ERRORES ⛑️
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ❌ Error inesperado:`, err);
  const response = {
    mensaje: "Ha ocurrido un error inesperado. Por favor intente más tarde.",
    ...(IS_DEV && { detalles: err.message || err.toString() }) // Solo muestra detalles del error en desarrollo
  };
  res.status(500).json(response);
});

// ─────────────────────────────────────────────────────────────
// VERIFICACIÓN DE BASE DE DATOS Y ARRANQUE DEL SERVIDOR 🚀
// ─────────────────────────────────────────────────────────────
const GAUGE_MESSAGES = {
  verifyingDB: "⌛ Verificando conexión a la DB...",
  dbSuccess: "✅ Conexión exitosa a la DB",
  dbError: "❌ Error de conexión a la DB",
  startingServer: "⌛ Iniciando servidor...",
  serverActive: "🟢 Servidor activo"
};

async function verificarConexionDB() {
  const origen = `${process.env.DB_HOST}:${process.env.DB_PORT}`;
  const startTime = Date.now();
  gauge.show(GAUGE_MESSAGES.verifyingDB, 0);
  try {
    await pool.query("SELECT 1");  // Verifica la conexión a la base de datos
    const endTime = Date.now();
    const elapsed = ((endTime - startTime) / 1000).toFixed(2);
    gauge.show(GAUGE_MESSAGES.dbSuccess, 100);
    console.log(`[✔] Conectado a MySQL en ${origen} - Tiempo de conexión: ${elapsed} segundos`);
  } catch (err) {
    gauge.pulse(GAUGE_MESSAGES.dbError);
    console.error(`[${new Date().toISOString()}] [✘] Falla al conectar a la base de datos: ${origen}\n`, err);
    process.exit(1);  // Termina el proceso si no puede conectar a la base de datos
  }
}

function logStartup() {
  const t = new Date().toISOString();
  const url = `http://${HOST}:${PORT}`;
  console.log(`\n🚀 [${t}] === INICIO DEL SERVIDOR ===`);
  const config = [
    { label: "Entorno", value: ENV },
    { label: "Puerto", value: PORT },
    { label: "Base de datos", value: process.env.DB_NAME },
    { label: "Usuario DB", value: process.env.DB_USER },
    { label: "Host DB", value: process.env.DB_HOST },
    { label: "API", value: "/auth, /productos, /carrito, /pedidos, /usuarios, etc." },
    { label: "Servidor en", value: url }
  ];
  config.forEach(({ label, value }) => console.log(`  ${label.padEnd(18)}: ${value}`));
  console.log("========================================\n");
}

async function iniciarServidor() {
  console.log(`[${new Date().toISOString()}] 🟡 Iniciando backend TianguiStore...`);
  await verificarConexionDB();  // Verificar la conexión a la base de datos antes de iniciar el servidor
  gauge.show(GAUGE_MESSAGES.startingServer, 0);
  app.listen(PORT, () => {
    gauge.show(GAUGE_MESSAGES.serverActive, 100);
    logStartup();  // Mostrar detalles del servidor cuando esté activo
  });
}

// 🟢 Inicio oficial del backend
iniciarServidor();
