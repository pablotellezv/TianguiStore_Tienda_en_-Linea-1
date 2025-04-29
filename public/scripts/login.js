document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const mensajeError = document.getElementById("mensajeError");
    const mensajeExito = document.getElementById("mensajeExito");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      ocultarMensajes();
  
      const email = emailInput.value.trim();         // ✅ Eliminar espacios innecesarios
      const password = passwordInput.value.trim();
  
      const valido = validarFormulario(email, password);
      if (!valido) return;
  
      console.log("✉️ Enviando login:", { correo_electronico: email, contrasena: password });
  
      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo_electronico: email, contrasena: password }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          mostrarError(data.message || "Credenciales inválidas.");
          return;
        }
  
        // ✅ Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
  
        mostrarExito("Inicio de sesión exitoso ✅");
  
        // ✅ Redirigir según el rol
        const rol = data.usuario.rol;
        setTimeout(() => {
          if (rol === "admin" || rol === "vendedor") {
            window.location.href = "admin-panel.html";
          } else {
            window.location.href = "index.html";
          }
        }, 1500);
      } catch (error) {
        console.error("❌ Error:", error);
        mostrarError("No se pudo conectar con el servidor.");
      }
    });
  
    // Validación de campos de entrada
    function validarFormulario(correo, contrasena) {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  
      let valido = true;
  
      if (!regexCorreo.test(correo)) {
        emailInput.classList.add("is-invalid");
        mostrarError("Correo electrónico no válido.");
        valido = false;
      } else {
        emailInput.classList.remove("is-invalid");
      }
  
      if (!regexPassword.test(contrasena)) {
        passwordInput.classList.add("is-invalid");
        mostrarError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        valido = false;
      } else {
        passwordInput.classList.remove("is-invalid");
      }
  
      return valido;
    }
  
    function mostrarError(mensaje) {
      mensajeError.textContent = mensaje;
      mensajeError.classList.remove("d-none");
    }
  
    function mostrarExito(mensaje) {
      mensajeExito.textContent = mensaje;
      mensajeExito.classList.remove("d-none");
    }
  
    function ocultarMensajes() {
      mensajeError.classList.add("d-none");
      mensajeExito.classList.add("d-none");
      emailInput.classList.remove("is-invalid");
      passwordInput.classList.remove("is-invalid");
    }
  });
  