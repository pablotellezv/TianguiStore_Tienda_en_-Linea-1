const bcrypt = require("bcrypt");
const db = require("./db");

// **📌 Registrar un usuario**
async function registrarUsuario(email, contraseña, res) {
    if (!email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await db.query("INSERT INTO usuarios (email, contraseña) VALUES (?, ?)", [email, hashedPassword]);
        res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        res.status(500).json({ error: "Error al registrar usuario" });
    }
}

// **📌 Verificar credenciales de un usuario**
async function verificarUsuario(email, contraseña, req, res) {
    if (!email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (results.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        req.session.user = user.email;
        res.json({ mensaje: "Inicio de sesión exitoso" });
    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

module.exports = { registrarUsuario, verificarUsuario };