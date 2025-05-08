/**
 * 📁 togglePassword.js
 * 
 * Descripción:
 * Este archivo maneja la funcionalidad de mostrar y ocultar la contraseña en los formularios de inicio de sesión y registro. 
 * Permite alternar la visibilidad de la contraseña al hacer clic en el icono de visibilidad, y también permite 
 * activar esta funcionalidad con el teclado (teclas "Enter" o "Espacio").
 * 
 * Funciones:
 * - Alternar la visibilidad de la contraseña.
 * - Cambiar el icono de visibilidad entre "fa-eye" (mostrar) y "fa-eye-slash" (ocultar).
 * - Permitir la activación de la funcionalidad con el teclado para mejorar la accesibilidad.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePassword");  // Botón para alternar visibilidad de la contraseña
  const passwordInput = document.getElementById("password");  // Campo de entrada de la contraseña
  const icon = toggleBtn?.querySelector("i");  // Icono dentro del botón

  // Si no se encuentran los elementos necesarios, salir
  if (!toggleBtn || !passwordInput || !icon) return;

  /**
   * 🎛️ Alterna la visibilidad de la contraseña
   * Cambia el tipo de input entre "password" y "text" y actualiza el icono.
   */
  const togglePasswordVisibility = () => {
    const isHidden = passwordInput.type === "password";  // Verificar si la contraseña está oculta
    passwordInput.type = isHidden ? "text" : "password";  // Alternar tipo

    // Cambiar el icono según el estado de visibilidad
    icon.classList.toggle("fa-eye", isHidden);
    icon.classList.toggle("fa-eye-slash", !isHidden);

    // Actualizar atributos ARIA para accesibilidad
    toggleBtn.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    toggleBtn.setAttribute("aria-pressed", String(!isHidden));  // Indica el estado actual del botón
  };

  // Asociar el evento de clic para alternar la visibilidad
  toggleBtn.addEventListener("click", togglePasswordVisibility);

  // ♿ Activar la funcionalidad con el teclado (Enter o Espacio)
  toggleBtn.addEventListener("keydown", (e) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();  // Evitar la acción por defecto
      togglePasswordVisibility();  // Alternar visibilidad con el teclado
    }
  });

  // Establecer atributos de accesibilidad para el botón
  toggleBtn.setAttribute("role", "button");
  toggleBtn.setAttribute("tabindex", "0");  // Hacer que el botón sea accesible mediante teclado
  toggleBtn.setAttribute("aria-pressed", "false");  // Indicar que el botón inicialmente no está presionado
});
