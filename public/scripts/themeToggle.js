// 📁 scripts/themeToggle.js

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleThemeBtn");
    const root = document.documentElement;
    const temaGuardado = localStorage.getItem("tema");
  
    // 🌗 Establecer tema inicial desde localStorage
    if (temaGuardado === "claro") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  
    // 🌞🌙 Icono y toggle
    if (toggleBtn) {
      actualizarIcono();
  
      toggleBtn.addEventListener("click", () => {
        const modoOscuroActivo = root.classList.contains("dark");
        root.classList.toggle("dark");
        localStorage.setItem("tema", modoOscuroActivo ? "claro" : "oscuro");
        actualizarIcono();
      });
    }
  
    // 🔁 Actualiza el ícono del botón
    function actualizarIcono() {
      if (!toggleBtn) return;
      toggleBtn.innerHTML = root.classList.contains("dark")
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
  });
  