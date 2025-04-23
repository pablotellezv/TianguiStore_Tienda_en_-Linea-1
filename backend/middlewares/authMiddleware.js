// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * Middleware para verificar el token JWT
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret);
    req.usuario = payload; // ahora disponible en cualquier controlador
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
}

/**
 * Middleware para validar si el usuario tiene uno de los roles permitidos
 * @param {...Number} rolesPermitidos - ID de roles que tienen acceso
 */
function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol_id)) {
      return res.status(403).json({ mensaje: "Acceso denegado." });
    }
    next();
  };
}

module.exports = {
  verificarAutenticacion,
  permitirRoles
};
