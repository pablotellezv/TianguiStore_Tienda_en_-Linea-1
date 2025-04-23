const db = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.registrarUsuario = async (req, res) => {
    const {
        email,
        contraseña,
        nombre,
        apellido_paterno,
        apellido_materno,
        telefono,
        direccion
    } = req.body;

    // Validaciones básicas
    if (!email || !contraseña || !nombre) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }
    if (!/^(?=.*[A-Z])(?=.*\\d).{8,}$/.test(contraseña)) {
        return res.status(400).json({
            error: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número."
        });
    }

    try {
        const [usuarios] = await db.promise().query(
            "SELECT usuario_correo FROM usuarios WHERE usuario_correo = ?",
            [email]
        );

        if (usuarios.length > 0) {
            return res.status(400).json({ error: "Este usuario ya está registrado" });
        }

        const hash = await bcrypt.hash(contraseña, 10);

        await db.promise().query(
            `INSERT INTO usuarios 
            (usuario_correo, usuario_contrasena, nombre, apellido_paterno, apellido_materno, telefono, direccion, rol_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 7)`,
            [email, hash, nombre, apellido_paterno || null, apellido_materno || null, telefono || null, direccion || null]
        );

        res.json({ mensaje: "Usuario registrado correctamente" });
    } catch (err) {
        console.error("❌ Error al registrar:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

exports.verificarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const [usuarios] = await db.promise().query(
            "SELECT * FROM usuarios WHERE usuario_correo = ?",
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        const usuario = usuarios[0];
        const valida = await bcrypt.compare(contraseña, usuario.usuario_contrasena);
        if (!valida) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        req.session.usuario = {
            id: usuario.usuario_id,
            correo: usuario.usuario_correo,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id
        };

        res.json({ mensaje: "Inicio de sesión exitoso" });
    } catch (err) {
        console.error("❌ Error de login:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

exports.obtenerSesion = (req, res) => {
    if (req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.json({ mensaje: "Sesión cerrada correctamente" });
    });
};
