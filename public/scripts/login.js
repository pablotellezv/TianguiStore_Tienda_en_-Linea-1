/**
 * 🔐 login.js — Maneja inicio de sesión con validaciones y control de sesión
 * Autor: I.S.C. Erick Renato Vega Ceron — Adaptado a MaterializeCSS
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  // Mostrar/ocultar contraseña
  const togglePasswordBtn = document.getElementById("togglePassword");
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const input = passwordInput;
      const icon = togglePasswordBtn.querySelector("i");
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    });
  }

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

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

      // Guardar sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      mostrarExito("Inicio de sesión exitoso ✅");

      setTimeout(() => {
        const rol = data.usuario.rol;
        window.location.href = (rol === "admin" || rol === "vendedor")
          ? "adminPanel.html"
          : "index.html";
      }, 1500);
    } catch (error) {
      console.error("❌ Error en login:", error);
      mostrarError("No se pudo conectar con el servidor.");
    }
  });

  // ✅ Validación básica con expresiones regulares
  function validarFormulario(correo, contrasena) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    let valido = true;

    if (!regexCorreo.test(correo)) {
      mostrarError("⚠️ Correo electrónico inválido.");
      emailInput.classList.add("invalid");
      valido = false;
    }

    if (!regexPassword.test(contrasena)) {
      mostrarError("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      passwordInput.classList.add("invalid");
      valido = false;
    }

    return valido;
  }

  // Mensajes
  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.style.display = "block";
    mensajeExito.style.display = "none";

    setTimeout(() => {
      mensajeError.style.display = "none";
    }, 4000);
  }

  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.style.display = "block";
    mensajeError.style.display = "none";

    setTimeout(() => {
      mensajeExito.style.display = "none";
    }, 3000);
  }

  function ocultarMensajes() {
    mensajeError.style.display = "none";
    mensajeExito.style.display = "none";
    emailInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
  }
});
