// utils/jwt.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.JWT_SECRET || "clave_predeterminada";
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

/**
 * Genera un JWT con los datos del usuario
 * @param {Object} payload - Datos como id, correo, rol, etc.
 * @returns {String} token JWT firmado
 */
function generarToken(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verifica la validez de un JWT
 * @param {String} token - Token recibido del cliente
 * @returns {Object} Datos del payload decodificado
 */
function verificarToken(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  generarToken,
  verificarToken
};
