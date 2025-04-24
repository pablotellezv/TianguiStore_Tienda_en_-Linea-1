const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// 🔐 Clave secreta para firmar/verificar tokens JWT
const secret = process.env.JWT_SECRET || "clave_predeterminada";

/**
 * ✅ Middleware de autenticación:
 * Verifica que el usuario haya enviado un token JWT válido en el encabezado Authorization.
 * El token debe estar en formato: Bearer <token>.
 * Si es válido, se asigna el `payload` al objeto `req.usuario`.
 */
function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  // Validar si el encabezado Authorization existe y tiene formato Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica y decodifica el token
    const payload = jwt.verify(token, secret);
    req.usuario = payload; // El payload incluirá info como { id, rol_id, correo }
    next();
  } catch (err) {
    // Token inválido o expirado
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
}

/**
 * ✅ Middleware de autorización:
 * Valida que el usuario autenticado tenga uno de los roles permitidos.
 * @param {...Number} rolesPermitidos - IDs numéricos de los roles autorizados
 * Uso: router.get("/admin", verificarAutenticacion, permitirRoles(1, 2), controlador);
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
