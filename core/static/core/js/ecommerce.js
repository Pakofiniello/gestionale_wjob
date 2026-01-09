// ==========================================
// ECOMMERCE - CART MANAGEMENT
// ==========================================

// Cart in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initEcommerceNav();
    
    // Se siamo nella pagina cart, carica il carrello
    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }
});

// ==========================================
// NAVBAR ECOMMERCE
// ==========================================
function initEcommerceNav() {
    // User menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdownEcommerce');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Check if user is admin (mock - replace with real check)
    const isAdmin = false; // Sostituisci con: currentUser && currentUser.role === 'admin'
    
    if (isAdmin) {
        document.querySelector('.admin-only')?.style.setProperty('display', 'flex');
        document.querySelector('.dropdown-logged')?.style.setProperty('display', 'block');
        document.querySelector('.dropdown-guest')?.style.setProperty('display', 'none');
    }
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart(productId) {
    // Mock product data (sostituire con chiamata API)
    const products = {
        1: { id: 1, name: 'Dell XPS 15 4K OLED', price: 1299, sku: 'DELL-XPS-001', image: '' },
        2: { id: 2, name: 'Monitor 27" 4K UHD', price: 449, sku: 'MON-4K-001', image: '' },
        3: { id: 3, name: 'Tastiera Meccanica RGB', price: 149, sku: 'KEY-MECH-001', image: '' },
        4: { id: 4, name: 'Mouse Wireless Pro', price: 79, sku: 'MOU-WL-003', image: '' },
        5: { id: 5, name: 'SSD NVMe 1TB', price: 129, sku: 'SSD-1TB-001', image: '' },
        6: { id: 6, name: 'Webcam Full HD', price: 89, sku: 'CAM-HD-001', image: '' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        Toast.show(`Quantità aggiornata: ${product.name}`, 'success');
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        Toast.show(`Aggiunto al carrello: ${product.name}`, 'success');
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const product = cart[index];
        cart.splice(index, 1);
        Toast.show(`${product.name} rimosso dal carrello`, 'info');
        saveCart();
        updateCartCount();
        
        // Reload cart page
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        if (item.quantity > 99) item.quantity = 99;
        
        saveCart();
        updateCartCount();
        
        // Update UI
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.22;
    const total = subtotal + tax;
    
    // Update summary
    document.querySelector('.summary-row:nth-child(1) strong').textContent = `€${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(3) strong').textContent = `€${tax.toFixed(2)}`;
    document.querySelector('.summary-total strong').textContent = `€${total.toFixed(2)}`;
    
    // Update items count
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.summary-row:nth-child(1) span').textContent = `Subtotale (${itemCount} articoli)`;
}

function clearCart() {
    if (confirm('Vuoi svuotare il carrello?')) {
        cart = [];
        saveCart();
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            loadCart();
        }
        
        Toast.show('Carrello svuotato', 'info');
    }
}

// ==========================================
// SHOP FILTERS
// ==========================================

function initShopFilters() {
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Price filters
    document.querySelectorAll('input[name="price"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Availability filters
    document.querySelectorAll('input[name="availability"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Rating filters
    document.querySelectorAll('input[name="rating"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
}

function filterProducts() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(c => c.value);
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(c => c.value);
    const selectedAvailability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(c => c.value);
    const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(c => c.value);
    
    // Apply filters (implementare logica filtri reale con dati backend)
    console.log('Filters:', { selectedCategories, selectedPrices, selectedAvailability, selectedRatings });
    
    // Qui implementerai la chiamata al backend per filtrare prodotti
    // O filtrerai i prodotti caricati in memoria
}

// ==========================================
// VIEW TOGGLE (Grid/List)
// ==========================================

document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const view = this.dataset.view;
        
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            if (view === 'list') {
                productsGrid.style.gridTemplateColumns = '1fr';
            } else {
                productsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            }
        }
    });
});

// ==========================================
// QUICK VIEW PRODUCT (opzionale)
// ==========================================

function quickViewProduct(productId) {
    // Implementare modal quick view prodotto
    console.log('Quick view product:', productId);
}

// ==========================================
// WISHLIST (opzionale)
// ==========================================

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        Toast.show('Aggiunto ai preferiti', 'success');
    } else {
        Toast.show('Già nei preferiti', 'info');
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    Toast.show('Rimosso dai preferiti', 'info');
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.quickViewProduct = quickViewProduct;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;