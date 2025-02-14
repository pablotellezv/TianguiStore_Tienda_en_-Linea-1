const db = require("../db"); // Importar conexión a la base de datos
const bcrypt = require("bcrypt");
const validator = require("validator");

// **📌 Registrar un nuevo usuario**
exports.registrarUsuario = (req, res) => {
    const { email, contraseña } = req.body;

    console.log(`🔍 Intento de registro: ${email}`);

    // **✅ Validaciones**
    if (!email || !contraseña) {
        console.warn("⛔ Error: Campos vacíos");
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    if (!validator.isEmail(email)) {
        console.warn("⛔ Error: Correo inválido");
        return res.status(400).json({ error: "Correo electrónico no válido" });
    }
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña)) {
        console.warn("⛔ Error: Contraseña no segura");
        return res.status(400).json({ error: "La contraseña debe contener al menos 8 caracteres, una mayúscula y un número." });
    }

    // **🔒 Encriptar la contraseña**
    const contraseñaEncriptada = bcrypt.hashSync(contraseña, 10);

    // **🛠 Insertar usuario en la base de datos**
    db.query("INSERT INTO usuarios (usuario_correo, usuario_contrasena) VALUES (?, ?)", [email, contraseñaEncriptada], (error) => {
        if (error) {
            console.error("❌ Error al registrar usuario:", error);
            return res.status(500).json({ error: "Error al registrar usuario" });
        }
        console.log(`✅ Usuario ${email} registrado correctamente`);
        res.json({ mensaje: "Usuario registrado exitosamente" });
    });
};

// **📌 Iniciar sesión (verificar usuario)**
exports.verificarUsuario = (req, res) => {
    const { email, contraseña } = req.body;

    console.log(`🔍 Intento de inicio de sesión: ${email}`);

    if (!email || !contraseña) {
        console.warn("⛔ Error: Campos vacíos");
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    db.query("SELECT * FROM usuarios WHERE usuario_correo = ?", [email], (error, resultados) => {
        if (error) {
            console.error("❌ Error en la base de datos:", error);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        if (resultados.length === 0) {
            console.warn("⛔ Usuario no encontrado");
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        const usuario = resultados[0];
        const contraseñaValida = bcrypt.compareSync(contraseña, usuario.usuario_contrasena);

        if (!contraseñaValida) {
            console.warn("⛔ Contraseña incorrecta");
            return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }

        console.log(`✅ Usuario ${email} autenticado exitosamente`);
        req.session.usuario = usuario;
        res.json({ mensaje: "Inicio de sesión exitoso" });
    });
};

// **📌 Cerrar sesión**
exports.cerrarSesion = (req, res) => {
    console.log(`🔒 Cerrando sesión de usuario ${req.session.usuario?.email || "desconocido"}`);

    req.session.destroy((error) => {
        if (error) {
            console.error("❌ Error al cerrar sesión:", error);
        } else {
            console.log("✅ Sesión cerrada correctamente");
        }
        res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
};
