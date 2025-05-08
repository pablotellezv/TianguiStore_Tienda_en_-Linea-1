/**
 * 📦 registro.js
 * 
 * Descripción:
 * Este archivo maneja la lógica de registro de nuevos usuarios en TianguiStore. 
 * Permite al usuario registrar su correo electrónico y contraseña, con validaciones en el formulario antes de enviarlo.
 * También maneja los mensajes de error y éxito en la interfaz y realiza la solicitud al backend para registrar al usuario.
 * 
 * Funciones:
 * - Validación del correo electrónico y la contraseña.
 * - Envío de los datos de registro al backend.
 * - Manejo de los mensajes de error y éxito.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  // Expresiones regulares para validar correo y contraseña
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Evento para manejar el envío del formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    ocultarMensajes(); // Ocultar mensajes previos

    const correo = email.value.trim();
    const contrasena = password.value.trim();
    let esValido = true;

    // Validación del correo electrónico
    if (!emailRegex.test(correo)) {
      email.classList.add("is-invalid");
      mostrarError("⚠️ Ingrese un correo electrónico válido.");
      esValido = false;
    } else {
      email.classList.remove("is-invalid");
    }

    // Validación de la contraseña
    if (!passwordRegex.test(contrasena)) {
      password.classList.add("is-invalid");
      mostrarError("⚠️ La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.");
      esValido = false;
    } else {
      password.classList.remove("is-invalid");
    }

    // Si el formulario no es válido, mostrar el mensaje de error y detener el proceso
    if (!esValido) {
      mensajeError.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Si todo está válido, hacer la solicitud al backend
    try {
      const response = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_electronico: correo,
          contrasena: contrasena,
          nombre: "Usuario" // Este campo puede ser personalizado si el formulario incluye nombre
        }),
      });

      const data = await response.json();

      // Manejo de errores si la respuesta no es exitosa
      if (!response.ok) {
        mostrarError(data.message || "❌ Error durante el registro.");
        return;
      }

      // Mostrar mensaje de éxito y redirigir al inicio de sesión
      mostrarExito("✅ Registro exitoso. Redirigiendo al inicio de sesión...");
      form.reset(); // Limpiar el formulario
      setTimeout(() => window.location.href = "login.html", 2000); // Redirigir después de 2 segundos

    } catch (error) {
      console.error("❌ Error en el registro:", error);
      mostrarError("⚠️ No se pudo conectar con el servidor.");
    }
  });

  // Función para mostrar un mensaje de error
  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.classList.remove("d-none"); // Mostrar el mensaje de error
  }

  // Función para mostrar un mensaje de éxito
  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.classList.remove("d-none"); // Mostrar el mensaje de éxito
  }

  // Función para ocultar todos los mensajes (error o éxito)
  function ocultarMensajes() {
    mensajeError.classList.add("d-none"); // Ocultar el mensaje de error
    mensajeExito.classList.add("d-none"); // Ocultar el mensaje de éxito
    email.classList.remove("is-invalid"); // Eliminar clase de error del campo correo
    password.classList.remove("is-invalid"); // Eliminar clase de error del campo contraseña
  }
});
