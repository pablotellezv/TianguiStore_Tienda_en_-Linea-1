const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContadorCarrito();

  const btnPagar = document.getElementById("btnRealizarPedido");
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      if (!token) {
        alert("⚠️ Debes iniciar sesión para completar tu compra.");
        window.location.href = `${BASE_URL}/login.html`;
        return;
      }
      validarStockAntesDeCheckout();
    });
  }

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

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("lista-carrito");
  const totalLabel = document.getElementById("total_etiqueta");

  if (!lista || !totalLabel) return;

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<p class='text-center text-muted'>🛒 Tu carrito está vacío.</p>`;
    totalLabel.textContent = "Total: $0.00";
    return;
  }

  let total = 0;

  carrito.forEach(producto => {
    const precio = parseFloat(producto.precio) || 0;
    const subtotal = precio * producto.cantidad;
    total += subtotal;

    const imagenUrl = producto.imagen_url?.startsWith("http")
      ? producto.imagen_url
      : `${BASE_URL}/${producto.imagen_url?.replace(/^\/+/, "") || "imagenes/default.png"}`;

    const item = document.createElement("li");
    item.className = "list-group-item d-flex align-items-center shadow-sm p-3 rounded";

    const img = document.createElement("img");
    img.src = imagenUrl;
    img.alt = producto.nombre;
    img.className = "img-thumbnail me-3 rounded-circle";
    img.style = "width: 60px; height: 60px; object-fit: cover;";
    img.onerror = () => {
      img.src = `${BASE_URL}/imagenes/default.png`;
    };

    const nombre = document.createElement("h6");
    nombre.className = "mb-1 text-primary fw-bold";
    nombre.textContent = producto.nombre;

    const precios = document.createElement("small");
    precios.className = "text-muted";
    precios.innerHTML = `Precio: <span class="text-light fw-bold">$${precio.toFixed(2)}</span> |
                         Subtotal: <span class="text-success fw-bold">$${subtotal.toFixed(2)}</span>`;

    const texto = document.createElement("div");
    texto.className = "flex-grow-1";
    texto.appendChild(nombre);
    texto.appendChild(precios);

    const btnDisminuir = document.createElement("button");
    btnDisminuir.className = "btn btn-outline-danger btn-sm disminuir-cantidad rounded-circle me-2";
    btnDisminuir.innerHTML = `<i class="fas fa-minus"></i>`;
    btnDisminuir.dataset.id = producto.id;
    btnDisminuir.addEventListener("click", () => modificarCantidad(producto.id, -1));

    const cantidad = document.createElement("span");
    cantidad.className = "mx-2 cantidad-producto fw-bold text-light";
    cantidad.textContent = producto.cantidad;

    const btnAumentar = document.createElement("button");
    btnAumentar.className = "btn btn-outline-success btn-sm aumentar-cantidad rounded-circle ms-2";
    btnAumentar.innerHTML = `<i class="fas fa-plus"></i>`;
    btnAumentar.dataset.id = producto.id;
    btnAumentar.addEventListener("click", () => modificarCantidad(producto.id, 1));

    const acciones = document.createElement("div");
    acciones.className = "d-flex align-items-center";
    acciones.appendChild(btnDisminuir);
    acciones.appendChild(cantidad);
    acciones.appendChild(btnAumentar);

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-outline-danger btn-sm eliminar-producto ms-3 px-3 rounded-pill";
    btnEliminar.innerHTML = `<i class="fas fa-trash-alt"></i> Eliminar`;
    btnEliminar.dataset.id = producto.id;
    btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));

    item.appendChild(img);
    item.appendChild(texto);
    item.appendChild(acciones);
    item.appendChild(btnEliminar);

    lista.appendChild(item);
  });

  totalLabel.textContent = `Total: $${total.toFixed(2)}`;
}

function modificarCantidad(id, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
  }
}

function eliminarProducto(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
  mostrarToast("Producto eliminado del carrito.", "danger");
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
}

function mostrarToast(mensaje, tipo = "success") {
  const container = document.getElementById("toast-container") || crearContenedorToasts();
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow mb-2`;
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

function crearContenedorToasts() {
  const div = document.createElement("div");
  div.id = "toast-container";
  div.className = "position-fixed bottom-0 end-0 p-3";
  div.style.zIndex = 1056;
  document.body.appendChild(div);
  return div;
}

async function validarStockAntesDeCheckout() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const errores = [];

  if (carrito.length === 0) {
    alert("❌ El carrito está vacío.");
    return;
  }

  for (const item of carrito) {
    try {
      const res = await fetch(`${BASE_URL}/api/productos/${item.id}`);
      if (!res.ok) throw new Error("No se pudo obtener información del producto.");
      const producto = await res.json();
      if (item.cantidad > producto.stock) {
        errores.push(`"${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`);
      }
    } catch (error) {
      errores.push(`Error al verificar stock del producto ID ${item.id}`);
    }
  }

  if (errores.length > 0) {
    alert("❌ No se puede continuar:\n\n" + errores.join("\n"));
    return;
  }

  // Stock validado exitosamente
  localStorage.setItem("checkout_validado", "true");
  window.location.href = `${BASE_URL}/checkout.html`;
}
