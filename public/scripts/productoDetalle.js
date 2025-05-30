/**
 * productoDetalle.js
 * Maneja la carga dinámica de datos del producto y la interacción del carrito en detalle-producto.html
 */

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("id");

  if (!productoId) {
    mostrarError("No se especificó un producto.");
    return;
  }

  cargarProducto(productoId);
});

async function cargarProducto(id) {
  try {
    // Aquí depende de tu API. Ejemplo: GET /productos/:id
    const res = await fetch(`/productos/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("Producto no encontrado.");

    const producto = await res.json();

    mostrarProducto(producto);
  } catch (error) {
    mostrarError("Error al cargar el producto.");
    console.error(error);
  }
}

function mostrarProducto(producto) {
  const {
    producto_id,
    nombre = "Sin nombre",
    descripcion = "Sin descripción",
    precio = 0,
    stock = 0,
    imagen_url,
  } = producto;

  const imgElem = document.getElementById("producto-imagen");
  const tituloElem = document.getElementById("producto-titulo");
  const descElem = document.getElementById("producto-descripcion");
  const precioElem = document.getElementById("producto-precio");
  const stockElem = document.getElementById("producto-stock");
  const breadcrumbProducto = document.getElementById("breadcrumb-producto");
  const cantidadInput = document.getElementById("cantidad");
  const btnAgregar = document.getElementById("btn-agregar-carrito");

  // Imagen
  if (imagen_url && imagen_url.trim()) {
    let urlImg = imagen_url.trim().replace(/\\/g, "/").replace(/^public/, "").replace(/^\/?/, "/");
    imgElem.src = urlImg;
    imgElem.alt = `Imagen del producto ${nombre}`;
  } else {
    imgElem.src = "/imagenes/default.png";
    imgElem.alt = `Imagen por defecto`;
  }

  // Texto
  tituloElem.textContent = nombre;
  descElem.textContent = descripcion;
  precioElem.textContent = `$${parseFloat(precio).toFixed(2)}`;

  // Stock y cantidad
  stockElem.innerHTML = `Disponible: <span>${stock} ${stock === 1 ? "unidad" : "unidades"}</span>`;

  cantidadInput.max = stock;
  cantidadInput.value = stock > 0 ? 1 : 0;
  cantidadInput.disabled = stock === 0;

  btnAgregar.disabled = stock === 0;

  breadcrumbProducto.textContent = nombre;

  // Evento botón agregar al carrito
  btnAgregar.onclick = () => {
    const cantidad = parseInt(cantidadInput.value);
    if (isNaN(cantidad) || cantidad < 1 || cantidad > stock) {
      M.toast({
        html: "Cantidad inválida.",
        classes: "rounded red darken-2 white-text",
        displayLength: 3000,
      });
      return;
    }
    agregarAlCarrito(producto_id, nombre, precio, cantidad, imgElem.src);
  };
}

function agregarAlCarrito(id, nombre, precio, cantidad, imagen) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const index = carrito.findIndex((p) => p.id === id);
  if (index > -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({ id, nombre, precio, cantidad, imagen_url: imagen });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();

  M.toast({
    html: `🛒 ${nombre} (${cantidad}) agregado${cantidad > 1 ? "s" : ""} al carrito.`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000,
  });
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
  document.querySelectorAll("#contador-carrito").forEach((el) => (el.textContent = total));
}

function mostrarError(mensaje) {
  const main = document.querySelector("main.container");
  main.innerHTML = `<p class="red-text center-align" style="margin-top: 3rem;">${mensaje}</p>`;
}
