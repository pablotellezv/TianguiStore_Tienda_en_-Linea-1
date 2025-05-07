document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recuperarForm");
  const emailInput = document.getElementById("email");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    ocultarMensajes();

    const email = emailInput.value.trim();
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(email)) {
      emailInput.classList.add("is-invalid");
      mostrarError("❌ Correo electrónico no válido.");
      return;
    }

    try {
      const res = await fetch("/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo_electronico: email })
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarError(data.message || "❌ No se pudo enviar el correo.");
        return;
      }

      mostrarExito("📩 Se ha enviado un enlace de recuperación si el correo está registrado.");
    } catch (err) {
      console.error("❌ Error en recuperación:", err);
      mostrarError("❌ Error al conectar con el servidor.");
    }
  });

  // Mostrar mensaje de error
  function mostrarError(msg) {
    mensajeError.textContent = msg;
    mensajeError.classList.remove("d-none");
  }

  // Mostrar mensaje de éxito
  function mostrarExito(msg) {
    mensajeExito.textContent = msg;
    mensajeExito.classList.remove("d-none");
  }

  // Ocultar todos los mensajes
  function ocultarMensajes() {
    mensajeError.classList.add("d-none");
    mensajeExito.classList.add("d-none");
    emailInput.classList.remove("is-invalid");
  }
});
