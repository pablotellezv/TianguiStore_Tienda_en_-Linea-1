document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");

    // Expresiones regulares para validación
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        mensajeError.classList.add("d-none");

        let esValido = true;

        // Validación de email
        if (!emailRegex.test(email.value)) {
            email.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ Ingrese un correo electrónico válido.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            email.classList.remove("is-invalid");
        }

        // Validación de contraseña
        if (!passwordRegex.test(password.value)) {
            password.classList.add("is-invalid");
            mensajeError.textContent = "⚠️ La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.";
            mensajeError.classList.remove("d-none");
            esValido = false;
        } else {
            password.classList.remove("is-invalid");
        }

        if (!esValido) {
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.value,
                    contraseña: password.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                mensajeError.textContent = `❌ ${data.error}`;
                mensajeError.classList.remove("d-none");
                return;
            }

            // Guardar token en localStorage
            localStorage.setItem("token", data.token);

            // Guardar información útil del usuario
            localStorage.setItem("usuario", JSON.stringify(data.usuario));

            mostrarToast("Inicio de sesión exitoso.", "success");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (error) {
            console.error("❌ Error al conectar con el servidor", error);
            mensajeError.textContent = "⚠️ Error al conectar con el servidor. Intente de nuevo más tarde.";
            mensajeError.classList.remove("d-none");
        }
    });
});

// 📌 Función para mostrar toasts
function mostrarToast(mensaje, tipo) {
    const toastContainer = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 show`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
