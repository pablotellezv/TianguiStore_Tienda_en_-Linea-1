document.addEventListener("DOMContentLoaded", async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  if (!usuario || !usuario.rol || !usuario.permisos || !token) {
    alert("Acceso no autorizado.");
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("usuarioNombre").textContent =
    usuario.nombre || "Administrador";
  mostrarSeccion("dashboard");
});

function cerrarSesion() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

async function mostrarSeccion(seccion) {
  const contenedor = document.getElementById("seccion-principal");
  contenedor.innerHTML = "<p>Cargando...</p>";
  const permisos = JSON.parse(localStorage.getItem("usuario"))?.permisos || {};

  const permitido = {
    dashboard: true,
    usuarios: permisos.usuarios?.leer,
    productos: permisos.productos?.leer,
    pedidos: permisos.pedidos?.leer,
  };

  if (!permitido[seccion]) {
    contenedor.innerHTML =
      "<p class='text-warning'>⚠️ No tienes permiso para acceder a esta sección.</p>";
    return;
  }

  switch (seccion) {
    case "dashboard":
      return await mostrarDashboard(contenedor);
    case "usuarios":
      return await mostrarUsuarios(contenedor);
    case "productos":
      return await mostrarProductos(contenedor);
    case "pedidos":
      return await mostrarPedidos(contenedor);
    default:
      contenedor.innerHTML = "<p>Sección no encontrada.</p>";
  }
}

async function mostrarConfiguracion(contenedor) {
  const permisos =
    JSON.parse(localStorage.getItem("usuario"))?.permisos?.configuracion || {};
  if (!permisos.leer) {
    contenedor.innerHTML =
      "<p class='text-warning'>⚠️ No tienes permiso para acceder a la configuración.</p>";
    return;
  }

  try {
    const res = await fetch("/api/configuracion", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const configuraciones = await res.json();

    const filas = configuraciones
      .map(
        (c) => `
      <tr>
        <td>${c.clave}</td>
        <td>${c.tipo_dato}</td>
        <td>${c.descripcion}</td>
        <td><code>${truncateJson(c.valor_json)}</code></td>
        <td class="text-end">
          ${
            permisos.modificar && c.modificable
              ? `<button class="btn btn-sm btn-warning" onclick="editarConfiguracion('${c.clave}')">Editar</button>`
              : `<span class="text-muted">🔒</span>`
          }
        </td>
      </tr>
    `
      )
      .join("");

    contenedor.innerHTML = `
      <h2>Configuración Global</h2>
      <table class="table table-dark table-striped">
        <thead><tr><th>Clave</th><th>Tipo</th><th>Descripción</th><th>Valor</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch {
    contenedor.innerHTML =
      "<p class='text-danger'>Error al cargar configuraciones.</p>";
  }
}

function truncateJson(jsonString) {
  try {
    const val = JSON.parse(jsonString);
    return JSON.stringify(val).substring(0, 60) + "...";
  } catch {
    return jsonString;
  }
}

async function editarConfiguracion(clave) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/configuracion/${clave}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const config = await res.json();

    // Set título, descripción, clave
    document.getElementById("configClave").value = config.clave;
    document.getElementById("configLabel").textContent = config.clave;
    document.getElementById("configDescripcion").textContent =
      config.descripcion;

    // Render input dinámico
    const campo = document.getElementById("configCampoDinamico");
    const valor = JSON.parse(config.valor_json);
    campo.innerHTML = "";

    switch (config.tipo_dato) {
      case "texto":
        campo.innerHTML = `<input class="form-control" id="configInput" type="text" value="${valor}" required>`;
        break;
      case "numero":
        campo.innerHTML = `<input class="form-control" id="configInput" type="number" value="${valor}" required>`;
        break;
      case "booleano":
        campo.innerHTML = `
          <select class="form-select" id="configInput">
            <option value="true" ${
              valor === true ? "selected" : ""
            }>Activo</option>
            <option value="false" ${
              valor === false ? "selected" : ""
            }>Inactivo</option>
          </select>`;
        break;
      default:
        campo.innerHTML = `<textarea class="form-control" id="configInput" rows="5">${JSON.stringify(
          valor,
          null,
          2
        )}</textarea>`;
    }

    new bootstrap.Modal(document.getElementById("modalEditarConfig")).show();
  } catch {
    alert("❌ Error al cargar configuración.");
  }
}

document
  .getElementById("formEditarConfig")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const clave = document.getElementById("configClave").value;
    const tipo = document.getElementById("configLabel").textContent;
    const rawInput = document.getElementById("configInput").value;

    let valor_json;

    try {
      if (tipo === "booleano") {
        valor_json = rawInput === "true";
      } else if (tipo === "numero") {
        valor_json = parseFloat(rawInput);
        if (isNaN(valor_json)) throw "No es número";
      } else if (tipo === "texto") {
        valor_json = rawInput;
      } else {
        valor_json = JSON.parse(rawInput); // json o lista
      }
    } catch {
      return alert(
        "⚠️ El valor ingresado no es válido para este tipo de configuración."
      );
    }

    try {
      const res = await fetch(`/api/configuracion/${clave}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ valor_json }),
      });

      if (!res.ok) throw new Error();
      alert("✅ Configuración actualizada.");
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarConfig")
      ).hide();
      mostrarSeccion("configuracion");
    } catch {
      alert("❌ Error al guardar cambios.");
    }
  });

async function mostrarDashboard(contenedor) {
  try {
    const res = await fetch("/api/estadisticas");
    const stats = await res.json();

    contenedor.innerHTML = `
      <h2>Dashboard</h2>
      <div class="row text-center">
        <div class="col-md-4">
          <div class="card bg-primary text-white mb-3 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Usuarios</h5>
              <p class="display-6">${stats.usuarios}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-success text-white mb-3 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Productos</h5>
              <p class="display-6">${stats.productos}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-warning text-dark mb-3 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">Pedidos</h5>
              <p class="display-6">${stats.pedidos}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar estadísticas.</p>";
  }
}

function generarBotonesAccion(permisos = {}, config = {}) {
  const botones = [];

  if (permisos.modificar && config.editar) {
    botones.push(
      `<button class="btn btn-sm btn-warning me-1" onclick="${config.editar}">Editar</button>`
    );
  }

  if (permisos.eliminar && config.eliminar) {
    botones.push(
      `<button class="btn btn-sm btn-danger" onclick="${config.eliminar}">Eliminar</button>`
    );
  }

  if (permisos.cancelar && config.cancelar) {
    botones.push(
      `<button class="btn btn-sm btn-outline-warning" onclick="${config.cancelar}">Cancelar</button>`
    );
  }

  if (permisos.entregar && config.entregar) {
    botones.push(
      `<button class="btn btn-sm btn-success" onclick="${config.entregar}">Entregar</button>`
    );
  }

  return botones.length ? `<td>${botones.join(" ")}</td>` : "";
}

async function mostrarUsuarios(contenedor) {
  const permisos =
    JSON.parse(localStorage.getItem("usuario"))?.permisos?.usuarios || {};

  try {
    const res = await fetch("/api/usuarios");
    const usuarios = await res.json();

    const filas = usuarios
      .map(
        (u) => `
      <tr>
        <td>${u.usuario_id}</td>
        <td>${u.nombre}</td>
        <td>${u.correo_electronico}</td>
        <td>${u.rol}</td>
        ${generarBotonesAccion(permisos, {
          editar: `editarUsuario(${u.usuario_id})`,
          eliminar: `eliminarUsuario(${u.usuario_id})`,
        })}
      </tr>
    `
      )
      .join("");

    contenedor.innerHTML = `
      <h2>Usuarios</h2>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th>
            ${
              permisos.modificar || permisos.eliminar ? "<th>Acciones</th>" : ""
            }
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar usuarios.</p>";
  }
}

async function mostrarProductos(contenedor) {
  const permisos =
    JSON.parse(localStorage.getItem("usuario"))?.permisos?.productos || {};

  try {
    const res = await fetch("/api/productos");
    const productos = await res.json();

    const filas = productos
      .map(
        (p) => `
      <tr>
        <td>${p.producto_id}</td>
        <td>${p.nombre}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.stock}</td>
        ${generarBotonesAccion(permisos, {
          editar: `editarProducto(${p.producto_id})`,
          eliminar: `eliminarProducto(${p.producto_id})`,
        })}
      </tr>
    `
      )
      .join("");

    contenedor.innerHTML = `
      <h2>Productos</h2>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th>
            ${
              permisos.modificar || permisos.eliminar ? "<th>Acciones</th>" : ""
            }
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

async function mostrarPedidos(contenedor) {
  const permisos =
    JSON.parse(localStorage.getItem("usuario"))?.permisos?.pedidos || {};

  try {
    const res = await fetch("/api/pedidos");
    const pedidos = await res.json();

    const filas = pedidos
      .map(
        (p) => `
      <tr>
        <td>${p.pedido_id}</td>
        <td>${p.usuario_nombre || "Cliente"}</td>
        <td>$${p.total}</td>
        <td>${new Date(p.fecha).toLocaleDateString()}</td>
        <td>${p.estado}</td>
        ${generarBotonesAccion(permisos, {
          cancelar: `cancelarPedido(${p.pedido_id})`,
          entregar: `entregarPedido(${p.pedido_id})`,
        })}
      </tr>
    `
      )
      .join("");

    contenedor.innerHTML = `
      <h2>Pedidos</h2>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Estado</th>
            ${permisos.cancelar || permisos.entregar ? "<th>Acciones</th>" : ""}
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    `;
  } catch (error) {
    contenedor.innerHTML = "<p>Error al cargar pedidos.</p>";
  }
}

// Funciones simuladas para pruebas (reemplaza luego con lógica real)
function editarUsuario(id) {
  alert(`Editar usuario ID ${id}`);
}

function eliminarUsuario(id, nombre = "") {
  mostrarModalConfirmacion({
    titulo: "Eliminar usuario",
    mensaje: `<strong>¿Eliminar al usuario "${nombre}" (ID ${id})?</strong><br>Esta acción no se puede deshacer.`,
    onConfirmar: async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/usuarios/${id}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Error al eliminar usuario.");
        alert("✅ Usuario eliminado correctamente.");
        mostrarSeccion("usuarios");
      } catch (err) {
        alert("❌ No se pudo eliminar el usuario.");
      }
    },
  });
}

// 🧠 Cargar producto y mostrar modal
function editarProducto(id) {
  const token = localStorage.getItem("token");

  fetch(`/api/productos/${id}`, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then((producto) => {
      // Cargar datos al formulario...
      document.getElementById("editProductoId").value = producto.producto_id;
      document.getElementById("editNombre").value = producto.nombre || "";
      document.getElementById("editPrecio").value = producto.precio || 0;
      document.getElementById("editDescuento").value = producto.descuento || 0;
      document.getElementById("editStock").value = producto.stock || 0;
      document.getElementById("editDescripcion").value =
        producto.descripcion || "";
      document.getElementById("editPublicado").checked = !!producto.publicado;
      document.getElementById("editMSI").checked =
        !!producto.meses_sin_intereses;
      document.getElementById("editTipoPago").value =
        producto.tipo_pago || "efectivo";
      document.getElementById("editStatus").value = producto.status || "activo";
      document.getElementById("editCategoria").value =
        producto.categoria_id || "";
      document.getElementById("editMarca").value = producto.marca_id || "";

      // Cargar formas de pago
      return fetch(`/api/productos/${id}/formas-pago`, {
        headers: { Authorization: "Bearer " + token },
      });
    })
    .then((res) => res.json())
    .then((tipos) => {
      ["efectivo", "crédito", "débito", "transferencia"].forEach((tipo) => {
        document.getElementById(`pago_${tipo}`).checked = tipos.includes(tipo);
      });

      const modal = new bootstrap.Modal(
        document.getElementById("modalEditarProducto")
      );
      modal.show();
    })
    .catch(() => alert("❌ Error al cargar el producto."));
}

// ✅ Manejador de envío del formulario de edición
document
  .getElementById("formEditarProducto")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editProductoId").value;
    const token = localStorage.getItem("token");

    const datos = {
      nombre: document.getElementById("editNombre").value.trim(),
      precio: parseFloat(document.getElementById("editPrecio").value),
      descuento: parseFloat(document.getElementById("editDescuento").value),
      stock: parseInt(document.getElementById("editStock").value),
      descripcion: document.getElementById("editDescripcion").value.trim(),
      categoria_id: parseInt(document.getElementById("editCategoria").value),
      marca_id: parseInt(document.getElementById("editMarca").value),
      status: document.getElementById("editStatus").value,
      publicado: document.getElementById("editPublicado").checked,
      meses_sin_intereses: document.getElementById("editMSI").checked,
    };

    const tipos_pago = [];
    ["efectivo", "crédito", "débito", "transferencia"].forEach((tipo) => {
      if (document.getElementById(`pago_${tipo}`).checked)
        tipos_pago.push(tipo);
    });

    try {
      // Actualizar producto principal
      const res = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) throw new Error();

      // Actualizar formas de pago
      const pagoRes = await fetch(`/api/productos/${id}/formas-pago`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ tipos_pago }),
      });

      if (!pagoRes.ok) throw new Error();

      alert("✅ Producto actualizado.");
      bootstrap.Modal.getInstance(
        document.getElementById("modalEditarProducto")
      ).hide();
      mostrarSeccion("productos");
    } catch {
      alert("❌ Error al guardar cambios.");
    }
  });

function eliminarProducto(id, nombre = "") {
  mostrarModalConfirmacion({
    titulo: "Eliminar producto",
    mensaje: `<strong>¿Eliminar el producto "${nombre}" (ID ${id})?</strong><br>Esto lo removerá del catálogo.`,
    onConfirmar: async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/productos/${id}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Error al eliminar producto.");
        alert("✅ Producto eliminado.");
        mostrarSeccion("productos");
      } catch (err) {
        alert("❌ Error al eliminar producto.");
      }
    },
  });
}

function cancelarPedido(id, cliente = "Cliente", total = "") {
  mostrarModalConfirmacion({
    titulo: "Cancelar pedido",
    mensaje: `<strong>¿Cancelar el pedido #${id}?</strong><br>Cliente: ${cliente}<br>Total: $${parseFloat(
      total
    ).toFixed(2)}`,
    onConfirmar: async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/pedidos/${id}/cancelar`, {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error("Error al cancelar pedido.");
        alert("✅ Pedido cancelado.");
        mostrarSeccion("pedidos");
      } catch {
        alert("❌ No se pudo cancelar el pedido.");
      }
    },
  });
}

function entregarPedido(id, cliente = "Cliente", total = "") {
  mostrarModalConfirmacion({
    titulo: "Confirmar entrega",
    mensaje: `<strong>¿Marcar el pedido #${id} como entregado?</strong><br>Cliente: ${cliente}<br>Total: $${parseFloat(
      total
    ).toFixed(2)}`,
    onConfirmar: async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/pedidos/${id}/entregar`, {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        });

        if (!res.ok) throw new Error();
        alert("✅ Pedido marcado como entregado.");
        mostrarSeccion("pedidos");
      } catch {
        alert("❌ No se pudo actualizar el estado del pedido.");
      }
    },
  });
}

let modalConfirmacionCallback = null;

function mostrarModalConfirmacion({ titulo, mensaje, onConfirmar }) {
  const tituloElem = document.getElementById("modalConfirmacionTitulo");
  const mensajeElem = document.getElementById("modalConfirmacionMensaje");
  const confirmarBtn = document.getElementById("modalConfirmarBtn");

  tituloElem.textContent = titulo;
  mensajeElem.innerHTML = mensaje;

  confirmarBtn.onclick = () => {}; // limpiar
  modalConfirmacionCallback = () => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalConfirmacion")
    );
    modal.hide();
    onConfirmar();
  };
  confirmarBtn.onclick = modalConfirmacionCallback;

  const modal = new bootstrap.Modal(
    document.getElementById("modalConfirmacion")
  );
  modal.show();
}
