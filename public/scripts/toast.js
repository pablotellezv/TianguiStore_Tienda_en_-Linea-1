/**
 * 📁 toast.js
 * 
 * Descripción:
 * Este archivo maneja la funcionalidad para mostrar notificaciones de tipo "toast" en TianguiStore.
 * Las notificaciones son temporales, se muestran en la parte inferior de la página y desaparecen después de unos segundos.
 * Se pueden mostrar mensajes de éxito, error, advertencia o información.
 * 
 * Funciones:
 * - Mostrar un toast con mensaje y tipo (éxito, error, advertencia, etc.).
 * - Crear dinámicamente el contenedor de los toasts si no existe.
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

function mostrarToast(mensaje, tipo = "success") {
  // Obtener el contenedor de los toasts (lo crea si no existe)
  const toastContainer = obtenerContenedorToasts();
  
  // Generar un ID único para cada toast usando la fecha actual
  const toastId = `toast-${Date.now()}`;
  
  // Asignar clase de tipo de toast según el parámetro 'tipo'
  const tipoClase = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning text-dark", // Texto oscuro para los warnings
    info: "bg-info"
  }[tipo] || "bg-secondary"; // Clase por defecto si el tipo no es válido

  // Crear el HTML para el toast
  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${tipoClase} border-0 fade show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-semibold">${mensaje}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    </div>
  `;

  // Insertar el toast en el contenedor
  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  // Obtener el toast recién creado por su ID
  const toast = document.getElementById(toastId);
  if (toast) {
    // Inicializar y mostrar el toast usando Bootstrap
    const toastInstance = new bootstrap.Toast(toast, { delay: 4000 });
    toastInstance.show();

    // Eliminar el toast del DOM después de la animación
    setTimeout(() => toast.remove(), 4500);
  }
}

/**
 * 🧱 Obtener el contenedor de toasts. 
 * Si no existe, lo crea dinámicamente y lo agrega al body del documento.
 * 
 * @returns {HTMLElement} - El contenedor de los toasts.
 */
function obtenerContenedorToasts() {
  let container = document.getElementById("toast-container");

  // Si no existe el contenedor, crearlo
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = 1080; // Asegurarse de que se muestra sobre otros elementos
    document.body.appendChild(container);
  }

  return container;
}
