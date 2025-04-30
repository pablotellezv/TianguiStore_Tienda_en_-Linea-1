document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");
  
    if (!usuario || !["admin", "soporte"].includes(usuario.rol)) {
      alert("Acceso no autorizado.");
      window.location.href = "/login.html";
      return;
    }
  
    document.getElementById("usuarioNombre").textContent = usuario.nombre || "Administrador";
  
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
  
  // Dashboard con KPIs
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
  
  // Tabla de Usuarios
  async function mostrarUsuarios(contenedor) {
    try {
      const res = await fetch("/api/usuarios");
      const usuarios = await res.json();
  
      let filas = usuarios.map(u => `
        <tr>
          <td>${u.usuario_id}</td>
          <td>${u.nombre}</td>
          <td>${u.correo_electronico}</td>
          <td>${u.rol}</td>
        </tr>
      `).join("");
  
      contenedor.innerHTML = `
        <h2>Usuarios</h2>
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      `;
    } catch (error) {
      contenedor.innerHTML = "<p>Error al cargar usuarios.</p>";
    }
  }
  
  // Tabla de Productos
  async function mostrarProductos(contenedor) {
    try {
      const res = await fetch("/api/productos");
      const productos = await res.json();
  
      let filas = productos.map(p => `
        <tr>
          <td>${p.producto_id}</td>
          <td>${p.nombre}</td>
          <td>$${p.precio.toFixed(2)}</td>
          <td>${p.stock}</td>
        </tr>
      `).join("");
  
      contenedor.innerHTML = `
        <h2>Productos</h2>
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      `;
    } catch (error) {
      contenedor.innerHTML = "<p>Error al cargar productos.</p>";
    }
  }
  
  // Tabla de Pedidos
  async function mostrarPedidos(contenedor) {
    try {
      const res = await fetch("/api/pedidos");
      const pedidos = await res.json();
  
      let filas = pedidos.map(p => `
        <tr>
          <td>${p.pedido_id}</td>
          <td>${p.usuario_nombre || 'Cliente'}</td>
          <td>${p.total}</td>
          <td>${new Date(p.fecha).toLocaleDateString()}</td>
          <td>${p.estado}</td>
        </tr>
      `).join("");
  
      contenedor.innerHTML = `
        <h2>Pedidos</h2>
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      `;
    } catch (error) {
      contenedor.innerHTML = "<p>Error al cargar pedidos.</p>";
    }
  }
  