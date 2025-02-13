const db = require("../db");
const bcrypt = require("bcrypt");

// ** Registrar un usuario**
exports.registrarUsuario = (req, res) => {
    const { email, contraseña } = req.body;

    // Validar entrada
    if (!email || !contraseña) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    // Hashear la contraseña antes de guardarla
    bcrypt.hash(contraseña, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al encriptar contraseña" });
        }

        // Insertar usuario en la base de datos
        db.query("INSERT INTO usuarios (email, contraseña) VALUES (?, ?)", [email, hash], (error) => {
            if (error) {
                return res.status(500).json({ mensaje: "Error al registrar usuario" });
            }
            res.json({ mensaje: "Usuario registrado correctamente" });
        });
    });
};

// ** Iniciar sesión**
exports.verificarUsuario = (req, res) => {
    const { email, contraseña } = req.body;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (error, resultados) => {
        if (error || resultados.length === 0) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const usuario = resultados[0];

        // Comparar contraseña hasheada
        bcrypt.compare(contraseña, usuario.contraseña, (err, esValido) => {
            if (!esValido) {
                return res.status(401).json({ mensaje: "Contraseña incorrecta" });
            }

            req.session.usuario = usuario;
            res.json({ mensaje: "Inicio de sesión exitoso" });
        });
    });
};
