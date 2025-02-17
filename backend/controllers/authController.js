const db = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");

exports.registrarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña)) {
        return res.status(400).json({ error: "La contraseña debe contener al menos 8 caracteres, una mayúscula y un número." });
    }

    try {
        const [existeUsuario] = await db.promise().query("SELECT usuario_correo FROM usuarios WHERE usuario_correo = ?", [email]);
        if (existeUsuario.length > 0) {
            return res.status(400).json({ error: "El usuario ya está registrado" });
        }

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);
        await db.promise().query("INSERT INTO usuarios (usuario_correo, usuario_contrasena) VALUES (?, ?)", [email, contraseñaEncriptada]);

        res.json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

exports.verificarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const [resultados] = await db.promise().query("SELECT * FROM usuarios WHERE usuario_correo = ?", [email]);
        if (resultados.length === 0) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        const usuario = resultados[0];
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.usuario_contrasena);
        if (!contraseñaValida) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        req.session.usuario = { correo: usuario.usuario_correo };
        res.json({ mensaje: "Inicio de sesión exitoso" });
    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
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
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
};
