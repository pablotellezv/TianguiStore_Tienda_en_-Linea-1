// ─────────────────────────────────────────────────────────────
// IMPORTACIONES Y CONFIGURACIÓN INICIAL 🛠️
// ─────────────────────────────────────────────────────────────
// Se importan los módulos esenciales para configurar el servidor, conectarse a la DB,
// establecer medidas de seguridad, gestionar actualizaciones de dependencias y notificar vulnerabilidades.
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const pool = require("./db/connection"); // Pool de conexiones a la base de datos
const Gauge = require("gauge"); // Indicadores visuales para operaciones críticas
const helmet = require("helmet"); // Protege con cabeceras HTTP seguras
const rateLimit = require("express-rate-limit"); // Limita solicitudes para prevenir DoS
const hpp = require("hpp"); // Previene contaminación de parámetros HTTP
const updateNotifier = require("update-notifier").default; // Notifica sobre actualizaciones de dependencias
const { execSync } = require("child_process");

// Instanciar Gauge para monitorizar las operaciones críticas durante el arranque 🔍
const gauge = new Gauge();

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Gestión de dependencias:
// Se notifica al desarrollador si hay actualizaciones disponibles. En entornos de desarrollo,
// y activado mediante AUTO_AUDIT=true, se ejecuta "npm audit fix" para corregir vulnerabilidades.
const pkg = require(path.resolve(__dirname, '..', 'package.json'));
updateNotifier({ pkg }).notify();
if (process.env.AUTO_AUDIT === "true" && process.env.NODE_ENV !== "production") {
  try {
    console.log("🔄 Ejecutando 'npm audit fix' para corregir vulnerabilidades...");
    execSync("npm audit fix", { stdio: "inherit" });
  } catch (e) {
    console.error("❌ Error al ejecutar 'npm audit fix':", e);
  }
}

// Extraer y validar variables de entorno esenciales
const ENV = process.env.NODE_ENV || "development";       // "development" o "production"
const IS_DEV = ENV !== "production";
const PORT = process.env.PORT || 3000;                     // Puerto del servidor
const HOST = process.env.HOST || "localhost";              // Host del servidor

// Validación "fail-fast": variables críticas para la conexión a la base de datos
const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_NAME"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`[${new Date().toISOString()}] ❌ Variables de entorno faltantes: ${missing.join(", ")}`);
  process.exit(1);
}
if (!process.env.DB_PASSWORD) {
  console.warn(`⚠️ [${new Date().toISOString()}] [WARN] DB_PASSWORD no definida; usando cadena vacía por defecto.`);
  process.env.DB_PASSWORD = "";
}

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL SERVIDOR EXPRESS Y MEDIDAS DE SEGURIDAD 🚀
// ─────────────────────────────────────────────────────────────
const app = express();

// Configurar "trust proxy" para despliegues detrás de proxies (Ej: Heroku, Nginx)
if (!IS_DEV) {
  app.set("trust proxy", 1);
}

// Aplicar Helmet para fortalecer cabeceras HTTP
app.use(helmet());
if (!IS_DEV) {
  // Forzar HTTPS mediante HSTS (1 año, con subdominios y preload)
  app.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    })
  );
}
// Eliminar la cabecera "X-Powered-By" para ocultar el motor del backend
app.disable("x-powered-by");

// Configurar rate limiting para prevenir ataques de DoS y fuerza bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: "Demasiadas solicitudes, inténtelo de nuevo más tarde."
});
app.use(limiter);

// Aplicar protección contra HTTP Parameter Pollution
app.use(hpp());

// Configurar CORS: en producción se restringe el acceso al dominio autorizado
if (IS_DEV) {
  app.use(cors());
} else {
  app.use(cors({ origin: process.env.CORS_ORIGIN || "https://tutiendaonline.com" }));
}

// Middleware para parsear JSON
app.use(express.json());

// Definir la carpeta de archivos estáticos (HTML, CSS, JS, etc.)
const PUBLIC_DIR = path.join(__dirname, "..", "public");
app.use(express.static(PUBLIC_DIR));

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE RUTAS DE LA API Y PÁGINAS HTML 📝
// ─────────────────────────────────────────────────────────────
// Se importan las rutas para la API y se configura la entrega de archivos HTML.
// Para prevenir path injection se utiliza una lista blanca de páginas permitidas.
const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productosRoutes");
const carritoRoutes = require("./routes/carritoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const categoriasRoutes = require("./routes/categoriasRoutes");
const marcasRoutes = require("./routes/marcasRoutes");

app.use("/auth", authRoutes);
app.use("/productos", productosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/marcas", marcasRoutes);

// Lista blanca de páginas permitidas para archivos HTML
const allowedPages = ["", "login", "carrito", "registro"];
allowedPages.forEach((page) => {
  app.get(`/${page}`, (req, res) => {
    const fileName = `${page || "index"}.html`;   // "index.html" para el caso de cadena vacía
    const fileToSend = path.join(PUBLIC_DIR, fileName); // Construcción segura de la ruta
    res.sendFile(fileToSend);
  });
});

// Ruta 404: Se entrega una página personalizada para rutas no encontradas
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES 🚑
// ─────────────────────────────────────────────────────────────
// Captura errores inesperados, mostrando detalles sólo en desarrollo.
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);
  const response = {
    mensaje: "Ha ocurrido un error inesperado. Por favor, consulte los logs del servidor."
  };
  if (ENV !== "production") {
    response.detalles = err.message || err.toString();
  }
  res.status(500).json(response);
});

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE INDICADORES (Gauge) 📊
// ─────────────────────────────────────────────────────────────
const GAUGE_MESSAGES = {
  verifyingDB: "⌛ Verificando conexión a la DB...",
  dbSuccess: "✅ Conexión exitosa a la DB",
  dbError: "❌ Error en la conexión a la DB. Revise la configuración...",
  startingServer: "⌛ Arrancando el servidor...",
  serverActive: "🟢 Servidor activo"
};

// ─────────────────────────────────────────────────────────────
// FUNCIÓN DE VERIFICACIÓN DE CONEXIÓN A LA BASE DE DATOS 🔌
// ─────────────────────────────────────────────────────────────
// Realiza una consulta simple para verificar la conectividad a la base de datos.
// En caso de error, se detiene el arranque tras registrar el problema.
async function verificarConexionDB() {
  const timestamp = new Date().toISOString();
  const origen = `${process.env.DB_HOST || "host desconocido"}:${process.env.DB_PORT || "puerto desconocido"}`;
  const contexto = ENV;
  
  gauge.show(GAUGE_MESSAGES.verifyingDB, 0);
  try {
    await pool.query("SELECT 1");
    gauge.show(GAUGE_MESSAGES.dbSuccess, 100);
    console.log(`[${timestamp}] [CONEXIÓN] Origen: ${origen} - Contexto: ${contexto} - ${GAUGE_MESSAGES.dbSuccess}`);
  } catch (error) {
    gauge.pulse(GAUGE_MESSAGES.dbError);
    console.error(`[${timestamp}] [CONEXIÓN] Origen: ${origen} - Contexto: ${contexto} - ${GAUGE_MESSAGES.dbError}`, error);
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN PARA INICIAR EL SERVIDOR 🚀
// ─────────────────────────────────────────────────────────────
// Coordina el arranque del servidor: verifica la base de datos, muestra indicadores y levanta el servicio.
async function iniciarServidor() {
  console.log("🚀 Iniciando el proceso de arranque del servidor...");
  
  await verificarConexionDB();
  gauge.show(GAUGE_MESSAGES.startingServer, 0);
  
  app.listen(PORT, () => {
    gauge.show(GAUGE_MESSAGES.serverActive, 100);
    logStartup();
    const url = `http://${HOST}:${PORT}`;
    console.log(`✅ El servidor está corriendo en ${url}\n`);
  });
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN DE LOG AL INICIAR 📝
// ─────────────────────────────────────────────────────────────
// Muestra la configuración actual del servidor de modo estructurado sin exponer datos sensibles.
function logStartup() {
  const t = new Date().toISOString();
  const url = `http://${HOST}:${PORT}`;
  
  console.log(`\n🚀 [${t}] === INICIO DEL SERVIDOR ===`);
  const details = [
    { label: "Entorno",         value: ENV },
    { label: "Puerto",          value: PORT },
    { label: "DB_HOST",         value: process.env.DB_HOST },
    { label: "DB_PORT",         value: process.env.DB_PORT },
    { label: "DB_USER",         value: process.env.DB_USER },
    { label: "DB_NAME",         value: process.env.DB_NAME },
    { label: "DB_PASSWORD",     value: process.env.DB_PASSWORD ? "✔️ Definido" : "❌ No definido" },
    { label: "Rutas estáticas", value: "/, /login, /carrito, /registro" },
    { label: "API disponible",  value: "/auth, /productos, /carrito, /pedidos, /categorias, /marcas" },
    { label: "Autenticación",   value: "JWT" },
    { label: "Servidor en",     value: url }
  ];
  details.forEach(detail => {
    console.log(`  ${detail.label.padEnd(18)}: ${detail.value}`);
  });
  console.log("========================================\n");
}

// ─────────────────────────────────────────────────────────────
// INICIAR EL SERVIDOR 🔥
// ─────────────────────────────────────────────────────────────
iniciarServidor();