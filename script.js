// Product Data
const products = [
    {
        id: 1,
        title: "Men's Classic Drop Shoulder Tee",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "men",
        tags: ["best"]
    },
    {
        id: 2,
        title: "Women's Oversized Drop Shoulder Tee",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "women",
        tags: ["new", "best"]
    },
    {
        id: 3,
        title: "Men's Graphic Drop Shoulder Tee",
        price: 44.99,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "men",
        tags: ["new"]
    },
    {
        id: 4,
        title: "Women's Cropped Drop Shoulder Tee",
        price: 36.99,
        image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "women",
        tags: []
    },
    {
        id: 5,
        title: "Men's Premium Cotton Drop Shoulder Tee",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "men",
        tags: ["best"]
    },
    {
        id: 6,
        title: "Women's V-Neck Drop Shoulder Tee",
        price: 37.99,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "women",
        tags: []
    },
    {
        id: 7,
        title: "Men's Striped Drop Shoulder Tee",
        price: 42.99,
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "men",
        tags: ["new"]
    },
    {
        id: 8,
        title: "Women's Long Sleeve Drop Shoulder Tee",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
        category: "women",
        tags: ["best"]
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');

// Cart State
let cart = [];

// Initialize the app
function init() {
    renderProducts(products);
    setupEventListeners();
    loadCart();
}

// Render products to the page
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="view-details">View Details</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            filterProducts(filter);
        });
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCartItems();
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
    
    // Add to cart (event delegation)
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
    
    // Cart item actions (event delegation)
    cartItemsContainer.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const productId = parseInt(cartItem.dataset.id);
        
        if (e.target.classList.contains('increase-quantity')) {
            updateCartItemQuantity(productId, 1);
        } else if (e.target.classList.contains('decrease-quantity')) {
            updateCartItemQuantity(productId, -1);
        } else if (e.target.classList.contains('remove-item')) {
            removeFromCart(productId);
        }
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        alert('Checkout functionality would be implemented here!');
    });
}

// Filter products based on category or tag
function filterProducts(filter) {
    let filteredProducts = [];
    
    if (filter === 'all') {
        filteredProducts = products;
    } else if (filter === 'men' || filter === 'women') {
        filteredProducts = products.filter(product => product.category === filter);
    } else if (filter === 'new') {
        filteredProducts = products.filter(product => product.tags.includes('new'));
    } else if (filter === 'best') {
        filteredProducts = products.filter(product => product.tags.includes('best'));
    }
    
    renderProducts(filteredProducts);
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show a quick notification
    const notification = document.createElement('div');
    notification.textContent = `${product.title} added to cart!`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--secondary)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.animation = 'slideIn 0.3s, fadeOut 0.3s 2s forwards';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase-quantity">+</button>
                <button class="remove-item">Remove</button>
            </div>
            <div class="cart-item-total">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Initialize the app
init();