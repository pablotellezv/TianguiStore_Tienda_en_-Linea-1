const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Claves y tiempos desde entorno
const ACCESS_SECRET = process.env.JWT_SECRET || "clave_predeterminada";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "clave_refresh";
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * 🔐 Genera un token de acceso de corto plazo.
 * @param {Object} payload - Datos del usuario (id, correo, rol, permisos)
 * @returns {string} JWT firmado
 */
function generarAccessToken(payload = {}) {
  if (typeof payload !== "object") throw new Error("Payload inválido.");
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

/**
 * ♻️ Genera un refresh token de largo plazo.
 * @param {Object} payload - Generalmente solo el id
 * @returns {string} JWT firmado
 */
function generarRefreshToken(payload = {}) {
  if (typeof payload !== "object") throw new Error("Payload inválido.");
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

/**
 * 🔍 Verifica un token de acceso.
 * @param {string} token - Token JWT de acceso
 * @returns {Object} Payload decodificado
 * @throws {Error} Si es inválido o expirado
 */
function verificarAccessToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Token de acceso no válido o no proporcionado.");
  }
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    throw new Error("Access token inválido o expirado.");
  }
}

/**
 * 🔍 Verifica un token de refresco.
 * @param {string} token - Token JWT de refresco
 * @returns {Object} Payload decodificado
 * @throws {Error} Si es inválido o expirado
 */
function verificarRefreshToken(token) {
  if (!token || typeof token !== "string") {
    throw new Error("Token de refresco no válido o no proporcionado.");
  }
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw new Error("Refresh token inválido o expirado.");
  }
}

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken
};
