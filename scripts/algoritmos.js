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
        this.mostrarToast('${producto.nombre} agregado al carrito');
    }
    eliminarProducto(index){
        this.productos.splice(index,1);
        this.guardarEnLocalStorage();
        this.mostrarToast("Producto eliminado");
        this.mostrarCarrito();
    }
    //Guardar carrito en localStorage
    guardarEnLocalStorage(){
        localStorage.setItem("carrito",JSON.stringify(this.productos));
    }
    //Calcular el total de la compra
    calcularTotal(){
        return
        this.productos.reduce((total,producto)=> total + producto.precio,0);
    }
    mostrarCarrito(){
        const lista = document.getElementById("carrito-lista");
        if(!lista)
            return;
        lista.innerHTML="";

        this.productos.foreach((producto,index) => {
            const li = document.createElement("li");
            li.innerHTML= '${producto.nombre} - $${producto.precio} <button class="remove" data-index="${index}">Remover</button>';
            lista.appendChild(li); });
    }

    
}

