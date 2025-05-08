/**
 * 🔐 login.js — Maneja inicio de sesión con validaciones y control de sesión
 * 
 * Descripción:
 * Este archivo maneja la lógica del inicio de sesión en TianguiStore, incluyendo la validación de los campos 
 * del formulario, el envío de las credenciales al backend y el control de la sesión del usuario.
 * Además, gestiona la visualización de mensajes de error y éxito, así como la redirección según el rol del usuario.
 * 
 * Funciones:
 * - Validación del correo y la contraseña.
 * - Autenticación del usuario a través de la API de backend.
 * - Manejo de mensajes de error y éxito.
 * - Redirección del usuario según el rol.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  // Manejo del envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes(); // Ocultar mensajes previos

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const recordar = rememberInput.checked;

    // Validación del formulario
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

      // Manejo de errores en caso de que las credenciales sean incorrectas
      if (!res.ok) {
        mostrarError(data.message || "❌ Credenciales incorrectas.");
        return;
      }

      // Guardar token y usuario en localStorage para la sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      mostrarExito("Inicio de sesión exitoso ✅");

      // Redireccionar según el rol del usuario
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

  // 📌 Función para validar el formulario de inicio de sesión
  function validarFormulario(correo, contrasena) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para correo
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Expresión regular para contraseña
    let valido = true;

    // Validación de correo electrónico
    if (!regexCorreo.test(correo)) {
      mostrarError("⚠️ Correo electrónico inválido.");
      emailInput.classList.add("is-invalid");
      valido = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    // Validación de contraseña
    if (!regexPassword.test(contrasena)) {
      mostrarError("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      passwordInput.classList.add("is-invalid");
      valido = false;
    } else {
      passwordInput.classList.remove("is-invalid");
    }

    return valido;
  }

  // Función para mostrar un mensaje de error
  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.classList.remove("d-none");
    mensajeExito.classList.add("d-none");
  }

  // Función para mostrar un mensaje de éxito
  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.classList.remove("d-none");
    mensajeError.classList.add("d-none");
  }

  // Función para ocultar mensajes de error y éxito
  function ocultarMensajes() {
    mensajeError.classList.add("d-none");
    mensajeExito.classList.add("d-none");
    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
  }
});
