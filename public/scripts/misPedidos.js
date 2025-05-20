/**
 * 📦 misPedidos.js
 * Muestra los pedidos del usuario autenticado en TianguiStore.
 * Autor: I.S.C. Erick Renato Vega Ceron — Mayo 2025
 */

document.addEventListener("DOMContentLoaded", () => {
  cargarPedidosUsuario();
});

const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");

/**
 * 🛒 Cargar los pedidos del usuario autenticado
 */
async function cargarPedidosUsuario() {
  const tabla = document.getElementById("tabla-pedidos");
  if (!tabla) return;

  try {
    const response = await fetch(`${BASE_URL}/api/mis-pedidos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("No se pudieron obtener los pedidos.");

    const pedidos = await response.json();

    if (pedidos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="6" class="center-align grey-text text-lighten-1">🛒 No tienes pedidos aún.</td></tr>`;
      return;
    }

    for (const pedido of pedidos) {
      const puedeCancelar = [1, 2].includes(pedido.estado_id);
      const filaHTML = `
        <tr>
          <td>#${pedido.pedido_id}</td>
          <td>${new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
          <td>${pedido.estado_nombre}</td>
          <td>$${parseFloat(pedido.total).toFixed(2)}</td>
          <td>
            <button class="btn btn-small amber darken-2 modal-trigger" data-pedido="${pedido.pedido_id}" data-target="modalDetalleProductos">
              <i class="fas fa-eye"></i>
            </button>
          </td>
          <td>
            ${puedeCancelar
              ? `<button class="btn red darken-1 btn-small" onclick="cancelarPedido(${pedido.pedido_id})">
                  <i class="fas fa-times-circle"></i>
                </button>`
              : `<span class="grey-text text-lighten-1">No cancelable</span>`
            }
          </td>
        </tr>`;
      tabla.insertAdjacentHTML("beforeend", filaHTML);
    }

    inicializarModalEventos();
  } catch (error) {
    console.error("❌ Error al cargar pedidos:", error);
    tabla.innerHTML = `<tr><td colspan="6" class="center-align red-text">Error al cargar tus pedidos.</td></tr>`;
  }
}

/**
 * 📦 Obtener productos del pedido y mostrarlos en el modal
 */
async function obtenerProductosDelPedido(pedidoId) {
  const contenedor = document.getElementById("detalle-productos-contenido");
  contenedor.innerHTML = `<p class="grey-text text-lighten-2">Cargando...</p>`;

  try {
    const response = await fetch(`${BASE_URL}/api/pedidos/${pedidoId}/productos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("No se pudieron obtener los productos.");

    const productos = await response.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      contenedor.innerHTML = `<p class="grey-text">Este pedido no tiene productos registrados.</p>`;
      return;
    }

    contenedor.innerHTML = productos.map(p => `
      <div class="col s12 m6">
        <div class="card-panel grey darken-3 white-text z-depth-1">
          <span class="fw-bold">${p.nombre}</span>
          <p>Cantidad: <strong>${p.cantidad}</strong></p>
          <p>Precio unitario: $${parseFloat(p.precio_unitario).toFixed(2)}</p>
        </div>
      </div>
    `).join("");
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    contenedor.innerHTML = `<p class="red-text">Error al cargar productos del pedido.</p>`;
  }
}

/**
 * 🧩 Inicializa eventos para abrir modales de productos
 */
function inicializarModalEventos() {
  const botones = document.querySelectorAll(".modal-trigger");
  const modales = M.Modal.init(document.querySelectorAll(".modal"));

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const pedidoId = btn.getAttribute("data-pedido");
      obtenerProductosDelPedido(pedidoId);
    });
  });
}

/**
 * ❌ Cancelar un pedido si su estado lo permite
 */
async function cancelarPedido(pedidoId) {
  const confirmar = confirm("¿Deseas cancelar este pedido?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${BASE_URL}/api/pedidos/${pedidoId}/cancelar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      M.toast({ html: "✅ Pedido cancelado.", classes: "teal darken-2" });
      setTimeout(() => location.reload(), 1000);
    } else {
      M.toast({ html: `❌ ${data.mensaje}`, classes: "red darken-2" });
    }
  } catch (error) {
    console.error("❌ Error al cancelar pedido:", error);
    M.toast({ html: "❌ No se pudo cancelar el pedido.", classes: "red darken-3" });
  }
}
