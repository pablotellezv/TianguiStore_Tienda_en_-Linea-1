/**
 * 📁 MIDDLEWARE: authMiddleware.js
 * 🔐 Verificación de autenticación y control de acceso basado en permisos o roles
 *
 * ✅ Usa JWT para identificar usuarios.
 * ✅ Permite validar permisos por recurso/acción.
 * ✅ Permite restringir acceso por roles permitidos.
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔐 Secreto JWT desde .env o uno por defecto (no recomendado en producción)
const JWT_SECRET = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * 🔐 Middleware: Verifica autenticación JWT
 * - Extrae token del header Authorization: Bearer <token>
 * - Inserta el payload JWT en req.usuario
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token no proporcionado o formato incorrecto (se espera 'Bearer <token>')."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // Inyecta los datos del usuario en la petición
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ mensaje: "Token expirado. Por favor, inicie sesión nuevamente." });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ mensaje: "Token inválido o manipulado." });
    }

    console.error("❌ Error inesperado al verificar token:", err);
    return res.status(500).json({ mensaje: "Error interno al verificar autenticación." });
  }
}

/**
 * 🛂 Middleware: Verifica si el usuario tiene permiso para una acción específica
 * @param {string} recurso - Ej. "productos", "usuarios"
 * @param {string} accion - Ej. "crear", "leer", "actualizar", "eliminar"
 */
function verificarPermiso(recurso, accion) {
  return (req, res, next) => {
    const permisos = (typeof req.usuario?.permisos === "object" && !Array.isArray(req.usuario.permisos))
  ? req.usuario.permisos
  : {};


    if (!permisos[recurso] || permisos[recurso][accion] !== true) {
      return res.status(403).json({
        mensaje: `Permiso denegado. Se requiere permiso '${accion}' en '${recurso}'.`
      });
    }

    next();
  };
}

/**
 * 🧾 Middleware: Permitir acceso solo si el rol del usuario está autorizado
 * @param {...string} rolesPermitidos - Ej. "admin", "cliente"
 */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Solo los roles permitidos: ${rolesPermitidos.join(", ")}.`
      });
    }

    next();
  };
}

module.exports = {
  verificarAutenticacion,
  verificarPermiso,
  permitirRoles
};
