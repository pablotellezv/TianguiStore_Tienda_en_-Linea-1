document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");
    const mensajeExito = document.getElementById("mensajeExito");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        let esValido = true;
        mensajeError.classList.add("d-none");
        mensajeExito.classList.add("d-none");

        // **Validar email**
        if (!emailRegex.test(email.value)) {
            email.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ Ingrese un correo electrónico válido.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            email.classList.remove("is-invalid");
        }

        // **Validar contraseña**
        if (!passwordRegex.test(password.value)) {
            password.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            password.classList.remove("is-invalid");
        }

        if (!esValido) return;

        // **Enviar datos al servidor**
        try {
            const response = await fetch("http://localhost:3000/auth/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: email.value,
                    contraseña: password.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                mensajeError.textContent = `❌ ${data.error}`;
                mensajeError.classList.remove("d-none");
            } else {
                mensajeExito.textContent = "✅ Registro exitoso. Redirigiendo...";
                mensajeExito.classList.remove("d-none");
                setTimeout(() => (window.location.href = "login.html"), 2000);
            }
        } catch (error) {
            mensajeError.textContent = "⚠️ Error al conectar con el servidor.";
            mensajeError.classList.remove("d-none");
        }
    });
});
