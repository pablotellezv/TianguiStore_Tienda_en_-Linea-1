/**
 * 📁 themeToggle.js
 * 
 * Descripción:
 * Este archivo maneja el cambio de tema (claro/oscuro) en TianguiStore. 
 * Permite al usuario alternar entre el modo claro y el modo oscuro mediante un botón, 
 * y guarda la preferencia del usuario en el `localStorage` para mantener el tema seleccionado 
 * al recargar la página.
 * 
 * Funciones:
 * - Establecer el tema inicial basado en el valor guardado en `localStorage`.
 * - Alternar entre el modo claro y oscuro al hacer clic en el botón.
 * - Actualizar el ícono del botón de acuerdo al tema activo.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleThemeBtn");  // Botón para alternar el tema
  const root = document.documentElement;  // Elemento raíz del documento
  const temaGuardado = localStorage.getItem("tema");  // Obtener el tema guardado en localStorage

  // 🌗 Establecer tema inicial desde localStorage
  if (temaGuardado === "claro") {
      root.classList.remove("dark");  // Remover la clase "dark" si el tema es claro
  } else {
      root.classList.add("dark");  // Agregar la clase "dark" si el tema es oscuro
  }

  // 🌞🌙 Icono y toggle
  if (toggleBtn) {
      // Actualizar el ícono al cargar la página
      actualizarIcono();

      // Alternar entre el modo claro y oscuro al hacer clic en el botón
      toggleBtn.addEventListener("click", () => {
          const modoOscuroActivo = root.classList.contains("dark");  // Verificar si el modo oscuro está activo
          root.classList.toggle("dark");  // Alternar entre los temas
          localStorage.setItem("tema", modoOscuroActivo ? "claro" : "oscuro");  // Guardar el tema seleccionado en localStorage
          actualizarIcono();  // Actualizar el ícono del botón
      });
  }

  // 🔁 Actualiza el ícono del botón según el tema activo
  function actualizarIcono() {
      if (!toggleBtn) return;  // Verificar si el botón existe
      toggleBtn.innerHTML = root.classList.contains("dark")  // Cambiar el ícono según el tema activo
          ? '<i class="fas fa-sun"></i>'  // Si el tema es oscuro, mostrar el ícono del sol
          : '<i class="fas fa-moon"></i>';  // Si el tema es claro, mostrar el ícono de la luna
  }
});
