/**
 * BINT & BEADS - Shared Utilities
 */
import { BINT_CONFIG } from './data/config.js';
import { PRODUCTS } from './data/products.js';

/**
 * Format numeric amount into Nigerian Naira currency format (e.g., ₦35,000)
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 0
  }).format(amount);
  return `${BINT_CONFIG.currencySymbol}${formatted}`;
}

/**
 * Find product by ID
 * @param {number|string} id
 */
export function getProductById(id) {
  const numId = parseInt(id, 10);
  return PRODUCTS.find(p => p.id === numId) || null;
}

/**
 * Find product by slug
 * @param {string} slug
 */
export function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug) || null;
}

/**
 * Get category display name
 * @param {string} cat
 */
export function getCategoryLabel(cat) {
  const map = {
    'bracelets': 'Bracelets',
    'necklaces': 'Necklaces',
    'waist-beads': 'Waist Beads',
    'anklets': 'Anklets',
    'bags': 'Beaded Bags',
    'phone-charms': 'Phone Charms',
    'keychains': 'Keychains',
    'gift-sets': 'Gift Sets'
  };
  return map[cat] || cat;
}

/**
 * Safe LocalStorage getter with fallback
 * @param {string} key
 * @param {*} defaultValue
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`LocalStorage read error for key "${key}":`, e);
    return defaultValue;
  }
}

/**
 * Safe LocalStorage setter
 * @param {string} key
 * @param {*} value
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`LocalStorage write error for key "${key}":`, e);
    return false;
  }
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'info'|'gold'} type
 */
export function showToast(message, type = 'gold') {
  let container = document.getElementById('bint-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bint-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Icon
  const iconSvg = `
    <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-message">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 3500);
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[match]));
}

/**
 * Generate contextual WhatsApp link with encoded message
 * @param {string} message
 */
export function getWhatsAppLink(message = '') {
  const phone = BINT_CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message || 'Hello Bint & Beads, I would like to inquire about your handcrafted collection.');
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Fallback image placeholder generator
 */
export function getFallbackImage(title = 'BINT & BEADS') {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="none">
      <rect width="600" height="750" fill="#161616"/>
      <circle cx="300" cy="350" r="100" stroke="#C6A15B" stroke-width="1.5" stroke-dasharray="4 6"/>
      <text x="300" y="355" fill="#C6A15B" font-family="serif" font-size="22" letter-spacing="4" text-anchor="middle">BINT &amp; BEADS</text>
      <text x="300" y="390" fill="#77736D" font-family="sans-serif" font-size="12" letter-spacing="2" text-anchor="middle">${title.toUpperCase()}</text>
    </svg>
  `)}`;
}

/**
 * Render reusable HTML for a product card
 * @param {Object} product
 * @param {Object} options
 */
export function renderProductCard(product, options = {}) {
  const isWishlisted = options.isWishlisted || false;
  const primaryImg = product.images[0] || getFallbackImage(product.name);
  const secondaryImg = product.images[1] || null;

  const badgeHtml = product.badge ? `
    <div class="product-card-badges">
      <span class="badge ${getBadgeClass(product.badge)}">${product.badge}</span>
    </div>` : '';

  const secondaryImgHtml = secondaryImg ? `
    <img class="product-card-image secondary-img" src="${secondaryImg}" alt="${escapeHtml(product.name)} view 2" loading="lazy" onerror="this.src='${getFallbackImage(product.name)}'">` : '';

  const oldPriceHtml = product.oldPrice ? `
    <span class="price-old">${formatCurrency(product.oldPrice)}</span>` : '';

  const swatchesHtml = product.colours && product.colours.length > 1 ? `
    <div class="product-card-swatches">
      ${product.colours.map(c => `
        <span class="swatch-dot" style="background-color: ${getColorHex(c)}" title="${escapeHtml(c)}"></span>
      `).join('')}
    </div>` : '';

  return `
    <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
      <div class="product-card-image-wrap">
        ${badgeHtml}
        <button type="button" class="product-card-wishlist ${isWishlisted ? 'active' : ''}" 
                data-wishlist-id="${product.id}" 
                aria-label="Save ${escapeHtml(product.name)} to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product.html?id=${product.id}" class="product-card-link-wrap">
          <img class="product-card-image primary-img" src="${primaryImg}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='${getFallbackImage(product.name)}'">
          ${secondaryImgHtml}
        </a>
        <button type="button" class="product-card-quick-add" data-quick-add="${product.id}">
          Quick Add &bull; ${formatCurrency(product.price)}
        </button>
      </div>

      <div class="product-card-info">
        <span class="product-card-category">${getCategoryLabel(product.category)}</span>
        <h3 class="product-card-title">
          <a href="product.html?id=${product.id}">${escapeHtml(product.name)}</a>
        </h3>
        <div class="product-card-price-row">
          <span class="price-current">${formatCurrency(product.price)}</span>
          ${oldPriceHtml}
        </div>
        ${swatchesHtml}
      </div>
    </article>
  `;
}

function getBadgeClass(badge) {
  const map = {
    'NEW': 'badge-new',
    'BESTSELLER': 'badge-bestseller',
    'ONE OF ONE': 'badge-oneofone',
    'READY TO SHIP': 'badge-ready',
    'MADE TO ORDER': 'badge-custom'
  };
  return map[badge] || 'badge-new';
}

export function getColorHex(name) {
  const map = {
    'Black': '#111111',
    'Gold': '#C6A15B',
    'Silver': '#D4D4D8',
    'White': '#FFFFFF',
    'Cream': '#F5EFEB',
    'Brown': '#784D2B',
    'Emerald': '#1E5838',
    'Royal Blue': '#1E3A8A',
    'Burgundy': '#6B1D2F',
    'Red': '#A92323',
    'Pink': '#E8B4B8',
    'Purple': '#582C66'
  };
  return map[name] || '#C6A15B';
}
