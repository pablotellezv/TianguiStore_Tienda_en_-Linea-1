/**
 * 📦 carrito.js
 * 
 * Descripción:
 * Este archivo contiene la lógica para manejar el carrito de compras en TianguiStore. 
 * Permite mostrar los productos del carrito, modificar las cantidades, eliminar productos, 
 * vaciar el carrito y realizar el pedido. Además, gestiona la validación del stock y la 
 * visualización de toasts para notificaciones.
 * 
 * Funciones:
 * - Mostrar carrito
 * - Modificar cantidades y eliminar productos
 * - Realizar pedido con verificación de stock
 * - Manejo de toasts flotantes para notificaciones
 * 
 * Autor: I.S.C. Erick Renato Vega Ceron
 * Fecha de Creación: Mayo 2025
 */

const BASE_URL = window.location.origin; // URL base del sitio
const token = localStorage.getItem("token"); // Obtener token de autenticación

document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContadorCarrito();

  // 🛒 Botón para procesar pedido
  const btnPagar = document.getElementById("btnRealizarPedido");
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (!token) {
        alert("⚠️ Debes iniciar sesión para completar tu compra.");
        window.location.href = `${BASE_URL}/login.html`;
        return;
      }
      realizarPedidoDesdeLocalStorage();
    });
  }

  // 🧹 Botón para vaciar carrito
  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      mostrarCarrito();
      actualizarContadorCarrito();
      mostrarToast("Carrito vaciado correctamente.", "warning");
    });
  }
});

// 🔍 Mostrar productos del carrito en pantalla
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("lista-carrito");
  const totalLabel = document.getElementById("total_etiqueta");

  if (!lista || !totalLabel) return;

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<p class='text-center text-muted'>🛒 Tu carrito está vacío.</p>";
    totalLabel.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  carrito.forEach(producto => {
    const precio = parseFloat(producto.precio) || 0;
    const subtotal = precio * producto.cantidad;
    total += subtotal;

    const imagen = producto.imagen_url
      ? (producto.imagen_url.startsWith("http")
        ? producto.imagen_url
        : `${BASE_URL}/${producto.imagen_url.replace(/^\/+/, '')}`)
      : `${BASE_URL}/imagenes/default.png`;

    lista.innerHTML += `
      <li class="list-group-item d-flex align-items-center shadow-sm p-3 rounded">
        <img src="${imagen}" alt="${producto.nombre}" 
             class="img-thumbnail me-3 rounded-circle" 
             style="width: 60px; height: 60px; object-fit: cover;"
             onerror="this.src='${BASE_URL}/imagenes/default.png';">
        <div class="flex-grow-1">
          <h6 class="mb-1 text-primary fw-bold">${producto.nombre}</h6>
          <small class="text-muted">Precio: <span class="text-dark fw-bold">$${precio.toFixed(2)}</span></small> |
          <small class="text-muted">Subtotal: <span class="text-success fw-bold">$${subtotal.toFixed(2)}</span></small>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-danger btn-sm disminuir-cantidad rounded-circle me-2" data-id="${producto.id}">
            <i class="fas fa-minus"></i>
          </button>
          <span class="mx-2 cantidad-producto fw-bold text-dark">${producto.cantidad}</span>
          <button class="btn btn-outline-success btn-sm aumentar-cantidad rounded-circle ms-2" data-id="${producto.id}">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="btn btn-outline-danger btn-sm eliminar-producto ms-3 px-3 rounded-pill" data-id="${producto.id}">
          <i class="fas fa-trash-alt"></i> Eliminar
        </button>
      </li>`;
  });

  totalLabel.textContent = `Total: $${total.toFixed(2)}`;

  // Asignar eventos para aumentar/disminuir cantidades y eliminar productos
  document.querySelectorAll(".aumentar-cantidad").forEach(btn =>
    btn.addEventListener("click", e => modificarCantidad(e.currentTarget.dataset.id, 1)));

  document.querySelectorAll(".disminuir-cantidad").forEach(btn =>
    btn.addEventListener("click", e => modificarCantidad(e.currentTarget.dataset.id, -1)));

  document.querySelectorAll(".eliminar-producto").forEach(btn =>
    btn.addEventListener("click", e => eliminarProducto(e.currentTarget.dataset.id)));
}

// 🔄 Aumentar o disminuir cantidad de un producto
function modificarCantidad(id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1); // Eliminar producto si cantidad <= 0
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
  }
}

// ❌ Eliminar producto del carrito
function eliminarProducto(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(p => p.id !== id); // Filtrar el producto a eliminar
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
  mostrarToast("Producto eliminado del carrito.", "danger");
}

// 🔢 Contador visual del total de productos
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0); // Calcular el total de productos
  document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
}

// 🔔 Toasts flotantes
function mostrarToast(mensaje, tipo = "success") {
  const container = document.getElementById("toast-container") || crearContenedorToasts();
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-bold">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Crear contenedor para los toasts si no existe
function crearContenedorToasts() {
  const div = document.createElement("div");
  div.id = "toast-container";
  div.className = "position-fixed bottom-0 end-0 p-3";
  div.style.zIndex = 1056;
  document.body.appendChild(div);
  return div;
}

// 🚀 Validación y envío del pedido (modo autenticado)
async function realizarPedidoDesdeLocalStorage() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const errores = [];

  // Verificar que el stock de cada producto sea suficiente
  for (const item of carrito) {
    try {
      const res = await fetch(`${BASE_URL}/productos/${item.id}`);
      if (!res.ok) throw new Error("No se pudo obtener información del producto.");
      const producto = await res.json();

      if (item.cantidad > producto.stock) {
        errores.push(`"${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`);
      }
    } catch (error) {
      errores.push(`Error al verificar producto ID ${item.id}`);
    }
  }

  // Si hay errores, mostrar alerta y no continuar
  if (errores.length > 0) {
    alert("❌ No se puede procesar el pedido:\n\n" + errores.join("\n"));
    return;
  }

  // Crear el pedido con los productos del carrito
  const payload = {
    productos: carrito.map(p => ({
      producto_id: p.id,
      cantidad: p.cantidad,
      precio_unitario: parseFloat(p.precio)
    }))
  };

  try {
    const res = await fetch(`${BASE_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.removeItem("carrito"); // Vaciar carrito tras el pedido
      mostrarCarrito();
      actualizarContadorCarrito();
      alert("✅ Pedido generado correctamente.");
    } else {
      alert("❌ Error al generar el pedido: " + (data?.mensaje || "Error desconocido."));
    }

  } catch (error) {
    console.error("❌ Error inesperado:", error);
    alert("❌ Ocurrió un error inesperado al procesar tu pedido.");
  }
}
