// 📦 admin/pedidos.js
document.addEventListener("DOMContentLoaded", () => {
  M.AutoInit();
  M.Modal.init(document.querySelectorAll(".modal"));
  cargarPedidos(); // primera carga

  document.getElementById("btn-filtrar").addEventListener("click", () => {
    cargarPedidos(1); // aplica filtros desde página 1
  });
});

let paginaActual = 1;
const pedidosPorPagina = 30;
async function cargarPedidos(pagina = 1) {
  const tabla = document.getElementById("tabla-pedidos");
  const paginacion = document.getElementById("paginacion-pedidos");
  const token = localStorage.getItem("token");

  tabla.innerHTML = `<tr><td colspan="6">Cargando pedidos...</td></tr>`;
  paginacion.innerHTML = "";

  const fechaInicio = document.getElementById("fecha-inicio").value;
  const fechaFin = document.getElementById("fecha-fin").value;
  const estado = document.getElementById("estado-filtro").value;

  const params = new URLSearchParams({
    page: pagina,
    limite: pedidosPorPagina,
  });
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  if (estado) params.append("estado", estado);

  try {
    const res = await fetch(`/pedidos/admin/listado?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      M.toast({
        html: "⚠️ Sesión expirada. Por favor inicia sesión nuevamente.",
        classes: "red darken-3",
      });
      setTimeout(() => (window.location.href = "/login.html"), 1500);
      return;
    }

    if (!res.ok) throw new Error("Error al obtener pedidos");

    const { pedidos, totalPaginas, paginaActual: actual } = await res.json();
    paginaActual = actual;

    if (!pedidos.length) {
      tabla.innerHTML = `<tr><td colspan="6">No hay pedidos que coincidan con los filtros.</td></tr>`;
      return;
    }

    tabla.innerHTML = pedidos
      .map(
        (p) => `
      <tr>
        <td>${p.pedido_id}</td>
        <td>${p.cliente}</td>
        <td>${new Date(p.fecha).toLocaleString()}</td>
        <td>$${p.total.toFixed(2)}</td>
        <td><span class="new badge ${colorEstado(p.estado)}" data-badge-caption="${p.estado}"></span></td>
        <td>
          <a href="#" onclick="verDetalle(${p.pedido_id})" title="Ver detalle">
            <i class="material-icons amber-text">visibility</i>
          </a>
        </td>
      </tr>
    `
      )
      .join("");

    generarPaginacion(totalPaginas, paginaActual);
  } catch (err) {
    tabla.innerHTML = `<tr><td colspan="6">Error: ${err.message}</td></tr>`;
  }
}

function generarPaginacion(total, actual) {
  const paginacion = document.getElementById("paginacion-pedidos");
  for (let i = 1; i <= total; i++) {
    const li = document.createElement("li");
    li.className = i === actual ? "active amber darken-2" : "waves-effect";
    li.innerHTML = `<a href="#!" onclick="cargarPedidos(${i})">${i}</a>`;
    paginacion.appendChild(li);
  }
}

function colorEstado(estado) {
  switch (estado.toLowerCase()) {
    case "pagado":
      return "green";
    case "enviado":
      return "blue";
    case "pendiente":
      return "orange";
    case "cancelado":
      return "red";
    default:
      return "grey";
  }
}

function verDetalle(id) {
  M.toast({ html: `🔎 Ver detalle aún no implementado (ID ${id})` });
  // En el futuro: abrir modal o redirigir a detalle.html?id=...
}

async function verDetalle(pedido_id) {
  const modal = M.Modal.getInstance(
    document.getElementById("modal-detalle-pedido")
  );
  const token = localStorage.getItem("token");

  document.getElementById("detalle-id").textContent = pedido_id;
  document.getElementById("detalle-productos").innerHTML =
    "<li class='collection-item'>Cargando productos...</li>";

  try {
    const res = await fetch(`/pedidos/${pedido_id}/productos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      M.toast({
        html: "⚠️ Sesión expirada. Por favor inicia sesión nuevamente.",
        classes: "red darken-3",
      });
      setTimeout(() => (window.location.href = "/login.html"), 1500);
      return;
    }

    if (!res.ok) throw new Error("No autorizado o error al obtener productos");

    const productos = await res.json();

    if (!productos || productos.length === 0) {
      document.getElementById("detalle-productos").innerHTML =
        "<li class='collection-item'>Sin productos.</li>";
    } else {
      const items = productos
        .map(
          (p) => `
        <li class="collection-item">
          <span class="title"><strong>${p.nombre}</strong></span>
          <br>
          Cantidad: ${p.cantidad}, Precio unitario: $${p.precio_unitario.toFixed(2)}, 
          Subtotal: $${(p.cantidad * p.precio_unitario).toFixed(2)}
        </li>
      `
        )
        .join("");
      document.getElementById("detalle-productos").innerHTML = items;
    }

    modal.open();
  } catch (err) {
    document.getElementById("detalle-productos").innerHTML =
      `<li class='collection-item red-text'>${err.message}</li>`;
  }
}
