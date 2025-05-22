/**
 * 📦 productos.js
 * Carga los productos desde el backend, los renderiza en tarjetas con estilo y permite agregarlos al carrito local.
 * Compatible con diseño oscuro, glassmorphism y experiencia moderna.
 * Autor: I.S.C. Erick Renato Vega Ceron | Mayo 2025
 */

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  actualizarContadorCarrito();
});

/* 🔄 Cargar productos desde la API y renderizarlos en tarjetas */
async function cargarProductos() {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) return;

  try {
    const res = await fetch("/productos");
    if (!res.ok) throw new Error("No se pudo obtener el listado de productos.");

    const productos = await res.json();
    contenedor.innerHTML = "";

    if (!Array.isArray(productos) || productos.length === 0) {
      contenedor.innerHTML = `<p class="center-align grey-text text-lighten-2">No hay productos disponibles.</p>`;
      return;
    }

    productos.forEach(producto => {
      const {
        producto_id: id,
        nombre = "Producto sin nombre",
        descripcion = "Sin descripción",
        precio = 0,
        stock = 0,
        imagen_url
      } = producto;

      // Validar imagen o usar la predeterminada
      let imagen = (imagen_url && imagen_url.trim()) ? imagen_url.trim() : "/imagenes/default.png";
      imagen = imagen.replace(/\\/g, "/").replace(/^public/, "").replace(/^\/?/, "/");

      // Crear estructura DOM para cada tarjeta
      const tarjeta = document.createElement("div");
      tarjeta.className = "card producto";

      const img = document.createElement("img");
      img.src = imagen;
      img.alt = nombre;
      img.className = "producto-imagen";
      img.onerror = () => { img.src = "/imagenes/default.png"; };

      const titulo = document.createElement("span");
      titulo.className = "card-title tooltipped";
      titulo.setAttribute("data-tooltip", nombre);
      titulo.textContent = nombre;

      const descripcionElemento = document.createElement("p");
      descripcionElemento.className = "card-info truncate";
      descripcionElemento.innerHTML = `<i class="fas fa-align-left"></i> ${descripcion}`;

      const precioStock = document.createElement("p");
      precioStock.className = "card-info";
      precioStock.innerHTML = `<i class="fas fa-dollar-sign"></i> <strong>$${parseFloat(precio).toFixed(2)}</strong> | Stock: ${stock}`;

      const btn = document.createElement("button");
      btn.className = "btn btn-agregar waves-effect waves-light";
      btn.innerHTML = `<i class="fas fa-cart-plus"></i> Agregar`;
      btn.dataset.id = id;
      btn.dataset.nombre = nombre;
      btn.dataset.precio = precio;
      btn.dataset.imagen = imagen;

      // Ensamblar la tarjeta
      tarjeta.appendChild(img);
      tarjeta.appendChild(titulo);
      tarjeta.appendChild(descripcionElemento);
      tarjeta.appendChild(precioStock);
      tarjeta.appendChild(btn);
      contenedor.appendChild(tarjeta);
    });

    asignarEventosAgregar();
    M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    contenedor.innerHTML = `<p class="center-align red-text">No se pudieron cargar los productos.</p>`;
  }
}

/* ➕ Asigna eventos a los botones "Agregar" */
function asignarEventosAgregar() {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const { id, nombre, precio, imagen } = btn.dataset;
      const imagen_final = (imagen && imagen.trim()) ? imagen.trim() : "/imagenes/default.png";
      agregarAlCarrito(id, nombre, parseFloat(precio), imagen_final);
    });
  });
}

/* 🛒 Agrega productos al carrito (localStorage) */
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
  mostrarToast(`🛒 ${nombre} agregado al carrito`);
}

/* 🔢 Actualiza el contador del ícono de carrito */
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach(el => (el.textContent = total));
}

/* 🔔 Muestra un toast personalizado (MaterializeCSS) */
function mostrarToast(mensaje) {
  M.toast({
    html: `<i class="fas fa-check-circle left"></i> ${mensaje}`,
    classes: "rounded amber darken-2 white-text",
    displayLength: 3000
  });
}
