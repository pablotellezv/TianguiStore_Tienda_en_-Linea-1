// 🔐 login.js — Maneja inicio de sesión con validaciones y control de sesión
document.addEventListener("DOMContentLoaded", () => {
  const form            = document.getElementById("loginForm");
  const emailInput      = document.getElementById("email");
  const passwordInput   = document.getElementById("password");
  const rememberInput   = document.getElementById("remember");
  const mensajeError    = document.getElementById("mensajeError");
  const mensajeExito    = document.getElementById("mensajeExito");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    const email     = emailInput.value.trim();
    const password  = passwordInput.value.trim();
    const recordar  = rememberInput.checked;

    if (!validarFormulario(email, password)) return;

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico: email,
          contrasena: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarError(data.message || "❌ Credenciales incorrectas.");
        return;
      }

      // Guardar datos en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      mostrarExito("Inicio de sesión exitoso ✅");

      // Redireccionar según el rol
      const rol = data.usuario.rol;
      setTimeout(() => {
        window.location.href = (rol === "admin" || rol === "vendedor")
          ? "adminPanel.html"
          : "index.html";
      }, 1200);
    } catch (error) {
      console.error("❌ Error en login:", error);
      mostrarError("No se pudo conectar con el servidor.");
    }
  });

  // 📌 Validación de campos
  function validarFormulario(correo, contrasena) {
    const regexCorreo   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    let valido = true;

    if (!regexCorreo.test(correo)) {
      mostrarError("⚠️ Correo electrónico inválido.");
      emailInput.classList.add("is-invalid");
      valido = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    if (!regexPassword.test(contrasena)) {
      mostrarError("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      passwordInput.classList.add("is-invalid");
      valido = false;
    } else {
      passwordInput.classList.remove("is-invalid");
    }

    return valido;
  }

  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.classList.remove("d-none");
    mensajeExito.classList.add("d-none");
  }

  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.classList.remove("d-none");
    mensajeError.classList.add("d-none");
  }

  function ocultarMensajes() {
    mensajeError.classList.add("d-none");
    mensajeExito.classList.add("d-none");
    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
  }
});
