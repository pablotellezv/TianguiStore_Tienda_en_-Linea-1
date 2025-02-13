const db = require("../db"); // Conexión a MySQL
const bcrypt = require("bcrypt"); // Para encriptar contraseñas
const validator = require("validator"); // Validaciones de entrada

// **📌 Registrar usuario**
exports.registrarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    console.log(`Intento de registro con email: ${email}`);

    // **🔍 Validaciones de seguridad**
    if (!email || !contraseña) {
        console.warn("⛔ Error: Campos vacíos en el registro");
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    if (!validator.isEmail(email)) {
        console.warn(`⛔ Error: Formato de email inválido: ${email}`);
        return res.status(400).json({ mensaje: "Formato de correo electrónico inválido" });
    }

    if (!validator.isStrongPassword(contraseña, { minLength: 8, minNumbers: 1, minUppercase: 1 })) {
        console.warn("⛔ Error: Contraseña débil");
        return res.status(400).json({ mensaje: "La contraseña debe contener al menos 8 caracteres, una mayúscula y un número." });
    }

    try {
        // **🔍 Verificar si el usuario ya existe**
        db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, resultados) => {
            if (err) {
                console.error("❌ Error al acceder a la BD:", err);
                return res.status(500).json({ mensaje: "Error en el servidor" });
            }

            if (resultados.length > 0) {
                console.warn(`⚠️ Usuario con email ${email} ya existe`);
                return res.status(400).json({ mensaje: "El correo ya está registrado" });
            }

            // **🔑 Hashear la contraseña**
            const hash = await bcrypt.hash(contraseña, 10);

            // **📝 Insertar el usuario en la BD**
            db.query("INSERT INTO usuarios (email, contraseña) VALUES (?, ?)", [email, hash], (err) => {
                if (err) {
                    console.error("❌ Error al registrar usuario:", err);
                    return res.status(500).json({ mensaje: "Error al registrar usuario" });
                }

                console.log(`✅ Usuario ${email} registrado correctamente`);
                res.json({ mensaje: "Usuario registrado exitosamente" });
            });
        });
    } catch (error) {
        console.error("❌ Error inesperado en registro:", error);
        res.status(500).json({ mensaje: "Error inesperado" });
    }
};

// **📌 Verificar usuario (Login)**
exports.verificarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    console.log(`🔍 Intentando iniciar sesión con email: ${email}`);

    if (!email || !contraseña) {
        console.warn("⛔ Error: Campos vacíos en el login");
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, resultados) => {
            if (err) {
                console.error("❌ Error al consultar la BD:", err);
                return res.status(500).json({ mensaje: "Error en el servidor" });
            }

            if (resultados.length === 0) {
                console.warn(`⚠️ Usuario ${email} no encontrado`);
                return res.status(401).json({ mensaje: "El usuario no existe" });
            }

            const usuario = resultados[0];

            // **🔑 Verificar contraseña**
            const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!esValido) {
                console.warn(`⚠️ Contraseña incorrecta para ${email}`);
                return res.status(401).json({ mensaje: "Credenciales incorrectas" });
            }

            // **✅ Autenticación exitosa**
            req.session.usuario = usuario;
            console.log(`✅ Inicio de sesión exitoso para ${email}`);
            res.json({ mensaje: "Inicio de sesión exitoso" });
        });
    } catch (error) {
        console.error("❌ Error inesperado en login:", error);
        res.status(500).json({ mensaje: "Error inesperado" });
    }
};

// **📌 Cerrar sesión**
exports.cerrarSesion = (req, res) => {
    if (!req.session.usuario) {
        console.warn("⚠️ Intento de logout sin sesión activa");
        return res.status(400).json({ mensaje: "No hay sesión activa" });
    }

    console.log(`🚪 Cerrando sesión para: ${req.session.usuario.email}`);

    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Error al cerrar sesión:", err);
            return res.status(500).json({ mensaje: "Error al cerrar sesión" });
        }

        res.json({ mensaje: "Sesión cerrada exitosamente" });
    });
};
