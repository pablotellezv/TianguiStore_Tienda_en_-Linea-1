// 📁 scripts/togglePassword.js

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const icon = toggleBtn?.querySelector("i");

  if (!toggleBtn || !passwordInput || !icon) return;

  const togglePasswordVisibility = () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    icon.classList.toggle("fa-eye", isHidden);
    icon.classList.toggle("fa-eye-slash", !isHidden);
    toggleBtn.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
    toggleBtn.setAttribute("aria-pressed", String(!isHidden));
  };

  toggleBtn.addEventListener("click", togglePasswordVisibility);

  // ♿ Activar con teclado
  toggleBtn.addEventListener("keydown", (e) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      togglePasswordVisibility();
    }
  });

  toggleBtn.setAttribute("role", "button");
  toggleBtn.setAttribute("tabindex", "0");
  toggleBtn.setAttribute("aria-pressed", "false");
});
