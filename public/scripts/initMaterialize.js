/**
 * 🎯 Inicializa todos los componentes de Materialize al cargar el DOM
 * Compatible con CSP segura (sin scripts inline)
 */
document.addEventListener("DOMContentLoaded", () => {
    const sidenavs = document.querySelectorAll(".sidenav");
    const tooltips = document.querySelectorAll(".tooltipped");
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
  
    M.Sidenav.init(sidenavs);
    M.Tooltip.init(tooltips);
    M.Dropdown.init(dropdowns, {
      constrainWidth: false,
      alignment: "right",
      coverTrigger: false
    });
  });
  