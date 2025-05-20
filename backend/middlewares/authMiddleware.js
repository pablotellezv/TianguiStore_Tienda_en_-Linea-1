/**
 * 📁 MIDDLEWARE: authMiddleware.js
 * 🔐 Verificación de autenticación y control de acceso basado en permisos o roles
 */

const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * 🔐 Verifica autenticación JWT
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      mensaje: "Token no proporcionado o formato incorrecto (se espera 'Bearer <token>')."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
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
 * 🛂 Verifica permisos tipo objeto: permisos.recurso.accion === true
 */
function verificarPermiso(recurso, accion) {
  return (req, res, next) => {
    const permisos = req.usuario?.permisos;

    if (
      typeof permisos !== "object" ||
      permisos === null ||
      Array.isArray(permisos) ||
      permisos[recurso]?.[accion] !== true
    ) {
      return res.status(403).json({
        mensaje: `Permiso denegado. Se requiere permiso '${accion}' en '${recurso}'.`
      });
    }

    next();
  };
}

/**
 * 🧾 Permitir acceso solo a ciertos roles
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
