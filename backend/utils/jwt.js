const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Secretos y expiraciones desde .env
const ACCESS_SECRET = process.env.JWT_SECRET || "clave_predeterminada";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "clave_refresh";
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * 🔐 Genera un access token (corto plazo) firmado.
 * @param {Object} payload - Información del usuario (usuario_id, correo, rol, permisos, etc.)
 * @returns {string} Token JWT válido por corto tiempo
 */
function generarAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

/**
 * ♻️ Genera un refresh token (largo plazo) firmado.
 * @param {Object} payload - Solo los datos mínimos necesarios para renovar sesión
 * @returns {string} Token JWT válido por más tiempo
 */
function generarRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

/**
 * 🔍 Verifica y decodifica un access token
 * @param {string} token
 * @returns {Object} Payload decodificado si es válido
 * @throws {Error} Si es inválido o ha expirado
 */
function verificarAccessToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Access token inválido o no proporcionado.");
  }
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * 🔍 Verifica y decodifica un refresh token
 * @param {string} token
 * @returns {Object} Payload decodificado si es válido
 * @throws {Error} Si es inválido o ha expirado
 */
function verificarRefreshToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Refresh token inválido o no proporcionado.");
  }
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken
};
