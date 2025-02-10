//Clase Producto

class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

//Clase carrito

class Carrito {
  constructor() {
    this.productos = JSON.parse(localStorage.getItem("carrito")) || [];
  }

  //Funcion para agregar elementos al carrito
  agregarProducto(producto) {
    this.productos.push(producto);
    this.guardarEnLocalStorage();
    this.mostrarToast("${producto.nombre} agregado al carrito");
    console.log("Se ha agregado al carrito" + this.productos);
  }
  eliminarProducto(index) {
    this.productos.splice(index, 1);
    this.guardarEnLocalStorage();
    this.mostrarToast("Producto eliminado");
    this.mostrarCarrito();
    console.log("Se ha eliminado " + this.productos);
  }
  //Guardar carrito en localStorage
  guardarEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(this.productos));
    console.log("Se ha guardado el carrito ");
  }
  //Calcular el total de la compra
  calcularTotal() {
    return;
    this.productos.reduce((total, producto) => total + producto.precio, 0);
  }
  mostrarCarrito() {
    const lista = document.getElementById("carrito-lista");
    if (!lista) return;
    lista.innerHTML = "";

    this.productos.foreach((producto, index) => {
      const li = document.createElement("li");
      li.innerHTML =
        '${producto.nombre} - $${producto.precio} <button class="remove" data-index="${index}">Remover</button>';
      lista.appendChild(li);
    });

    document.getElementById("total_etiqueta").textContent = this.calcularTotal;
    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        this.eliminarProducto(index);
      });
    });
    console.log("Se muestra carrito ");
  }
  vaciarCarrito() {
    this.productos = [];
    this.guardarEnLocalStorage();
    this.mostrarToast("Carrito vaciado");
    this.mostrarCarrito();
    console.log("Se ha vaciado el carro ");
  }

  //Funcion de mostrar toast
  mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensaje;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
    console.log("Se muestra el toast");
  }
}
//Instanciar el carrito
//const Carrito = new Carrito();
Carrito.mostrarCarrito();

//Agregar eventos a los botones de productos
document.querySelectorAll(".producto").forEach((boton) => {
  boton.addEventListener("click", () => {
    const producto = new Producto(
      boton.dataset.nombre,
      parseFloat(boton.dataset.precio)
    );
    Carrito.agregarProducto(producto);
    console.log("Se ha agregado a carrito" + producto);
  });
});

const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
if (vaciarCarritoBtn) {
  vaciarCarritoBtn.addEventListener("click", () => {
    Carrito.vaciarCarrito();
  });
}
