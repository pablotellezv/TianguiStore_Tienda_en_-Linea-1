const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// 🔐 Clave secreta para firmar/verificar tokens JWT
const secret = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * ✅ Middleware de autenticación:
 * Verifica que el usuario haya enviado un token JWT válido en el encabezado Authorization.
 * El token debe estar en formato: Bearer <token>.
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);
    req.usuario = payload; // Asignar usuario autenticado a req
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
}

/**
 * ✅ Middleware de autorización por roles:
 * Valida que el usuario autenticado tenga uno de los roles permitidos (texto).
 * @param {...String} rolesPermitidos - Nombres de roles permitidos ("admin", "vendedor", etc.)
 */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "Acceso denegado." });
    }
    next();
  };
}

module.exports = {
  verificarAutenticacion,
  permitirRoles
};
