/**
 * 📦 registro.js
 * Registro completo de usuarios con validaciones y envío al backend.
 * Captura todos los campos: nombre, apellidos, género, contacto, etc.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  // Campos
  const nombre = document.getElementById("nombre");
  const apellidoPaterno = document.getElementById("apellido_paterno");
  const apellidoMaterno = document.getElementById("apellido_materno");
  const genero = document.getElementById("genero");
  const fechaNacimiento = document.getElementById("fecha_nacimiento");
  const telefono = document.getElementById("telefono");
  const direccion = document.getElementById("direccion");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    // Obtener valores y limpiar espacios
    const datos = {
      nombre: nombre.value.trim(),
      apellido_paterno: apellidoPaterno.value.trim(),
      apellido_materno: apellidoMaterno.value.trim(),
      genero: genero.value,
      fecha_nacimiento: fechaNacimiento.value || null,
      telefono: telefono.value.trim() || null,
      direccion: direccion.value.trim() || null,
      correo_electronico: email.value.trim(),
      contrasena: password.value.trim()
    };

    // Validación básica
    if (!emailRegex.test(datos.correo_electronico)) {
      mostrarError("⚠️ Ingresa un correo válido.");
      return;
    }

    if (!passwordRegex.test(datos.contrasena)) {
      mostrarError("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

    if (!datos.nombre || !datos.genero) {
      mostrarError("⚠️ Los campos obligatorios deben completarse.");
      return;
    }

    try {
      const res = await fetch("/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const result = await res.json();

      if (!res.ok) {
        mostrarError(result.message || "❌ Error durante el registro.");
        return;
      }

      mostrarExito("✅ Registro exitoso. Redirigiendo...");
      form.reset();
      setTimeout(() => (window.location.href = "login.html"), 2000);

    } catch (error) {
      console.error("❌ Error de red:", error);
      mostrarError("⚠️ No se pudo conectar con el servidor.");
    }
  });

  // Funciones de UI
  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.style.display = "block";
    mensajeExito.style.display = "none";
  }

  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.style.display = "block";
    mensajeError.style.display = "none";
  }

  function ocultarMensajes() {
    mensajeError.style.display = "none";
    mensajeExito.style.display = "none";
  }
});
