document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const mensajeError = document.getElementById("mensajeError");
    const mensajeExito = document.getElementById("mensajeExito");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarga de página

        let esValido = true;

        // Validar email
        if (!emailRegex.test(email.value)) {
            email.classList.add("is-invalid");
            esValido = false;
        } else {
            email.classList.remove("is-invalid");
        }

        // Validar contraseña
        if (!passwordRegex.test(password.value)) {
            password.classList.add("is-invalid");
            esValido = false;
        } else {
            password.classList.remove("is-invalid");
        }

        // Validar confirmación de contraseña
        if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add("is-invalid");
            esValido = false;
        } else {
            confirmPassword.classList.remove("is-invalid");
        }

        if (!esValido) {
            mensajeError.textContent = "⚠️ Por favor, corrige los errores antes de continuar.";
            mensajeError.classList.remove("d-none");
            return;
        }

        // Enviar datos al backend
        try {
            const response = await fetch("http://localhost:3000/auth/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.value, contraseña: password.value }),
            });

            const data = await response.json();

            if (!response.ok) {
                mensajeError.textContent = `❌ ${data.error}`;
                mensajeError.classList.remove("d-none");
            } else {
                mensajeExito.classList.remove("d-none");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }
        } catch (error) {
            mensajeError.textContent = "⚠️ Error al conectar con el servidor.";
            mensajeError.classList.remove("d-none");
        }
    });
});
