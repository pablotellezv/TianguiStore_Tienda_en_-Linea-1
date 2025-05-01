(function () {
    let timeoutRenovacion = null;
  
    // 🧠 Función para iniciar la renovación basada en exp
    function programarRenovacionToken() {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));
        if (!decoded.exp) throw new Error("Token sin expiración");
  
        const ahora = Math.floor(Date.now() / 1000);
        const segundosRestantes = decoded.exp - ahora;
        const tiempoAntesDeRenovar = (segundosRestantes - 60) * 1000; // 1 minuto antes
  
        if (tiempoAntesDeRenovar <= 0) {
          console.warn("⚠️ Token próximo a expirar. Renovando ya...");
          renovarToken();
          return;
        }
  
        console.log(`⏳ Próxima renovación en ${(tiempoAntesDeRenovar / 1000 / 60).toFixed(1)} min`);
        timeoutRenovacion = setTimeout(renovarToken, tiempoAntesDeRenovar);
      } catch (e) {
        console.error("❌ Token inválido o mal formado:", e);
        cerrarSesionSilenciosa();
      }
    }
  
    // 🔁 Renueva el token directamente con el backend
    async function renovarToken() {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await fetch("/auth/renovar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        });
  
        if (!res.ok) {
          console.warn("🔒 Token expirado o inválido.");
          cerrarSesionSilenciosa();
          return;
        }
  
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        console.log("✅ Token renovado correctamente.");
  
        clearTimeout(timeoutRenovacion); // Limpia anterior
        programarRenovacionToken(); // Reprograma
      } catch (error) {
        console.error("❌ Error de red al renovar token:", error);
        cerrarSesionSilenciosa();
      }
    }
  
    // 🔐 Verifica si el token está expirado (preventivo)
    function tokenExpirado(token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const ahora = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp < ahora;
      } catch (e) {
        console.error("❌ Error al decodificar el token:", e);
        return true;
      }
    }
  
    // 🚫 Cierra sesión silenciosamente
    function cerrarSesionSilenciosa() {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login.html";
    }
  
    // 🚀 Verifica la sesión actual y estructura de usuario
    function validarSesion() {
      const token = localStorage.getItem("token");
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  
      const estructuraOk =
        typeof usuario === "object" &&
        usuario.usuario_id &&
        typeof usuario.rol === "string" &&
        typeof usuario.permisos === "object";
  
      const permisosMinimos =
        usuario.permisos?.productos?.leer === true ||
        usuario.permisos?.usuarios?.leer === true;
  
      return token && !tokenExpirado(token) && estructuraOk && permisosMinimos;
    }
  
    // 🎯 Punto de entrada
    document.addEventListener("DOMContentLoaded", () => {
      if (!validarSesion()) {
        console.warn("🚫 Sesión no válida o insuficiente.");
        cerrarSesionSilenciosa();
        return;
      }
  
      programarRenovacionToken(); // 🧠 Empieza renovación dinámica
    });
  })();
  