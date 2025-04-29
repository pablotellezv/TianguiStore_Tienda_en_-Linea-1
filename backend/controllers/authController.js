const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET = process.env.JWT_SECRET || "supersecreto_tianguistore";

// 📌 Registrar nuevo usuario
async function registrarUsuario(req, res) {
  const {
    correo_electronico,
    contrasena,
    nombre,
    apellido_paterno = "",
    apellido_materno = "",
    telefono = "",
    direccion = ""
  } = req.body;

  if (!correo_electronico || !contrasena || !nombre) {
    return res.status(400).json({ message: "Faltan campos obligatorios (correo, contraseña, nombre)." });
  }

  try {
    const [existe] = await pool.query(
      "SELECT usuario_id FROM usuarios WHERE correo_electronico = ?",
      [correo_electronico]
    );

    if (existe.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    await pool.query(
      `INSERT INTO usuarios 
      (correo_electronico, contrasena_hash, nombre, apellido_paterno, apellido_materno, telefono, direccion, rol_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [correo_electronico, hash, nombre, apellido_paterno, apellido_materno, telefono, direccion, 3] // Rol cliente (3)
    );

    res.status(201).json({ message: "Usuario registrado exitosamente." });

  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno al registrar." });
  }
}

// 📌 Verificar usuario (Login)
async function verificarUsuario(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo_electronico = ? AND activo = 1",
      [correo_electronico]
    );

    if (!rows.length) {
      return res.status(401).json({ type: "credenciales_invalidas", message: "Credenciales inválidas." });
    }

    const usuario = rows[0];
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!esValida) {
      return res.status(401).json({ type: "credenciales_invalidas", message: "Credenciales inválidas." });
    }

    const roles = {
      1: "admin",
      3: "cliente",
      4: "vendedor",
      5: "repartidor",
      6: "soporte"
    };

    const payload = {
      usuario_id: usuario.usuario_id,
      correo: usuario.correo_electronico,
      rol: roles[usuario.rol_id] || "cliente"
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

    res.status(200).json({
      token,
      usuario: payload
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
}

// 📌 Obtener sesión actual
function obtenerSesion(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({ usuario: decoded });
  } catch (error) {
    console.error("❌ Token inválido:", error);
    res.status(401).json({ message: "Token inválido o expirado." });
  }
}

// 📌 Cerrar sesión (cliente debe eliminar su token local)
function cerrarSesion(req, res) {
  res.status(200).json({ message: "Sesión cerrada correctamente (elimine su token local)." });
}

// ✅ Exportar TODAS las funciones correctamente
module.exports = {
  registrarUsuario,
  verificarUsuario,
  obtenerSesion,
  cerrarSesion
};
