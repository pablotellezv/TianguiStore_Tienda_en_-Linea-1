/**
 * 📁 togglePassword.js
 * 
 * Descripción:
 * Este módulo permite mostrar u ocultar la contraseña en formularios de TianguiStore, 
 * mejorando la experiencia del usuario y cumpliendo con prácticas de accesibilidad.
 * 
 * Funcionalidad:
 * - Alterna la visibilidad del campo de contraseña entre 'password' y 'text'.
 * - Cambia el icono de FontAwesome según el estado.
 * - Permite activación vía teclado (Enter o Espacio).
 * - Añade soporte ARIA para lectores de pantalla y navegación accesible.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePassword"); // 🔘 Botón que alterna visibilidad
  const passwordInput = document.getElementById("password");   // 🔐 Campo de entrada de contraseña
  const icon = toggleBtn?.querySelector("i");                  // 👁️ Icono de visibilidad dentro del botón

  // ⚠️ Verificación de elementos requeridos
  if (!toggleBtn || !passwordInput || !icon) return;

  /**
   * 🎛️ Alterna la visibilidad del campo de contraseña
   * y actualiza el icono y atributos ARIA asociados.
   */
  const togglePasswordVisibility = () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    // 🎨 Actualización visual del icono
    icon.classList.toggle("fa-eye", isHidden);
    icon.classList.toggle("fa-eye-slash", !isHidden);

    // ♿ Accesibilidad
    toggleBtn.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    toggleBtn.setAttribute("aria-pressed", String(!isHidden));
  };

  // 🖱️ Evento de clic
  toggleBtn.addEventListener("click", togglePasswordVisibility);

  // ⌨️ Soporte para teclado (Enter o Espacio)
  toggleBtn.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key === "Enter" || key === " ") {
      event.preventDefault();
      togglePasswordVisibility();
    }
  });

  // ♿ Inicialización de atributos de accesibilidad
  toggleBtn.setAttribute("role", "button");
  toggleBtn.setAttribute("tabindex", "0");
  toggleBtn.setAttribute("aria-label", "Mostrar contraseña");
  toggleBtn.setAttribute("aria-pressed", "false");
});
