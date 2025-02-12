document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,10}$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evitar recarga de página

        // Validaciones de campos
        let esValido = true;
        if (!emailRegex.test(email.value)) {
            email.classList.add("is-invalid");
            esValido = false;
        } else {
            email.classList.remove("is-invalid");
        }

        if (!passwordRegex.test(password.value)) {
            password.classList.add("is-invalid");
            esValido = false;
        } else {
            password.classList.remove("is-invalid");
        }

        if (!esValido) return;

        // Enviar credenciales al servidor
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: email.value,
                contraseña: password.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            mensajeError.textContent = data.error;
            mensajeError.classList.remove("d-none");
        } else {
            window.location.href = "index.html";
        }
    });
});
