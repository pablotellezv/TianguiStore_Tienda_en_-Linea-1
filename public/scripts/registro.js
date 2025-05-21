/**
 * 📦 registro.js
 * Registro de usuarios para TianguiStore con validaciones y envío al backend.
 * Autor: I.S.C. Erick Renato Vega Ceron | Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");

  // 🎯 Campos del formulario
  const campos = {
    nombre: document.getElementById("nombre"),
    apellido_paterno: document.getElementById("apellido_paterno"),
    apellido_materno: document.getElementById("apellido_materno"),
    genero: document.getElementById("genero"),
    fecha_nacimiento: document.getElementById("fecha_nacimiento"),
    telefono: document.getElementById("telefono"),
    direccion: document.getElementById("direccion"),
    correo_electronico: document.getElementById("email"),
    contrasena: document.getElementById("password")
  };

  // 🧾 Contenedores de mensajes
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  // ✅ Expresiones regulares
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // Letra + número, 8+ caracteres

  // 📤 Envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    const datos = obtenerDatosLimpios();

    const errores = validarCampos(datos);

    if (errores.length > 0) {
      mostrarError("⚠️ " + errores.join(" "));
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
        console.error("❌ Error del backend:", result);
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

  // 🔍 Recolección y limpieza de datos
  function obtenerDatosLimpios() {
    return {
      nombre: campos.nombre.value.trim(),
      apellido_paterno: campos.apellido_paterno.value.trim(),
      apellido_materno: campos.apellido_materno.value.trim(),
      genero: campos.genero.value,
      fecha_nacimiento: campos.fecha_nacimiento.value || null,
      telefono: campos.telefono.value.trim() || null,
      direccion: campos.direccion.value.trim() || null,
      correo_electronico: campos.correo_electronico.value.trim(),
      contrasena: campos.contrasena.value.trim()
    };
  }

  // 📋 Validaciones de campos
  function validarCampos(datos) {
    const errores = [];

    if (!datos.nombre) errores.push("El nombre es obligatorio.");
    if (!datos.genero) errores.push("El género es obligatorio.");
    if (!emailRegex.test(datos.correo_electronico)) errores.push("Correo electrónico inválido.");
    if (!passwordRegex.test(datos.contrasena)) errores.push("La contraseña debe tener al menos 8 caracteres, una letra y un número.");

    return errores;
  }

  // 🧾 Mostrar mensajes en pantalla
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
