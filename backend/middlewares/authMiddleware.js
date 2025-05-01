const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * 🔐 Middleware: Verifica autenticación JWT.
 * Requiere header Authorization: Bearer <token>
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado o formato incorrecto (se espera 'Bearer <token>')." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ mensaje: "Token expirado. Por favor, vuelva a iniciar sesión." });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ mensaje: "Token inválido o manipulado." });
    }

    console.error("❌ Error desconocido al verificar token:", err);
    return res.status(500).json({ mensaje: "Error interno al verificar token." });
  }
}

/**
 * ✅ Middleware: Verifica si el usuario tiene un permiso específico.
 * @param {string} recurso - Ejemplo: "usuarios"
 * @param {string} accion - Ejemplo: "crear", "leer", "actualizar", "eliminar"
 */
function verificarPermiso(recurso, accion) {
  return (req, res, next) => {
    const permisos = req.usuario?.permisos;

    if (!permisos || !permisos[recurso] || permisos[recurso][accion] !== true) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Falta permiso para '${recurso}' → '${accion}'.`
      });
    }

    next();
  };
}

/**
 * ✅ Middleware: Permitir acceso solo si el rol está en la lista
 * @param {...string} rolesPermitidos - Ejemplo: "admin", "cliente", "soporte"
 */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}.`
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
