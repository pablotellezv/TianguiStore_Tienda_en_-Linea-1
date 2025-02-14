document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarga de página

        let esValido = true;
        mensajeError.classList.add("d-none"); // Ocultar mensaje previo

        // **Validar email**
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ Ingrese un correo electrónico válido.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            email.classList.remove("is-invalid");
        }

        // **Validar contraseña**
        if (!passwordRegex.test(password.value.trim())) {
            password.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            password.classList.remove("is-invalid");
        }

        if (!esValido) {
            console.warn("⛔ Validación fallida en el frontend");
            return;
        }

        console.log("📡 Enviando credenciales al servidor...");

        // **Enviar credenciales al servidor**
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.value.trim(),
                    contraseña: password.value.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Error en la autenticación:", data.error);
                mensajeError.textContent = `❌ ${data.error}`;
                mensajeError.classList.remove("d-none");
            } else {
                console.log("✅ Inicio de sesión exitoso. Redirigiendo...");
                mensajeError.classList.add("d-none"); // Ocultar mensajes de error previos
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("⚠️ Error en la conexión con el servidor", error);
            mensajeError.textContent = "⚠️ Error al conectar con el servidor. Intente de nuevo más tarde.";
            mensajeError.classList.remove("d-none");
        }
    });
});
