const ADDRESS_STORAGE_KEY = 'dokan-addresses';

// Temporary same-device storage. Replace these methods with authenticated API calls when available.
export const addressService = {
  list() {
    try {
      const result = JSON.parse(localStorage.getItem(ADDRESS_STORAGE_KEY) || '[]');
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  },
  save(addresses) {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  },
};

// Backend integration point. No order is created until this adapter is connected to an order API.
export const orderService = {
  async create(_checkoutData) {
    return { ok: false, error: 'Order submission is unavailable because the order service is not connected yet. Your details are still here.' };
  },
};

// Backend handoff: define endpoint URLs and request/response schemas for products, current customer,
// email login, Google OAuth, registration, password reset, saved addresses, order tracking, and orders.
// The methods below are frontend seams only; none of them currently make a network request.
// Card details must go directly to a payment provider and are never stored by this app.
export const productService = {
  async list() { throw new Error('Product API is not connected.'); },
};

// Temporary catalog entries transcribed from the supplied storefront references.
// Replace this local list with CMS products once the product API is available.
const previewTopwear = [
  { id: 'basic-denim-jacket', name: 'Basic Denim Jacket', price: 1300, category: 'Jackets', image: '/placeholder.svg?height=640&width=520&query=denim+jacket' },
  { id: 'zara-double-face', name: 'Zara Double Face', price: 1300, category: 'Jackets', image: '/placeholder.svg?height=640&width=520&query=black+leather+jacket' },
  { id: 'leather-jacket', name: 'Leather Jacket', price: 1300, category: 'Jackets', image: '/placeholder.svg?height=640&width=520&query=leather+jacket' },
  { id: 'sweater-coat', name: 'Sweater Coat', price: 1500, category: 'Sweatshirts', image: '/placeholder.svg?height=640&width=520&query=black+sweater+coat' },
  { id: 'oversized-sweatshirts', name: 'Oversized Sweatshirts', price: 850, category: 'Sweatshirts', image: '/placeholder.svg?height=640&width=520&query=oversized+sweatshirt' },
];

// CMS product records should include department/type/category, colors, sizes, price, optional salePrice, and images.
// Topwear is included only when explicitly categorized as a jacket, T-shirt, sweatshirt, or topwear item.
export const collectionService = {
  async listTopwear() {
    let catalog;
    try {
      catalog = await productService.list();
    } catch {
      return previewTopwear;
    }
    const topwearTypes = new Set(['topwear', 'top', 'tops', 'jacket', 'jackets', 't-shirt', 't-shirts', 'tee', 'tees', 'shirt', 'shirts', 'sweatshirt', 'sweatshirts']);
    return catalog.filter((product) => {
      const type = String(product.department || product.type || product.category || '').trim().toLowerCase();
      return type === 'topwear' || topwearTypes.has(type);
    });
  },
};

// Authentication must be provided by the backend; these methods intentionally never fabricate a session.
export const authService = {
  async login(_credentials) { throw new Error('Email and password sign-in is unavailable because authentication is not connected yet.'); },
  async signInWithGoogle() { throw new Error('Google sign-in is unavailable because an approved OAuth provider is not connected yet.'); },
  async register(_details) { throw new Error('Account creation is unavailable because authentication is not connected yet.'); },
  async requestPasswordReset(_email) { throw new Error('Password reset is unavailable because authentication is not connected yet.'); },
  async currentUser() { return null; },
};

// The backend should expose a tracking lookup contract and return an authoritative order status.
export const trackingService = {
  async lookup(_trackingDetails) {
    throw new Error('Order tracking is unavailable because the tracking service is not connected yet.');
  },
};

// The adapter must verify this reference with the payment provider/backend before returning a result.
// Expected status: `paid` or `failed`, with an authoritative order summary supplied by the backend.
export const paymentService = {
  async verify(_paymentReference) {
    throw new Error('Payment verification is unavailable because the payment service is not connected yet.');
  },
};
