/**
 * BINT & BEADS - State Management
 * Persistent LocalStorage state for Cart, Wishlist, Orders, and Custom Configurator
 */
import { getStorage, setStorage, showToast, getProductById } from './utils.js';

const STORAGE_KEYS = {
  CART: 'bint_cart',
  WISHLIST: 'bint_wishlist',
  RECENTLY_VIEWED: 'bint_recently_viewed',
  CUSTOM_DESIGN: 'bint_custom_design',
  ORDERS: 'bint_orders',
  REVIEWS: 'bint_reviews'
};

// Seed sample orders if none exist
(function initSeedOrders() {
  const existingOrders = getStorage(STORAGE_KEYS.ORDERS, null);
  if (!existingOrders || existingOrders.length === 0) {
    const demoOrders = [
      {
        orderRef: 'BB-2026-0184',
        createdAt: '2026-09-28T14:30:00.000Z',
        customer: {
          firstName: 'Amina',
          lastName: 'Bello',
          email: 'amina.bello@example.com',
          phone: '+2348031234567'
        },
        items: [
          {
            id: 'demo-1',
            productId: 1,
            name: 'Zara Noir & Gold Bracelet',
            price: 35000,
            quantity: 1,
            colour: 'Black',
            size: 'M (17.5cm)',
            image: 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: 'demo-2',
            productId: 3,
            name: 'Leila Royal Amber & Gold Waist Beads',
            price: 32000,
            quantity: 1,
            colour: 'Gold',
            size: 'Standard Tie-On',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'
          }
        ],
        packaging: {
          id: 'gift-box',
          name: 'Bint Keepsake Box',
          price: 4500
        },
        delivery: {
          id: 'bint_delivery',
          name: 'Bint Courier Delivery (Lagos Island)',
          price: 3500,
          address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos'
        },
        subtotal: 67000,
        packagingPrice: 4500,
        deliveryPrice: 3500,
        total: 75000,
        status: 'crafting', // received | confirmed | crafting | quality-check | packaged | dispatched | delivered
        statusStep: 3 // 1 to 7
      },
      {
        orderRef: 'BB-2026-0092',
        createdAt: '2026-09-15T11:15:00.000Z',
        customer: {
          firstName: 'Zainab',
          lastName: 'Yusuf',
          email: 'zainab.y@example.com',
          phone: '+2348098765432'
        },
        items: [
          {
            id: 'demo-3',
            productId: 4,
            name: 'Safiya Architectural Beaded Handbag',
            price: 95000,
            quantity: 1,
            colour: 'Cream',
            size: 'One Size',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
          }
        ],
        packaging: {
          id: 'luxury-set',
          name: 'Bespoke Luxury Gift Suite',
          price: 8500
        },
        delivery: {
          id: 'store_pickup',
          name: 'Studio Concierge Collection',
          price: 0,
          pickupDetails: 'Studio Atelier — 14 Karimu Kotun, Victoria Island, Lagos'
        },
        subtotal: 95000,
        packagingPrice: 8500,
        deliveryPrice: 0,
        total: 103500,
        status: 'delivered',
        statusStep: 7
      }
    ];
    setStorage(STORAGE_KEYS.ORDERS, demoOrders);
  }
})();

/* ==========================================================================
   CART MANAGEMENT
   ========================================================================== */
export function getCart() {
  return getStorage(STORAGE_KEYS.CART, []);
}

export function saveCart(cart) {
  setStorage(STORAGE_KEYS.CART, cart);
  window.dispatchEvent(new CustomEvent('bint:cart-updated', { detail: { cart } }));
}

export function addToCart(item) {
  const cart = getCart();

  // Look for existing item with exact same configuration
  const existingIndex = cart.findIndex(c => {
    if (c.productId !== item.productId) return false;
    if (c.colour !== item.colour) return false;
    if (c.size !== item.size) return false;
    if (item.isCustom || c.isCustom) {
      return JSON.stringify(item.customConfig) === JSON.stringify(c.customConfig);
    }
    return true;
  });

  if (existingIndex > -1) {
    cart[existingIndex].quantity += (item.quantity || 1);
  } else {
    cart.push({
      id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      colour: item.colour || 'Default',
      size: item.size || 'Standard',
      quantity: item.quantity || 1,
      isCustom: Boolean(item.isCustom),
      customConfig: item.customConfig || null
    });
  }

  saveCart(cart);
  showToast(`Added "${item.name}" to your bag`, 'gold');
}

export function updateQuantity(cartItemId, delta) {
  const cart = getCart();
  const index = cart.findIndex(i => i.id === cartItemId);
  if (index > -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
      showToast('Item removed from your bag', 'info');
    }
    saveCart(cart);
  }
}

export function removeFromCart(cartItemId) {
  let cart = getCart();
  const item = cart.find(i => i.id === cartItemId);
  cart = cart.filter(i => i.id !== cartItemId);
  saveCart(cart);
  if (item) {
    showToast(`Removed "${item.name}" from your bag`, 'info');
  }
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

export function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/* ==========================================================================
   WISHLIST MANAGEMENT
   ========================================================================== */
export function getWishlist() {
  return getStorage(STORAGE_KEYS.WISHLIST, []);
}

export function isWishlisted(productId) {
  const list = getWishlist();
  const id = parseInt(productId, 10);
  return list.includes(id);
}

export function toggleWishlist(productId) {
  const id = parseInt(productId, 10);
  let list = getWishlist();
  const product = getProductById(id);
  const name = product ? product.name : 'Item';

  if (list.includes(id)) {
    list = list.filter(item => item !== id);
    setStorage(STORAGE_KEYS.WISHLIST, list);
    window.dispatchEvent(new CustomEvent('bint:wishlist-updated', { detail: { wishlist: list } }));
    showToast(`Removed from your wishlist`, 'info');
    return false;
  } else {
    list.push(id);
    setStorage(STORAGE_KEYS.WISHLIST, list);
    window.dispatchEvent(new CustomEvent('bint:wishlist-updated', { detail: { wishlist: list } }));
    showToast(`Saved "${name}" to your wishlist`, 'gold');
    return true;
  }
}

export function removeFromWishlist(productId) {
  const id = parseInt(productId, 10);
  let list = getWishlist();
  list = list.filter(item => item !== id);
  setStorage(STORAGE_KEYS.WISHLIST, list);
  window.dispatchEvent(new CustomEvent('bint:wishlist-updated', { detail: { wishlist: list } }));
  showToast('Removed from wishlist', 'info');
}

/* ==========================================================================
   ORDERS MANAGEMENT
   ========================================================================== */
export function getOrders() {
  return getStorage(STORAGE_KEYS.ORDERS, []);
}

export function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  setStorage(STORAGE_KEYS.ORDERS, orders);
  return order;
}

export function getOrderByReference(reference) {
  const orders = getOrders();
  const cleanRef = (reference || '').trim().toUpperCase();
  return orders.find(o => o.orderRef.toUpperCase() === cleanRef) || null;
}

/* ==========================================================================
   CUSTOM STUDIO DRAFT
   ========================================================================== */
export function getCustomDesignDraft() {
  return getStorage(STORAGE_KEYS.CUSTOM_DESIGN, null);
}

export function saveCustomDesignDraft(draft) {
  setStorage(STORAGE_KEYS.CUSTOM_DESIGN, draft);
}

export function clearCustomDesignDraft() {
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_DESIGN);
}
