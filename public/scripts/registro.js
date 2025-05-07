document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    ocultarMensajes();

    const correo = email.value.trim();
    const contrasena = password.value.trim();
    let esValido = true;

    // Validación de correo
    if (!emailRegex.test(correo)) {
      email.classList.add("is-invalid");
      mostrarError("⚠️ Ingrese un correo electrónico válido.");
      esValido = false;
    } else {
      email.classList.remove("is-invalid");
    }

    // Validación de contraseña
    if (!passwordRegex.test(contrasena)) {
      password.classList.add("is-invalid");
      mostrarError("⚠️ La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.");
      esValido = false;
    } else {
      password.classList.remove("is-invalid");
    }

    if (!esValido) {
      mensajeError.scrollIntoView({ behavior: "smooth" });
      return;
    }

    try {
      const response = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico: correo,
          contrasena: contrasena,
          nombre: "Usuario" // Puedes personalizar este campo si el formulario incluye nombre
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarError(data.message || "❌ Error durante el registro.");
        return;
      }

      mostrarExito("✅ Registro exitoso. Redirigiendo al inicio de sesión...");
      form.reset();
      setTimeout(() => window.location.href = "login.html", 2000);

    } catch (error) {
      console.error("❌ Error en el registro:", error);
      mostrarError("⚠️ No se pudo conectar con el servidor.");
    }
  });

  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.classList.remove("d-none");
  }

  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.classList.remove("d-none");
  }

  function ocultarMensajes() {
    mensajeError.classList.add("d-none");
    mensajeExito.classList.add("d-none");
    email.classList.remove("is-invalid");
    password.classList.remove("is-invalid");
  }
});
