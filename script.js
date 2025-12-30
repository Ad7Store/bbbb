// Application State
let currentUser = JSON.parse(localStorage.getItem('ad7store_current_user')) || null;
let cart = JSON.parse(localStorage.getItem('ad7store_cart')) || [];
let products = [];
let currentView = 'home';

// DOM Elements
const homeLink = document.getElementById('home-link');
const productsLink = document.getElementById('products-link');
const cartLink = document.getElementById('cart-link');
const ordersLink = document.getElementById('orders-link');
const cartCount = document.getElementById('cart-count');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const exploreBtn = document.getElementById('explore-btn');
const checkoutBtn = document.getElementById('checkout-btn');

const homeSection = document.getElementById('home-section');
const productsSection = document.getElementById('products-section');
const cartSection = document.getElementById('cart-section');
const ordersSection = document.getElementById('orders-section');

const productsContainer = document.getElementById('products-container');
const productsSpinner = document.getElementById('products-spinner');

const signupModal = document.getElementById('signup-modal');
const loginModal = document.getElementById('login-modal');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');

const closeSignup = document.getElementById('close-signup');
const closeLogin = document.getElementById('close-login');
const closeProduct = document.getElementById('close-product');
const closeCheckout = document.getElementById('close-checkout');

const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const checkoutForm = document.getElementById('checkout-form');

const signupAlert = document.getElementById('signup-alert');
const loginAlert = document.getElementById('login-alert');
const checkoutAlert = document.getElementById('checkout-alert');

// Format currency in PKR
function formatCurrency(amount) {
    return `₨${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    loadProducts();
    updateCartCount();
    showView('home');
});

function initApp() {
    // Check if user is logged in
    if (currentUser) {
        updateAuthButtons();
    }
    
    // Update cart from localStorage
    cart = JSON.parse(localStorage.getItem('ad7store_cart')) || [];
}

function setupEventListeners() {
    // Navigation links
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('home');
    });
    productsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('products');
    });
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('cart');
    });
    ordersLink.addEventListener('click', (e) => {
        e.preventDefault();
        showView('orders');
    });
    
    // Buttons
    signupBtn.addEventListener('click', () => showModal('signup'));
    loginBtn.addEventListener('click', () => showModal('login'));
    exploreBtn.addEventListener('click', () => showView('products'));
    checkoutBtn.addEventListener('click', () => showModal('checkout'));
    
    // Modal close buttons
    closeSignup.addEventListener('click', () => hideModal('signup'));
    closeLogin.addEventListener('click', () => hideModal('login'));
    closeProduct.addEventListener('click', () => hideModal('product'));
    closeCheckout.addEventListener('click', () => hideModal('checkout'));
    
    // Form submissions
    signupForm.addEventListener('submit', handleSignup);
    loginForm.addEventListener('submit', handleLogin);
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === signupModal) hideModal('signup');
        if (e.target === loginModal) hideModal('login');
        if (e.target === productModal) hideModal('product');
        if (e.target === checkoutModal) hideModal('checkout');
    });
}

function showView(view) {
    // Hide all sections
    homeSection.style.display = 'none';
    productsSection.style.display = 'none';
    cartSection.style.display = 'none';
    ordersSection.style.display = 'none';
    
    // Show the selected section
    switch(view) {
        case 'home':
            homeSection.style.display = 'block';
            break;
        case 'products':
            productsSection.style.display = 'block';
            break;
        case 'cart':
            cartSection.style.display = 'block';
            renderCart();
            break;
        case 'orders':
            ordersSection.style.display = 'block';
            renderOrders();
            break;
    }
    
    currentView = view;
    
    // Update active nav link
    updateActiveNavLink(view);
}

function updateActiveNavLink(view) {
    const links = [homeLink, productsLink, cartLink, ordersLink];
    links.forEach(link => link.classList.remove('active'));
    
    switch(view) {
        case 'home':
            homeLink.classList.add('active');
            break;
        case 'products':
            productsLink.classList.add('active');
            break;
        case 'cart':
            cartLink.classList.add('active');
            break;
        case 'orders':
            ordersLink.classList.add('active');
            break;
    }
}

function showModal(modalName) {
    switch(modalName) {
        case 'signup':
            signupModal.style.display = 'flex';
            break;
        case 'login':
            loginModal.style.display = 'flex';
            break;
        case 'product':
            productModal.style.display = 'flex';
            break;
        case 'checkout':
            if (cart.length === 0) {
                showAlert('error', 'Your cart is empty. Add some products before checkout.', 'cart');
                return;
            }
            
            // Calculate total for checkout
            const total = calculateCartTotal();
            document.getElementById('checkout-total').textContent = formatCurrency(total);
            checkoutModal.style.display = 'flex';
            break;
    }
}

function hideModal(modalName) {
    switch(modalName) {
        case 'signup':
            signupModal.style.display = 'none';
            signupForm.reset();
            signupAlert.style.display = 'none';
            break;
        case 'login':
            loginModal.style.display = 'none';
            loginForm.reset();
            loginAlert.style.display = 'none';
            break;
        case 'product':
            productModal.style.display = 'none';
            break;
        case 'checkout':
            checkoutModal.style.display = 'none';
            checkoutForm.reset();
            checkoutAlert.style.display = 'none';
            break;
    }
}

async function loadProducts() {
    try {
        // Show loading spinner
        productsSpinner.style.display = 'block';
        
        // Try to fetch from GitHub API
        if (window.GitHubAPI && window.GitHubAPI.fetchProducts) {
            products = await window.GitHubAPI.fetchProducts();
        } else {
            // Fallback to sample products
            products = window.GitHubAPI?.SAMPLE_PRODUCTS || [];
        }
        
        // Hide spinner
        productsSpinner.style.display = 'none';
        
        // Render products
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        productsSpinner.style.display = 'none';
        productsContainer.innerHTML = '<p class="alert alert-error">Error loading products. Please try again later.</p>';
        
        // Fallback to sample products
        products = window.GitHubAPI?.SAMPLE_PRODUCTS || [];
        renderProducts();
    }
}

function renderProducts() {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p class="alert alert-error">No products available at the moment.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.mainImage}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-model">${product.model}</p>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    <span class="original-price">${formatCurrency(product.originalPrice)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="btn btn-secondary btn-small view-details" data-id="${product.id}">View Details</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to product buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('product-modal-title').textContent = product.name;
    
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <div class="product-gallery">
            <img src="${product.mainImage}" alt="${product.name}" class="product-main-image" id="product-main-image">
            <div class="product-thumbnails">
                ${product.images.map((img, index) => `
                    <img src="${img}" alt="${product.name} - View ${index + 1}" class="product-thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
                `).join('')}
            </div>
        </div>
        <div class="product-details">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-model">${product.model}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">${formatCurrency(product.price)}</span>
                <span class="original-price">${formatCurrency(product.originalPrice)}</span>
            </div>
            <div class="product-actions" style="margin-top: 2rem;">
                <button class="btn btn-primary" id="detail-add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn btn-secondary" id="detail-buy-now" data-id="${product.id}">Buy Now</button>
            </div>
        </div>
    `;
    
    // Add event listeners for thumbnail images
    document.querySelectorAll('.product-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            document.getElementById('product-main-image').src = imageSrc;
            
            // Update active thumbnail
            document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Add event listeners for detail buttons
    document.getElementById('detail-add-to-cart').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        addToCart(productId);
        hideModal('product');
    });
    
    document.getElementById('detail-buy-now').addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        addToCart(productId);
        hideModal('product');
        showView('cart');
        showModal('checkout');
    });
    
    showModal('product');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            model: product.model,
            price: product.price,
            image: product.mainImage,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('ad7store_cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showAlert('success', `${product.name} added to cart!`, 'products');
    
    // If we're on the cart page, update it
    if (currentView === 'cart') {
        renderCart();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p id="empty-cart-message">Your cart is empty. Start adding some awesome products!</p>';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartSummary.style.display = 'flex';
    
    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="product-model">${item.model}</p>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    
    // Add event listeners for cart controls
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Update summary
    updateCartSummary();
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('ad7store_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('ad7store_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    
    if (cart.length === 0) {
        document.getElementById('cart-summary').style.display = 'none';
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 250;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);
}

function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 250;
    return subtotal + shipping;
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!name || !email || !phone || !password) {
        showAlert('error', 'Please fill in all fields.', 'signup');
        return;
    }
    
    if (password.length < 6) {
        showAlert('error', 'Password must be at least 6 characters.', 'signup');
        return;
    }
    
    try {
        // Create new user object
        const newUser = {
            name,
            email,
            phone,
            password // Note: In production, this should be hashed
        };
        
        // Try to save to GitHub API
        if (window.GitHubAPI && window.GitHubAPI.saveUser) {
            await window.GitHubAPI.saveUser(newUser);
        } else {
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('ad7store_users')) || [];
            
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                showAlert('error', 'User with this email already exists.', 'signup');
                return;
            }
            
            users.push({
                ...newUser,
                id: Date.now(),
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('ad7store_users', JSON.stringify(users));
        }
        
        // Log the user in
        currentUser = {
            id: Date.now(),
            name,
            email,
            phone
        };
        
        localStorage.setItem('ad7store_current_user', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthButtons();
        
        // Show success message and close modal
        showAlert('success', 'Account created successfully!', 'signup');
        setTimeout(() => {
            hideModal('signup');
            showAlert('success', `Welcome to AD7Store, ${name}!`, 'products');
        }, 1500);
    } catch (error) {
        console.error('Error creating account:', error);
        showAlert('error', error.message || 'Failed to create account. Please try again.', 'signup');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validate inputs
    if (!email || !password) {
        showAlert('error', 'Please enter email and password.', 'login');
        return;
    }
    
    try {
        let user = null;
        
        // Try to fetch from GitHub API
        if (window.GitHubAPI && window.GitHubAPI.fetchUsers) {
            const users = await window.GitHubAPI.fetchUsers();
            user = users.find(u => u.email === email && u.password === password);
        } else {
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('ad7store_users')) || [];
            user = users.find(u => u.email === email && u.password === password);
        }
        
        if (!user) {
            showAlert('error', 'Invalid email or password.', 'login');
            return;
        }
        
        // Log the user in
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        
        localStorage.setItem('ad7store_current_user', JSON.stringify(currentUser));
        
        // Update UI
        updateAuthButtons();
        
        // Show success message and close modal
        showAlert('success', 'Login successful!', 'login');
        setTimeout(() => {
            hideModal('login');
            showAlert('success', `Welcome back, ${user.name}!`, 'products');
        }, 1500);
    } catch (error) {
        console.error('Error logging in:', error);
        showAlert('error', 'Failed to login. Please try again.', 'login');
    }
}

function updateAuthButtons() {
    if (currentUser) {
        signupBtn.textContent = currentUser.name.split(' ')[0];
        signupBtn.style.background = 'transparent';
        signupBtn.style.color = 'var(--secondary)';
        signupBtn.style.border = '2px solid var(--secondary)';
        signupBtn.disabled = true;
        
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = handleLogout;
    } else {
        signupBtn.textContent = 'Create Account';
        signupBtn.style.background = 'linear-gradient(90deg, var(--secondary), var(--success))';
        signupBtn.style.color = 'var(--dark)';
        signupBtn.style.border = 'none';
        signupBtn.disabled = false;
        signupBtn.onclick = () => showModal('signup');
        
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showModal('login');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('ad7store_current_user');
    updateAuthButtons();
    showAlert('success', 'You have been logged out.', 'products');
}

async function handleCheckout(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!currentUser) {
        showAlert('error', 'Please login or create an account to checkout.', 'checkout');
        setTimeout(() => {
            hideModal('checkout');
            showModal('login');
        }, 1500);
        return;
    }
    
    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const address = document.getElementById('checkout-address').value;
    const whatsapp = document.getElementById('checkout-whatsapp').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    // Validate inputs
    if (!name || !phone || !address) {
        showAlert('error', 'Please fill in all required fields.', 'checkout');
        return;
    }
    
    try {
        // Create order
        const order = {
            id: Date.now(),
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            name,
            phone,
            address,
            whatsapp,
            payment,
            items: [...cart],
            total: calculateCartTotal(),
            status: 'pending',
            date: new Date().toISOString()
        };
        
        // Try to save to GitHub API
        if (window.GitHubAPI && window.GitHubAPI.saveCheckout) {
            await window.GitHubAPI.saveCheckout(order);
        } else {
            // Fallback to localStorage
            const orders = JSON.parse(localStorage.getItem('ad7store_orders')) || [];
            orders.push(order);
            localStorage.setItem('ad7store_orders', JSON.stringify(orders));
        }
        
        // Clear cart
        cart = [];
        localStorage.setItem('ad7store_cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showAlert('success', 'Order placed successfully! You will receive confirmation soon.', 'checkout');
        
        // Close modal and update UI
        setTimeout(() => {
            hideModal('checkout');
            showView('orders');
            showAlert('success', `Order #${order.id} has been placed!`, 'orders');
        }, 2000);
    } catch (error) {
        console.error('Error placing order:', error);
        showAlert('error', 'Failed to place order. Please try again.', 'checkout');
    }
}

async function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    
    try {
        let userOrders = [];
        
        // Try to fetch from GitHub API
        if (window.GitHubAPI && window.GitHubAPI.fetchCheckouts) {
            const allOrders = await window.GitHubAPI.fetchCheckouts();
            // Filter orders for current user
            userOrders = currentUser 
                ? allOrders.filter(order => order.userId === currentUser.id || order.userEmail === currentUser.email)
                : [];
        } else {
            // Fallback to localStorage
            const allOrders = JSON.parse(localStorage.getItem('ad7store_orders')) || [];
            // Filter orders for current user
            userOrders = currentUser 
                ? allOrders.filter(order => order.userId === currentUser.id || order.userEmail === currentUser.email)
                : [];
        }
        
        if (userOrders.length === 0) {
            ordersList.innerHTML = '<p>No orders yet. Start shopping to see your orders here!</p>';
            return;
        }
        
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let ordersHTML = '';
        userOrders.forEach(order => {
            const orderDate = new Date(order.date).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            ordersHTML += `
                <div class="cart-items" style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <h3>Order #${order.id}</h3>
                        <span style="color: var(--success); font-weight: 600; text-transform: capitalize;">${order.status}</span>
                    </div>
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
                    <p><strong>Delivery to:</strong> ${order.address}</p>
                    <p><strong>Payment Method:</strong> ${order.payment === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                    <div style="margin-top: 1rem;">
                        <h4>Items (${order.items.length}):</h4>
                        ${order.items.map(item => `
                            <div style="display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 5px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
                                <div style="flex: 1;">
                                    <p style="font-weight: 600; margin: 0;">${item.name}</p>
                                    <p style="margin: 0.2rem 0; color: #aaa; font-size: 0.9rem;">${item.model}</p>
                                    <p style="margin: 0;">${item.quantity} x ${formatCurrency(item.price)}</p>
                                </div>
                                <div style="font-weight: 600; color: var(--success);">
                                    ${formatCurrency(item.price * item.quantity)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        ordersList.innerHTML = ordersHTML;
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<p class="alert alert-error">Error loading orders. Please try again later.</p>';
    }
}

function showAlert(type, message, context) {
    let alertElement;
    
    switch(context) {
        case 'signup':
            alertElement = signupAlert;
            break;
        case 'login':
            alertElement = loginAlert;
            break;
        case 'checkout':
            alertElement = checkoutAlert;
            break;
        case 'cart':
            alertElement = document.createElement('div');
            alertElement.className = `alert alert-${type}`;
            alertElement.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            document.getElementById('cart-items').prepend(alertElement);
            setTimeout(() => alertElement.remove(), 5000);
            return;
        case 'products':
            alertElement = document.createElement('div');
            alertElement.className = `alert alert-${type}`;
            alertElement.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            document.getElementById('products-container').prepend(alertElement);
            setTimeout(() => alertElement.remove(), 5000);
            return;
        case 'orders':
            alertElement = document.createElement('div');
            alertElement.className = `alert alert-${type}`;
            alertElement.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            document.getElementById('orders-list').prepend(alertElement);
            setTimeout(() => alertElement.remove(), 5000);
            return;
        default:
            return;
    }
    
    alertElement.className = `alert alert-${type}`;
    alertElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    alertElement.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}
