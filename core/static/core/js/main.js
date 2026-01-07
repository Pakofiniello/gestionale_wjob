// ==========================================
// GESTIONE SIDEBAR
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    // Toggle sidebar on mobile
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Gestione navigazione attiva
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href)) {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        }
    });
    
    // User dropdown menu
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    console.log('userProfileBtn:', userProfileBtn);
    console.log('userDropdown:', userDropdown);
    
    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Dropdown clicked, toggling active class');
            userDropdown.classList.toggle('active');
        });
        
        // Chiudi dropdown quando clicchi fuori
        document.addEventListener('click', function(e) {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    } else {
        console.log('userProfileBtn or userDropdown not found');
    }
});

// ==========================================
// SISTEMA TOAST NOTIFICATIONS
// ==========================================
const Toast = {
    container: null,
    
    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        
        const titles = {
            success: 'Successo',
            error: 'Errore',
            warning: 'Attenzione',
            info: 'Info'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        this.container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ==========================================
// GESTIONE MODALE
// ==========================================
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal?.closest('.modal-overlay');
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }
    
    open() {
        if (this.overlay) {
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ==========================================
// RICERCA
// ==========================================
const Search = {
    init() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    },
    
    handleSearch(query) {
        if (query.length < 2) return;
        
        // Qui implementerai la logica di ricerca
        console.log('Searching for:', query);
        
        // Esempio di ricerca nei prodotti
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const name = product.querySelector('.product-name')?.textContent.toLowerCase();
            if (name && name.includes(query.toLowerCase())) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
};

// ==========================================
// GESTIONE TABELLE
// ==========================================
const Table = {
    sort(table, column, direction = 'asc') {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.children[column].textContent;
            const bValue = b.children[column].textContent;
            
            if (direction === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        
        rows.forEach(row => tbody.appendChild(row));
    },
    
    filter(table, searchTerm) {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
};

// ==========================================
// GESTIONE FORM
// ==========================================
const Form = {
    validate(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    },
    
    serialize(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },
    
    reset(form) {
        form.reset();
        const errors = form.querySelectorAll('.error');
        errors.forEach(el => el.classList.remove('error'));
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// ANIMAZIONI SCROLL
// ==========================================
const ScrollAnimations = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.stat-card, .product-card, .table-container').forEach(el => {
            observer.observe(el);
        });
    }
};

// ==========================================
// CHARTS (Placeholder per futuri grafici)
// ==========================================
const Charts = {
    init() {
        // Qui integrerai una libreria di grafici come Chart.js
        console.log('Charts initialized');
    },
    
    createLineChart(canvasId, data) {
        // Esempio placeholder
        console.log('Creating line chart:', canvasId, data);
    },
    
    createBarChart(canvasId, data) {
        // Esempio placeholder
        console.log('Creating bar chart:', canvasId, data);
    },
    
    createPieChart(canvasId, data) {
        // Esempio placeholder
        console.log('Creating pie chart:', canvasId, data);
    }
};

// ==========================================
// GESTIONE PRODOTTI (Dati mock per demo)
// ==========================================
const ProductManager = {
    products: [
        {
            id: 1,
            name: 'Laptop Dell XPS 15',
            category: 'Elettronica',
            price: 1299.99,
            stock: 15,
            sku: 'DELL-XPS-001',
            image: null
        },
        {
            id: 2,
            name: 'Sedia Ergonomica',
            category: 'Arredamento',
            price: 299.99,
            stock: 8,
            sku: 'CHAIR-ERG-001',
            image: null
        },
        {
            id: 3,
            name: 'Monitor 27" 4K',
            category: 'Elettronica',
            price: 449.99,
            stock: 22,
            sku: 'MON-4K-001',
            image: null
        }
    ],
    
    getAll() {
        return this.products;
    },
    
    getById(id) {
        return this.products.find(p => p.id === id);
    },
    
    add(product) {
        product.id = this.products.length + 1;
        this.products.push(product);
        Toast.show('Prodotto aggiunto con successo', 'success');
    },
    
    update(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            Toast.show('Prodotto aggiornato con successo', 'success');
        }
    },
    
    delete(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            Toast.show('Prodotto eliminato', 'info');
        }
    }
};

// ==========================================
// GESTIONE ORDINI (Dati mock per demo)
// ==========================================
const OrderManager = {
    orders: [
        {
            id: 1,
            orderNumber: 'ORD-2026-001',
            customer: 'Mario Rossi',
            date: '2026-01-05',
            total: 1599.98,
            status: 'pending',
            items: [
                { productId: 1, quantity: 1, price: 1299.99 },
                { productId: 2, quantity: 1, price: 299.99 }
            ]
        },
        {
            id: 2,
            orderNumber: 'ORD-2026-002',
            customer: 'Laura Bianchi',
            date: '2026-01-06',
            total: 449.99,
            status: 'shipped',
            items: [
                { productId: 3, quantity: 1, price: 449.99 }
            ]
        }
    ],
    
    getAll() {
        return this.orders;
    },
    
    getById(id) {
        return this.orders.find(o => o.id === id);
    },
    
    updateStatus(id, status) {
        const order = this.getById(id);
        if (order) {
            order.status = status;
            Toast.show('Stato ordine aggiornato', 'success');
        }
    }
};

// ==========================================
// INIZIALIZZAZIONE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza tutti i componenti
    Toast.init();
    Search.init();
    ScrollAnimations.init();
    Charts.init();
    
    // Log per conferma
    console.log('🚀 Gestionale Magazzino inizializzato');
    console.log('📦 Prodotti caricati:', ProductManager.getAll().length);
    console.log('📋 Ordini caricati:', OrderManager.getAll().length);
});

// ==========================================
// ESPORTA GLOBALMENTE
// ==========================================
window.Toast = Toast;
window.Modal = Modal;
window.Table = Table;
window.Form = Form;
window.Charts = Charts;
window.ProductManager = ProductManager;
window.OrderManager = OrderManager;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;