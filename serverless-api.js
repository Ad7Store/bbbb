// GitHub API Configuration
// These should be set as environment variables in production
const GITHUB_OWNER = "YOUR_GITHUB_USERNAME"; // Replace with your GitHub username
const GITHUB_REPO = "YOUR_REPO_NAME"; // Replace with your repository name
const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"; // Replace with your GitHub token
const GITHUB_BRANCH = "main";

// API Base URL
const GITHUB_API_BASE = "https://api.github.com";

// GitHub API URLs
const USERS_API = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/users.json`;
const ITEMS_API = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/items.json`;
const CHECKOUTS_API = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/checkouts.json`;

// GitHub API Headers
const GITHUB_HEADERS = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
};

// Fallback sample products (used if GitHub API fails)
const SAMPLE_PRODUCTS = [
    {
        id: 1,
        name: "Quantum X Pro",
        model: "QXP-2023",
        price: 199999,
        originalPrice: 249999,
        description: "Experience the future with Quantum X Pro's revolutionary neural processing unit and holographic display. Perfect for professionals and creators.",
        mainImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1546054451-aa724a6c41e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 2,
        name: "Nexus Watch Ultra",
        model: "NWU-5G",
        price: 49999,
        originalPrice: 59999,
        description: "Stay connected with the Nexus Watch Ultra. Health monitoring, 5G connectivity, and a battery that lasts for days.",
        mainImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1579586337278-3f6a89d6d5c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 3,
        name: "Aero Pods Max",
        model: "APM-X1",
        price: 34999,
        originalPrice: 39999,
        description: "Immersive spatial audio with noise cancellation. Aero Pods Max deliver studio-quality sound in a wireless design.",
        mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 4,
        name: "Zenith Gaming Rig",
        model: "ZGR-Pro",
        price: 449999,
        originalPrice: 549999,
        description: "Ultimate gaming performance with liquid-cooled RTX 4090, 64GB DDR5 RAM, and 4TB NVMe storage. Dominate every game.",
        mainImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 5,
        name: "Pixel View Drone",
        model: "PVD-4K",
        price: 179999,
        originalPrice: 199999,
        description: "4K cinematic drone with 30-minute flight time, obstacle avoidance, and AI tracking for perfect shots every time.",
        mainImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1524143986875-3b098d78b363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    },
    {
        id: 6,
        name: "Smart Home Hub Pro",
        model: "SHH-2023",
        price: 59999,
        originalPrice: 69999,
        description: "Centralize your smart home with voice control, AI automation, and compatibility with 1000+ devices.",
        mainImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ]
    }
];

/**
 * Fetch data from GitHub repository
 * @param {string} url - GitHub API URL
 * @returns {Promise<any>} - Parsed JSON data
 */
async function fetchFromGitHub(url) {
    try {
        // Check if GitHub credentials are configured
        if (GITHUB_TOKEN === "YOUR_GITHUB_TOKEN" || GITHUB_OWNER === "YOUR_GITHUB_USERNAME") {
            console.warn("GitHub credentials not configured. Using fallback data.");
            return getFallbackData(url);
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: GITHUB_HEADERS
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // GitHub returns content as base64 encoded string
        if (data.content) {
            const decodedContent = atob(data.content.replace(/\n/g, ''));
            return {
                data: JSON.parse(decodedContent),
                sha: data.sha
            };
        }
        
        return { data: [], sha: null };
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        return getFallbackData(url);
    }
}

/**
 * Save data to GitHub repository
 * @param {string} url - GitHub API URL
 * @param {any} data - Data to save
 * @param {string} sha - File SHA for updating existing file
 * @returns {Promise<boolean>} - Success status
 */
async function saveToGitHub(url, data, sha = null) {
    try {
        // Check if GitHub credentials are configured
        if (GITHUB_TOKEN === "YOUR_GITHUB_TOKEN" || GITHUB_OWNER === "YOUR_GITHUB_USERNAME") {
            console.warn("GitHub credentials not configured. Saving to localStorage instead.");
            return saveToLocalStorage(url, data);
        }

        const content = btoa(JSON.stringify(data, null, 2));
        
        const payload = {
            message: `Update ${new Date().toISOString()}`,
            content: content,
            branch: GITHUB_BRANCH
        };

        // If sha is provided, we're updating an existing file
        if (sha) {
            payload.sha = sha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: GITHUB_HEADERS,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
        }

        console.log('Successfully saved to GitHub');
        return true;
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        
        // Fallback to localStorage
        return saveToLocalStorage(url, data);
    }
}

/**
 * Get fallback data when GitHub API fails
 * @param {string} url - API URL
 * @returns {Object} - Fallback data
 */
function getFallbackData(url) {
    if (url.includes('items.json')) {
        return { data: SAMPLE_PRODUCTS, sha: null };
    }
    
    if (url.includes('users.json')) {
        const users = JSON.parse(localStorage.getItem('ad7store_users')) || [];
        return { data: users, sha: null };
    }
    
    if (url.includes('checkouts.json')) {
        const checkouts = JSON.parse(localStorage.getItem('ad7store_orders')) || [];
        return { data: checkouts, sha: null };
    }
    
    return { data: [], sha: null };
}

/**
 * Save data to localStorage as fallback
 * @param {string} url - API URL
 * @param {any} data - Data to save
 * @returns {boolean} - Success status
 */
function saveToLocalStorage(url, data) {
    try {
        if (url.includes('users.json')) {
            localStorage.setItem('ad7store_users', JSON.stringify(data));
        } else if (url.includes('checkouts.json')) {
            localStorage.setItem('ad7store_orders', JSON.stringify(data));
        } else if (url.includes('items.json')) {
            localStorage.setItem('ad7store_items', JSON.stringify(data));
        }
        console.log('Saved to localStorage as fallback');
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Fetch products from GitHub or fallback
 * @returns {Promise<Array>} - Array of products
 */
async function fetchProducts() {
    const result = await fetchFromGitHub(ITEMS_API);
    return result.data;
}

/**
 * Fetch users from GitHub or fallback
 * @returns {Promise<Array>} - Array of users
 */
async function fetchUsers() {
    const result = await fetchFromGitHub(USERS_API);
    return result.data;
}

/**
 * Fetch checkouts/orders from GitHub or fallback
 * @returns {Promise<Array>} - Array of orders
 */
async function fetchCheckouts() {
    const result = await fetchFromGitHub(CHECKOUTS_API);
    return result.data;
}

/**
 * Save user to GitHub
 * @param {Object} user - User object
 * @returns {Promise<boolean>} - Success status
 */
async function saveUser(user) {
    const result = await fetchFromGitHub(USERS_API);
    const users = result.data;
    const sha = result.sha;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    
    // Add new user
    users.push({
        ...user,
        id: Date.now(),
        createdAt: new Date().toISOString()
    });
    
    return await saveToGitHub(USERS_API, users, sha);
}

/**
 * Save checkout/order to GitHub
 * @param {Object} order - Order object
 * @returns {Promise<boolean>} - Success status
 */
async function saveCheckout(order) {
    const result = await fetchFromGitHub(CHECKOUTS_API);
    const checkouts = result.data;
    const sha = result.sha;
    
    // Add new order
    checkouts.push(order);
    
    return await saveToGitHub(CHECKOUTS_API, checkouts, sha);
}

/**
 * Save products to GitHub
 * @param {Array} products - Array of products
 * @returns {Promise<boolean>} - Success status
 */
async function saveProducts(products) {
    const result = await fetchFromGitHub(ITEMS_API);
    const sha = result.sha;
    
    return await saveToGitHub(ITEMS_API, products, sha);
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchProducts,
        fetchUsers,
        fetchCheckouts,
        saveUser,
        saveCheckout,
        saveProducts,
        SAMPLE_PRODUCTS
    };
} else {
    // Make functions available globally for browser
    window.GitHubAPI = {
        fetchProducts,
        fetchUsers,
        fetchCheckouts,
        saveUser,
        saveCheckout,
        saveProducts,
        SAMPLE_PRODUCTS
    };
}
