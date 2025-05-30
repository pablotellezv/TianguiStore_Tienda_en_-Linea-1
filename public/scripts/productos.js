/**
 * 📦 productos.js
 * Muestra productos con tarjetas glassmorphism + paginación.
 * Autor: I.S.C. Erick Renato Vega Ceron | Estilo Dark Glassmorphism Mexica | Mayo 2025
 */

let productosGlobal = [];
let productosPorPagina = 10;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  actualizarContadorCarrito();
});

/* ════════════════════════════════════════════
 * 🔄 Cargar productos desde API y mostrar primera página
 * ════════════════════════════════════════════ */
async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");
  const paginacion = document.getElementById("paginacion-productos");
  if (!contenedor || !paginacion) return;

  try {
    const res = await fetch("/productos");
    if (!res.ok) throw new Error("No se pudo obtener el listado de productos.");

    productosGlobal = await res.json();
    if (!Array.isArray(productosGlobal) || productosGlobal.length === 0) {
      contenedor.innerHTML = `<p class="center-align grey-text text-lighten-2">No hay productos disponibles.</p>`;
      paginacion.innerHTML = "";
      return;
    }

    mostrarPagina(paginaActual);
    generarPaginacion();
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="center-align red-text text-lighten-2">Error al cargar productos.</p>`;
    paginacion.innerHTML = "";
  }
}

/* ════════════════════════════════════════════
 * 📄 Mostrar productos por página
 * ════════════════════════════════════════════ */
function mostrarPagina(num) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  const inicio = (num - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosGlobal.slice(inicio, fin);

  productosPagina.forEach((producto) =>
    renderizarProducto(producto, contenedor)
  );
  asignarEventosAgregar();
}

/* ════════════════════════════════════════════
 * 🔢 Crear paginación dinámica
 * ════════════════════════════════════════════ */
function generarPaginacion() {
  const paginacion = document.getElementById("paginacion-productos");
  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(productosGlobal.length / productosPorPagina);

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className =
      i === paginaActual ? "active amber darken-3" : "waves-effect";
    const a = document.createElement("a");
    a.href = "#!";
    a.textContent = i;
    a.addEventListener("click", () => {
      paginaActual = i;
      mostrarPagina(paginaActual);
      generarPaginacion();
    });
    li.appendChild(a);
    paginacion.appendChild(li);
  }
}

/* ════════════════════════════════════════════
 * 🧱 Renderizar una tarjeta de producto estilo dark glass
 * ════════════════════════════════════════════ */
function renderizarProducto(producto, contenedor) {
  const {
    producto_id: id,
    nombre = "Producto sin nombre",
    descripcion = "Sin descripción",
    precio = 0,
    stock = 0,
    imagen_url,
  } = producto;

  let imagen =
    imagen_url && imagen_url.trim()
      ? imagen_url.trim()
      : "/imagenes/default.png";
  imagen = imagen
    .replace(/\\/g, "/")
    .replace(/^public/, "")
    .replace(/^\/?/, "/");

  const tarjeta = document.createElement("div");
  tarjeta.className = "col s12 m6 l4";

  const card = document.createElement("div");
  card.classList.add(
    "card",
    "glass-card",
    "product-card",
    "hoverable",
    "z-depth-4"
  );

  const cardImage = document.createElement("div");
  cardImage.className = "card-image";

  // Aquí envolvemos la imagen con un enlace que apunta a detalle-producto.html?id=ID
  const enlace = document.createElement("a");
  enlace.href = `producto.html?id=${encodeURIComponent(id)}`;
  enlace.setAttribute("aria-label", `Ver detalles de ${nombre}`);

  const img = document.createElement("img");
  img.src = imagen;
  img.alt = `Imagen de ${nombre}`;
  img.className = "responsive-img";
  img.loading = "lazy";
  img.style.height = "180px";
  img.style.objectFit = "cover";
  img.onerror = () => {
    img.src = "/imagenes/default.png";
  };

  enlace.appendChild(img);
  cardImage.appendChild(enlace);

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";
  cardContent.innerHTML = `
  <h6 class="product-title">
    ${nombre}
  </h6>
  <p class="product-description">
    ${descripcion}
  </p>
  <div class="product-price-stock">
    <span class="product-price">$${parseFloat(precio).toFixed(2)}</span>
    <span class="product-stock">Stock: ${stock}</span>
  </div>
`;

  const cardAction = document.createElement("div");
  cardAction.className = "card-action center-align";
  const btn = document.createElement("button");
  btn.className =
    "btn amber darken-2 waves-effect waves-light btn-agregar z-depth-1";
  btn.style.borderRadius = "20px";
  btn.setAttribute("aria-label", `Agregar ${nombre} al carrito`);
  btn.innerHTML = `<i class="fas fa-cart-plus left"></i> Agregar`;
  btn.dataset.id = id;
  btn.dataset.nombre = nombre;
  btn.dataset.precio = precio;
  btn.dataset.imagen = imagen;
  cardAction.appendChild(btn);

  card.appendChild(cardImage);
  card.appendChild(cardContent);
  card.appendChild(cardAction);
  tarjeta.appendChild(card);
  contenedor.appendChild(tarjeta);
}

/* ════════════════════════════════════════════
 * ➕ Eventos para botones "Agregar al carrito"
 * ════════════════════════════════════════════ */
function asignarEventosAgregar() {
  document.querySelectorAll(".btn-agregar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { id, nombre, precio, imagen } = btn.dataset;
      const imagenFinal = imagen?.trim() || "/imagenes/default.png";
      agregarAlCarrito(id, nombre, parseFloat(precio), imagenFinal);
    });
  });
}

/* ════════════════════════════════════════════
 * 🛒 Agregar producto al carrito (localStorage)
 * ════════════════════════════════════════════ */
function agregarAlCarrito(id, nombre, precio, imagen_url) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carrito.find((p) => p.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1, imagen_url });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarToast(`🛒 ${nombre} agregado al carrito`);
}

/* ════════════════════════════════════════════
 * 🔄 Actualizar contador visual del carrito
 * ════════════════════════════════════════════ */
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
  document
    .querySelectorAll("#contador-carrito")
    .forEach((el) => (el.textContent = total));
}

/* ════════════════════════════════════════════
 * 🔔 Mostrar notificación tipo toast
 * ════════════════════════════════════════════ */
function mostrarToast(mensaje) {
  M.toast({
    html: `<i class="fas fa-check-circle left"></i> ${mensaje}`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000,
  });
}
