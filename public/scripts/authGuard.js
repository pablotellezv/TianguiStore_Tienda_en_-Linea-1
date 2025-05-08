(() => {
  let timeoutRenovacion = null;

  /**
   * 🔐 Verifica si un token JWT ha expirado.
   * @param {string} token - Token JWT.
   * @returns {boolean} - true si está expirado o mal formado.
   */
  function tokenExpirado(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return !payload.exp || payload.exp < ahora;
    } catch (e) {
      console.error("❌ Token inválido o corrupto:", e);
      return true;
    }
  }

  /**
   * 🔄 Solicita un nuevo token al backend antes de que expire.
   * Realiza una petición POST a "/auth/renovar" con el token actual y guarda el nuevo token en el localStorage.
   */
  async function renovarToken() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/auth/renovar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        console.warn("🔐 Token no renovable. Finalizando sesión...");
        cerrarSesionSilenciosa();
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      console.log("✅ Token renovado correctamente.");
      clearTimeout(timeoutRenovacion);
      programarRenovacionToken();
    } catch (error) {
      console.error("❌ Error al renovar token:", error);
      cerrarSesionSilenciosa();
    }
  }

  /**
   * ⏳ Programa renovación automática del token 1 minuto antes de su expiración.
   * Calcula el tiempo restante antes de que el token expire y programa la renovación.
   */
  function programarRenovacionToken() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ahora = Math.floor(Date.now() / 1000);
      const segundosRestantes = payload.exp - ahora;
      const tiempoAntesDeRenovar = (segundosRestantes - 60) * 1000;

      if (tiempoAntesDeRenovar <= 0) {
        console.log("⚠️ Token próximo a expirar. Renovando ya...");
        renovarToken();
        return;
      }

      console.log(`⏱️ Renovación programada en ${(tiempoAntesDeRenovar / 1000 / 60).toFixed(1)} minutos`);
      timeoutRenovacion = setTimeout(renovarToken, tiempoAntesDeRenovar);
    } catch (e) {
      console.error("❌ Error al leer token para programación:", e);
      cerrarSesionSilenciosa();
    }
  }

  /**
   * 🚫 Elimina sesión local y redirige al login.
   * Elimina el token y usuario de localStorage y redirige a la página de login.
   */
  function cerrarSesionSilenciosa() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login.html";
  }

  /**
   * ✅ Verifica que haya sesión válida con estructura y permisos mínimos.
   * @returns {boolean} - true si la sesión es válida, false si no lo es.
   */
  function sesionValida() {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    // Verificar que el usuario tiene la estructura correcta
    const estructuraValida =
      usuario.usuario_id &&
      typeof usuario.rol === "string" &&
      typeof usuario.permisos === "object";

    // Verificar que el usuario tiene permisos adecuados (por ejemplo, leer productos o usuarios)
    const tienePermisos =
      usuario.permisos?.productos?.leer ||
      usuario.permisos?.usuarios?.leer;

    return token && !tokenExpirado(token) && estructuraValida && tienePermisos;
  }

  /**
   * 🎯 Punto de entrada: validación inicial de sesión.
   * Al cargar la página, se valida que la sesión sea válida, de lo contrario se cierra la sesión automáticamente.
   */
  document.addEventListener("DOMContentLoaded", () => {
    if (!sesionValida()) {
      console.warn("🚫 Sesión no válida o permisos insuficientes.");
      cerrarSesionSilenciosa();
      return;
    }

    // Si la sesión es válida, programar la renovación del token.
    programarRenovacionToken();
  });
})();
