document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "toki_cart";
    const SHIPPING_FEE = 4500;
    const FREE_SHIPPING_FROM = 60000;
    const WHATSAPP_NUMBER = "5491164622407";
    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });
    const cartCount = document.getElementById("cartCount");
    const cartDrawer = document.getElementById("cartDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotalDisplay = document.getElementById("cartTotalDisplay");
    const shippingDisplay = document.getElementById("shippingDisplay");
    const shippingMessage = document.getElementById("shippingMessage");
    const cartAnnouncement = document.getElementById("cartAnnouncement");
    const openCartBtn = document.getElementById("openCartBtn");
    const closeDrawerBtn = document.getElementById("closeDrawerBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    let lastFocusedElement = null;

    const readCart = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(saved)) {
                throw new TypeError("El contenido guardado no es una lista.");
            }
            return saved.filter(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.name === "string" &&
                typeof item.format === "string" &&
                Number.isSafeInteger(item.price) &&
                item.price > 0 &&
                Number.isSafeInteger(item.qty) &&
                item.qty > 0
            );
        } catch (error) {
            console.warn("No se pudo recuperar la cesta TOKI guardada.", error);
            return [];
        }
    };

    let cart = readCart();

    const saveCart = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.warn("No se pudo guardar la cesta TOKI en este navegador.", error);
            cartAnnouncement.textContent = "No pudimos guardar tu cesta en este navegador. Podés continuar con tu pedido abierto.";
        }
        renderCart();
    };

    const getSubtotal = () => cart.reduce((total, item) => total + item.price * item.qty, 0);
    
    const openDrawer = () => {
        lastFocusedElement = document.activeElement;
        cartDrawer.classList.add("active");
        drawerOverlay.classList.add("active");
        cartDrawer.setAttribute("aria-hidden", "false");
        document.body.classList.add("drawer-open");
        closeDrawerBtn.focus();
    };

    const closeDrawer = () => {
        cartDrawer.classList.remove("active");
        drawerOverlay.classList.remove("active");
        cartDrawer.setAttribute("aria-hidden", "true");
        document.body.classList.remove("drawer-open");
        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    };

    openCartBtn.addEventListener("click", openDrawer);
    closeDrawerBtn.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);

    document.querySelectorAll(".add-button").forEach(button => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");
            const formatSelect = card.querySelector(".format-select");
            const selectedFormat = formatSelect.value;
            const prices = button.dataset.prices.split(",").map(Number);
            const formatIndex = selectedFormat === "recarga" ? 1 : 0;
            const price = prices[formatIndex];
            const productName = button.dataset.name;
            const formatName = formatSelect.options[formatSelect.selectedIndex].text.split(" — ")[0];
            const id = `${button.dataset.id}-${selectedFormat}`;
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name: productName, format: formatName, price, qty: 1 });
            }

            saveCart();
            cartAnnouncement.textContent = `${productName}, ${formatName}, agregado a la cesta.`;
            openDrawer();
        });
    });

    cartItemsContainer.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        const item = cart[index];
        if (!item) return;

        if (button.dataset.action === "increase") {
            item.qty += 1;
        } else if (button.dataset.action === "decrease") {
            item.qty -= 1;
            if (item.qty === 0) cart.splice(index, 1);
        } else if (button.dataset.action === "remove") {
            cart.splice(index, 1);
        }

        saveCart();
    });

        document.addEventListener("keydown", event => {
        if (event.key === "Escape" && cartDrawer.classList.contains("active")) {
            closeDrawer();
        }

        if (event.key === "Tab" && cartDrawer.classList.contains("active")) {
            const focusable = [...cartDrawer.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]")];
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
        });
    });

    document.getElementById("year").textContent = String(new Date().getFullYear());
    renderCart();
});
