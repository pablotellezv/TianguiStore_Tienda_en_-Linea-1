/**
 * 📦 productos.js
 * Carga productos desde la API, los muestra en tarjetas elegantes
 * y permite agregarlos al carrito local (localStorage).
 */

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  actualizarContadorCarrito();
});

/**
 * 🔄 Cargar productos desde API y mostrarlos en tarjetas
 */
async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) return;

  try {
    const response = await fetch("/productos");
    if (!response.ok) throw new Error("No se pudo obtener el listado de productos.");

    const productos = await response.json();
    contenedor.innerHTML = "";

    productos.forEach(producto => {
      const { producto_id: id, nombre = "Producto sin nombre", precio = 0, stock = 0 } = producto;

      // Imagen segura
      let imagen = (producto.imagen_url || "").replace(/\\/g, "/").replace(/^public/, "");
      if (!imagen.startsWith("/")) imagen = "/" + imagen;

      // Crear tarjeta
      const tarjeta = document.createElement("div");
      tarjeta.className = "card producto";

      tarjeta.innerHTML = `
        <img src="${imagen}" alt="${nombre}" class="producto-imagen" />
        <span class="card-title">${nombre}</span>
        <div class="card-info"><i class="fas fa-tag"></i> Precio: $${parseFloat(precio).toFixed(2)}</div>
        <div class="card-info"><i class="fas fa-box"></i> Stock: ${stock}</div>
        <button class="btn-agregar"
          data-id="${id}"
          data-nombre="${nombre}"
          data-precio="${precio}"
          data-imagen="${imagen}">
          <i class="fas fa-cart-plus"></i> Agregar
        </button>
      `;

      // Fallback visual si la imagen falla
      const img = tarjeta.querySelector(".producto-imagen");
      img.onerror = () => {
        img.src = "/imagenes/default.png";
      };

      contenedor.appendChild(tarjeta);
    });

    asignarEventosAgregar();
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
    contenedor.innerHTML = `<p class="center-align red-text">No se pudieron cargar los productos.</p>`;
  }
}

/**
 * ➕ Asigna eventos a los botones "Agregar"
 */
function asignarEventosAgregar() {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const { id, nombre, precio, imagen } = btn.dataset;
      agregarAlCarrito(id, nombre, parseFloat(precio), imagen);
    });
  });
}

/**
 * 🛒 Agrega un producto al carrito (localStorage)
 */
function agregarAlCarrito(id, nombre, precio, imagen_url) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarToast(`🛒 ${nombre} agregado al carrito`, "success");
}

/**
 * 🔢 Actualiza el número en el ícono del carrito
 */
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((suma, p) => suma + p.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach(el => el.textContent = total);
}

/**
 * 🔔 Muestra un toast con mensaje
 */
function mostrarToast(mensaje, tipo = "success") {
  const contenedor = document.getElementById("toast-container") || crearContenedorToasts();

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${tipo} border-0 show shadow mb-2`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-bold">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  contenedor.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/**
 * 🧱 Crea el contenedor para toasts si no existe
 */
function crearContenedorToasts() {
  const div = document.createElement("div");
  div.id = "toast-container";
  div.className = "position-fixed bottom-0 end-0 p-3";
  div.style.zIndex = 1056;
  document.body.appendChild(div);
  return div;
}
