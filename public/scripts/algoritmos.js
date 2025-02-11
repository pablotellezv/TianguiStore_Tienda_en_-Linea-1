// Clase Producto
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

// Clase Carrito
class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem("carrito")) || [];
    }

    // Agregar producto al carrito y actualizar localStorage
    agregarProducto(producto) {
        this.productos.push(producto);
        this.guardarEnLocalStorage();
        this.actualizarContadorCarrito();
        this.mostrarToast(`${producto.nombre} agregado al carrito`);
    }

    // Eliminar producto por índice
    eliminarProducto(index) {
        this.productos.splice(index, 1);
        this.guardarEnLocalStorage();
        this.mostrarCarrito();
        this.mostrarToast("Producto eliminado del carrito");
    }

    // Guardar carrito en localStorage
    guardarEnLocalStorage() {
        localStorage.setItem("carrito", JSON.stringify(this.productos));
    }

    // Calcular el total del carrito
    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
    }

    // Actualizar el contador del carrito en la barra de navegación
    actualizarContadorCarrito() {
        const contadorCarrito = document.getElementById("contador-carrito");
        if (contadorCarrito) {
            contadorCarrito.textContent = this.productos.length;
        }
    }

    // Mostrar notificación tipo "toast"
    mostrarToast(mensaje) {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        // Crear un nuevo toast
        const toast = document.createElement("div");
        toast.classList.add("toast", "align-items-center", "text-white", "bg-success", "border-0", "show");
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        // Agregarlo al contenedor de toasts
        toastContainer.appendChild(toast);

        // Mostrar el toast por 3 segundos y eliminarlo
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Mostrar carrito en carrito.html
    mostrarCarrito() {
        const listaCarrito = document.getElementById("lista-carrito");
        const totalEtiqueta = document.getElementById("total_etiqueta");

        if (!listaCarrito || !totalEtiqueta) return;

        listaCarrito.innerHTML = "";

        if (this.productos.length === 0) {
            listaCarrito.innerHTML = "<li class='list-group-item text-center'>El carrito está vacío</li>";
            totalEtiqueta.textContent = "Total: $0.00";
            return;
        }

        this.productos.forEach((producto, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `
                <span>${producto.nombre} - $${producto.precio.toFixed(2)}</span>
                <button class="btn btn-outline-danger btn-sm eliminar-producto" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            listaCarrito.appendChild(li);
        });

        totalEtiqueta.textContent = `Total: $${this.calcularTotal()}`;
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.productos = [];
        this.guardarEnLocalStorage();
        this.mostrarCarrito();
        this.mostrarToast("Carrito vaciado");
    }
}

// Instanciar el carrito
const carrito = new Carrito();

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    carrito.actualizarContadorCarrito();
    carrito.mostrarCarrito();

    // Capturar botones de "Agregar al carrito" en index.html
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = parseFloat(boton.dataset.precio);

            if (nombre && !isNaN(precio)) {
                const producto = new Producto(nombre, precio);
                carrito.agregarProducto(producto);
            }
        });
    });

    // Capturar botón de "Vaciar carrito" en carrito.html
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", () => {
            carrito.vaciarCarrito();
        });
    }

    // Capturar botones de "Eliminar producto" en carrito.html
    const listaCarrito = document.getElementById("lista-carrito");
    if (listaCarrito) {
        listaCarrito.addEventListener("click", (event) => {
            if (event.target.closest(".eliminar-producto")) {
                const index = event.target.closest(".eliminar-producto").dataset.index;
                carrito.eliminarProducto(index);
            }
        });
    }
});
