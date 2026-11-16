/**
 * TOKI — Lógica de interfaz (tokite.com.ar)
 * Controla:
 * 1. Ventana modal de "Envíos y pedidos"
 * 2. Menú de navegación móvil (hamburguesa)
 * 3. Año dinámico en el pie de página
 */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================================================
    // 1. VENTANA MODAL DE ENVÍOS Y PEDIDOS
    // =========================================================================
    const orderInfoDialog = document.getElementById("orderInfoDialog");
    const closeOrderInfo = document.getElementById("closeOrderInfo");
    const orderInfoLinks = [
        document.getElementById("orderInfoLink"),     // Enlace en el footer
        document.getElementById("orderInfoNavLink")   // Enlace en el header
    ].filter(Boolean);

    if (orderInfoDialog && closeOrderInfo) {
        // Abre el modal al hacer clic en cualquiera de los enlaces de "Envíos y pedidos"
        orderInfoLinks.forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                orderInfoDialog.showModal();
                closeOrderInfo.focus();
            });
        });

        // Cierra el modal al pulsar el botón "×"
        closeOrderInfo.addEventListener("click", () => {
            orderInfoDialog.close();
        });

        // Cierra el modal al hacer clic fuera de la caja (sobre el fondo oscuro)
        orderInfoDialog.addEventListener("click", event => {
            if (event.target === orderInfoDialog) {
                orderInfoDialog.close();
            }
        });
    }

    // =========================================================================
    // 2. MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGUESA)
    // =========================================================================
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {
        // Alterna la apertura y cierre del menú en pantallas chicas
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        });

        // Cierra automáticamente el menú al seleccionar una sección
        mainNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menú");
            });
        });
    }

    // =========================================================================
    // 3. AÑO DINÁMICO EN EL PIE DE PÁGINA
    // =========================================================================
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }

});