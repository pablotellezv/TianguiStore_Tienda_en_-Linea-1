const bcrypt = require("bcrypt");
const db = require("./db");

// **📌 Registrar un usuario**
async function registrarUsuario(email, contraseña, res) {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    db.query("INSERT INTO usuarios (email, contraseña) VALUES (?, ?)", [email, hashedPassword], (err) => {
        if (err) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        res.json({ mensaje: "Usuario registrado correctamente" });
    });
}

// **📌 Verificar credenciales de un usuario**
function verificarUsuario(email, contraseña, req, res) {
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        req.session.user = user.email;
        res.json({ mensaje: "Inicio de sesión exitoso" });
    });
}

module.exports = { registrarUsuario, verificarUsuario };
