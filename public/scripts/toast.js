// 📁 scripts/toast.js

function mostrarToast(mensaje, tipo = "success") {
    const toastContainer = obtenerContenedorToasts();
    const toastId = `toast-${Date.now()}`;
    const tipoClase = {
      success: "bg-success",
      danger: "bg-danger",
      warning: "bg-warning text-dark",
      info: "bg-info"
    }[tipo] || "bg-secondary";
  
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${tipoClase} border-0 fade show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body fw-semibold">${mensaje}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
      </div>
    `;
  
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  
    const toast = document.getElementById(toastId);
    if (toast) {
      const toastInstance = new bootstrap.Toast(toast, { delay: 4000 });
      toastInstance.show();
      setTimeout(() => toast.remove(), 4500); // Remover del DOM tras animación
    }
  }
  
  function obtenerContenedorToasts() {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container position-fixed bottom-0 end-0 p-3";
      container.style.zIndex = 1080;
      document.body.appendChild(container);
    }
    return container;
  }
  