const bcrypt = require("bcrypt");
const db = require("./db");
const { generarToken } = require("./utils/jwt"); // Asegúrate de que la ruta sea correcta

// 📌 Registrar un usuario
async function registrarUsuario(email, contraseña, res) {
    if (!email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await db.query(
            "INSERT INTO usuarios (email, contraseña, rol_id) VALUES (?, ?, 7)", // Asignar rol de cliente por defecto
            [email, hashedPassword]
        );
        res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        res.status(500).json({ error: "Error al registrar usuario" });
    }
}

// 📌 Verificar credenciales y emitir token JWT
async function verificarUsuario(email, contraseña, res) {
    if (!email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const [results] = await db.query(
            "SELECT usuario_id, email, contraseña, rol_id FROM usuarios WHERE email = ?",
            [email]
        );
        if (results.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // ✅ Generar token JWT
        const token = generarToken({
            id: user.usuario_id,
            correo: user.email,
            rol_id: user.rol_id
        });

        res.json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: user.usuario_id,
                correo: user.email,
                rol_id: user.rol_id
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
}

module.exports = { registrarUsuario, verificarUsuario };
