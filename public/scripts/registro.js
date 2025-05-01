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
  
      // Ocultar mensajes
      mensajeError.classList.add("d-none");
      mensajeExito.classList.add("d-none");
  
      const correo = email.value.trim();
      const contrasena = password.value.trim();
  
      let esValido = true;
  
      // Validar correo
      if (!emailRegex.test(correo)) {
        email.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ Ingrese un correo electrónico válido.";
        mensajeError.classList.remove("d-none");
        esValido = false;
      } else {
        email.classList.remove("is-invalid");
      }
  
      // Validar contraseña
      if (!passwordRegex.test(contrasena)) {
        password.classList.add("is-invalid");
        mensajeError.textContent = "⚠️ La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.";
        mensajeError.classList.remove("d-none");
        esValido = false;
      } else {
        password.classList.remove("is-invalid");
      }
  
      if (!esValido) {
        mensajeError.scrollIntoView({ behavior: "smooth" });
        return;
      }
  
      // Enviar datos al backend
      try {
        const response = await fetch("/auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo_electronico: correo,
            contrasena: contrasena,
            nombre: "Usuario", // Puedes personalizar o extender el formulario
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          const mensaje = data.message || "❌ Error durante el registro.";
          mensajeError.textContent = mensaje;
          mensajeError.classList.remove("d-none");
          mensajeError.scrollIntoView({ behavior: "smooth" });
          return;
        }
  
        // Registro exitoso
        mensajeExito.textContent = "✅ Registro exitoso. Redirigiendo al inicio de sesión...";
        mensajeExito.classList.remove("d-none");
        form.reset();
        setTimeout(() => (window.location.href = "login.html"), 2000);
  
      } catch (error) {
        console.error("❌ Error en el registro:", error);
        mensajeError.textContent = "⚠️ No se pudo conectar con el servidor.";
        mensajeError.classList.remove("d-none");
        mensajeError.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  