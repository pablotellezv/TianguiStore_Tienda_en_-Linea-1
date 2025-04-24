const db = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");

// 📌 Registro de nuevos usuarios con validación completa
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

    // Validaciones mínimas obligatorias
    if (!email || !contraseña || !nombre) {
        return res.status(400).json({ error: "Faltan campos obligatorios: correo, contraseña y nombre son requeridos." });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Correo electrónico no válido." });
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña)) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
        });
    }

    try {
        // Verificar si ya existe
        const [usuarios] = await db.promise().query(
            "SELECT usuario_correo FROM usuarios WHERE usuario_correo = ?",
            [email]
        );

        if (usuarios.length > 0) {
            return res.status(400).json({ error: "Este correo ya está registrado." });
        }

        // Hashear contraseña
        const hash = await bcrypt.hash(contraseña, 10);

        // Insertar nuevo usuario (rol_id 7 = cliente)
        await db.promise().query(
            `INSERT INTO usuarios 
            (usuario_correo, usuario_contrasena, nombre, apellido_paterno, apellido_materno, telefono, direccion, rol_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 7)`,
            [
                email.trim(),
                hash,
                nombre.trim(),
                apellido_paterno?.trim() || null,
                apellido_materno?.trim() || null,
                telefono?.trim() || null,
                direccion?.trim() || null
            ]
        );

        res.status(201).json({ mensaje: "Usuario registrado correctamente." });
    } catch (err) {
        console.error("❌ Error al registrar:", err);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Verificación de usuario y autenticación con sesión
exports.verificarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    try {
        const [usuarios] = await db.promise().query(
            "SELECT * FROM usuarios WHERE usuario_correo = ?",
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos." });
        }

        const usuario = usuarios[0];
        const coincide = await bcrypt.compare(contraseña, usuario.usuario_contrasena);

        if (!coincide) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos." });
        }

        // Guardar sesión
        req.session.usuario = {
            id: usuario.usuario_id,
            correo: usuario.usuario_correo,
            nombre: usuario.nombre,
            rol_id: usuario.rol_id
        };

        res.json({ mensaje: "Inicio de sesión exitoso." });

    } catch (err) {
        console.error("❌ Error al iniciar sesión:", err);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Obtener sesión activa
exports.obtenerSesion = (req, res) => {
    if (req.session.usuario) {
        res.json({ autenticado: true, usuario: req.session.usuario });
    } else {
        res.json({ autenticado: false });
    }
};

// 📌 Cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión." });
        }
        res.json({ mensaje: "Sesión cerrada correctamente." });
    });
};
