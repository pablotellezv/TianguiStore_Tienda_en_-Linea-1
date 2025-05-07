// 📦 carrito-verificacion.js

const token = localStorage.getItem("token");

// 🔐 Obtener carrito del backend usando el JWT
async function obtenerCarritoDesdeAPI() {
  const res = await fetch("/carrito", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("No se pudo obtener el carrito desde la API");
  return await res.json();
}

// ✅ Verificar stock de productos antes de crear pedido
async function verificarStockAntesDeEnviar(carrito) {
  const errores = [];

  for (const item of carrito) {
    try {
      const res = await fetch(`/productos/${item.producto_id}`);
      if (!res.ok) throw new Error("No se pudo obtener producto");

      const producto = await res.json();

      if (item.cantidad > producto.stock) {
        errores.push(`⚠️ El producto "${producto.nombre}" solo tiene ${producto.stock} unidades disponibles.`);
      }
    } catch (err) {
      errores.push(`❌ Error al verificar el producto con ID ${item.producto_id}`);
    }
  }

  return errores;
}

// 🛒 Crear pedido desde carrito si stock es suficiente
async function realizarPedidoDesdeCarrito() {
  try {
    const carrito = await obtenerCarritoDesdeAPI();
    const errores = await verificarStockAntesDeEnviar(carrito);

    if (errores.length > 0) {
      alert("❌ No se puede procesar el pedido:\n\n" + errores.join("\n"));
      return;
    }

    const res = await fetch("/pedidos/desde-carrito", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const datos = await res.json();

    if (res.ok) {
      alert("✅ Pedido generado con éxito");
      window.location.reload();
    } else {
      alert("❌ Error al generar el pedido:\n" + (datos?.mensaje || "Error desconocido."));
    }

  } catch (err) {
    console.error("❌ Error crítico al procesar el pedido:", err);
    alert("⚠️ Error inesperado al intentar procesar el pedido.");
  }
}

// 🧩 Asociar botón al evento
document.addEventListener("DOMContentLoaded", () => {
  const btnPedido = document.getElementById("btnRealizarPedido");
  if (btnPedido) {
    btnPedido.addEventListener("click", realizarPedidoDesdeCarrito);
  }
});
