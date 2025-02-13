document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,10}$/;

    // Limpiar errores cuando el usuario empiece a escribir
    email.addEventListener("input", () => email.classList.remove("is-invalid"));
    password.addEventListener("input", () => password.classList.remove("is-invalid"));
    mensajeError.classList.add("d-none");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarga de página
        mensajeError.classList.add("d-none"); // Ocultar mensaje de error

        let esValido = true;

        // Validación del correo
        if (!emailRegex.test(email.value)) {
            email.classList.add("is-invalid");
            esValido = false;
        }

        // Validación de la contraseña
        if (!passwordRegex.test(password.value)) {
            password.classList.add("is-invalid");
            esValido = false;
        }

        if (!esValido) return;

        try {
            console.log("🔄 Enviando credenciales al servidor...");
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.value,
                    contraseña: password.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("❌ Error en la autenticación:", data.error);
                mensajeError.textContent = data.error;
                mensajeError.classList.remove("d-none");
            } else {
                console.log("✅ Inicio de sesión exitoso. Redirigiendo...");
                mensajeError.classList.add("d-none"); // Ocultar mensaje de error
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            }
        } catch (error) {
            console.error("⚠️ Error en la conexión con el servidor:", error);
            mensajeError.textContent = "Error de conexión con el servidor.";
            mensajeError.classList.remove("d-none");
        }
    });
});
