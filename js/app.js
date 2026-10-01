/**
 * BINT & BEADS - Global Application Controller
 * Handles header, announcement bar, mobile drawer, search modal, cart drawer, and footer interactions.
 */
import { BINT_CONFIG } from './data/config.js';
import { PRODUCTS } from './data/products.js';
import { 
  formatCurrency, 
  escapeHtml, 
  getProductById, 
  showToast, 
  getFallbackImage 
} from './utils.js';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  getCartCount, 
  getCartSubtotal, 
  getWishlist, 
  toggleWishlist 
} from './state.js';

class BintApp {
  constructor() {
    this.cartDrawerOpen = false;
    this.searchModalOpen = false;
    this.mobileDrawerOpen = false;
    this.init();
  }

  init() {
    this.renderGlobalElements();
    this.bindEvents();
    this.updateBadges();
    this.initAnnouncementTicker();
  }

  /**
   * Render Announcement, Header, Drawers, and Footer if containers exist
   */
  renderGlobalElements() {
    // 1. Announcement Bar
    const announcementContainer = document.getElementById('bint-announcement-bar');
    if (announcementContainer && !announcementContainer.innerHTML.trim()) {
      announcementContainer.className = 'announcement-bar';
      announcementContainer.innerHTML = `
        <div class="announcement-text" id="announcement-ticker">
          Complimentary signature packaging on all orders &bull; Handcrafted in Lagos, Dispatched Worldwide
        </div>
      `;
    }

    // 2. Global Header
    const headerContainer = document.getElementById('bint-header');
    if (headerContainer && !headerContainer.innerHTML.trim()) {
      headerContainer.className = 'site-header';
      headerContainer.innerHTML = `
        <div class="container header-inner">
          <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Open mobile navigation menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="index.html" class="header-brand">
            <span class="brand-name">BINT &amp; BEADS</span>
            <span class="brand-tagline">LAGOS &bull; HANDCRAFTED</span>
          </a>

          <nav class="header-nav" aria-label="Main Navigation">
            <a href="index.html" class="nav-link" data-nav="home">Home</a>
            <a href="shop.html" class="nav-link" data-nav="shop">Shop</a>
            <a href="collections.html" class="nav-link" data-nav="collections">Collections</a>
            <a href="customize.html" class="nav-link nav-link-highlight" data-nav="customize">Customise</a>
            <a href="about.html" class="nav-link" data-nav="about">Our Story</a>
            <a href="reviews.html" class="nav-link" data-nav="reviews">Reviews</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="header-action-btn" id="search-toggle-btn" aria-label="Open search catalogue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <a href="wishlist.html" class="header-action-btn" id="wishlist-link-btn" aria-label="View saved wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="header-action-badge" id="wishlist-badge-count">0</span>
            </a>

            <button type="button" class="header-action-btn" id="cart-drawer-toggle" aria-label="Open shopping bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="header-action-badge" id="cart-badge-count">0</span>
            </button>
          </div>
        </div>
      `;
      this.highlightActiveNavLink();
    }

    // 3. Inject Overlays & Drawers (Mobile Drawer, Cart Drawer, Search Overlay)
    this.injectDrawers();

    // 4. Global Footer
    const footerContainer = document.getElementById('bint-footer');
    if (footerContainer && !footerContainer.innerHTML.trim()) {
      footerContainer.className = 'site-footer';
      footerContainer.innerHTML = `
        <div class="container">
          <!-- Newsletter Box -->
          <div class="footer-newsletter-box">
            <div class="newsletter-text">
              <h3>ENTER THE WORLD OF BINT &amp; BEADS</h3>
              <p>Receive preview access to limited bead capsules, private bespoke slots, and studio essays.</p>
            </div>
            <form class="newsletter-form" id="newsletter-form">
              <input type="email" class="newsletter-input" placeholder="Enter your email address" required aria-label="Email address for newsletter">
              <button type="submit" class="btn btn-gold btn-sm">Subscribe</button>
            </form>
          </div>

          <div class="footer-top-grid">
            <div class="footer-brand-col">
              <div class="brand-name">BINT &amp; BEADS</div>
              <div class="brand-tagline">CONTEMPORARY HANDCRAFTED LUXURY</div>
              <p>Dedicated to elevating the sacred tradition of African bead craftsmanship. Each piece is thoughtfully composed by hand in our Lagos atelier to reflect individuality, poise, and personal heritage.</p>
              <div class="text-meta" style="color: var(--color-gold);">LAGOS &bull; LONDON &bull; ACCRA</div>
            </div>

            <div class="footer-col">
              <h4>SHOP</h4>
              <ul>
                <li><a href="shop.html?filter=newArrival">New Arrivals</a></li>
                <li><a href="shop.html?filter=bestSeller">Most Loved</a></li>
                <li><a href="collections.html">Collections</a></li>
                <li><a href="customize.html">Custom Studio</a></li>
                <li><a href="shop.html?category=gift-sets">The Gift Edit</a></li>
                <li><a href="shop.html?readyToShip=true">Ready to Ship</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>ABOUT</h4>
              <ul>
                <li><a href="about.html">Our Story</a></li>
                <li><a href="about.html#craftsmanship">Artisan Craftsmanship</a></li>
                <li><a href="reviews.html">Client Stories &amp; Reviews</a></li>
                <li><a href="customize.html#bespoke">Bespoke Inquiries</a></li>
                <li><a href="track-order.html">Track Your Order</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>HELP &amp; CONCIERGE</h4>
              <ul>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="faq.html">FAQ &amp; Sizing Guide</a></li>
                <li><a href="faq.html#delivery">Delivery &amp; Courier</a></li>
                <li><a href="faq.html#care">Bead Care &amp; Longevity</a></li>
                <li><a href="https://wa.me/2348000002468" target="_blank" rel="noopener">WhatsApp Concierge</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>&copy; ${new Date().getFullYear()} BINT &amp; BEADS. All rights reserved. Handcrafted with intention.</div>
            <div class="footer-bottom-links">
              <a href="faq.html#terms">Terms of Service</a>
              <a href="faq.html#privacy">Privacy Policy</a>
              <a href="track-order.html">Order Status</a>
            </div>
          </div>
        </div>
      `;
    }
  }

  injectDrawers() {
    let drawerContainer = document.getElementById('bint-global-drawers');
    if (!drawerContainer) {
      drawerContainer = document.createElement('div');
      drawerContainer.id = 'bint-global-drawers';
      document.body.appendChild(drawerContainer);
    }

    drawerContainer.innerHTML = `
      <!-- Mobile Navigation Drawer -->
      <div class="mobile-drawer-overlay" id="mobile-drawer-overlay" aria-hidden="true">
        <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div class="mobile-drawer-header">
            <span class="brand-name" style="font-size: 1.3rem;">BINT &amp; BEADS</span>
            <button type="button" class="modal-close-btn" id="mobile-drawer-close" aria-label="Close navigation menu">&times;</button>
          </div>
          <nav class="mobile-drawer-nav">
            <a href="index.html" class="mobile-drawer-link">Home</a>
            <a href="shop.html" class="mobile-drawer-link">Shop Collection</a>
            <a href="collections.html" class="mobile-drawer-link">Collections</a>
            <a href="customize.html" class="mobile-drawer-link" style="color: var(--color-deep-gold);">Bint Custom Studio</a>
            <a href="about.html" class="mobile-drawer-link">Our Story</a>
            <a href="reviews.html" class="mobile-drawer-link">Customer Reviews</a>
          </nav>
          <div class="mobile-drawer-secondary">
            <a href="wishlist.html" class="mobile-secondary-link">&hearts; Saved Wishlist</a>
            <a href="track-order.html" class="mobile-secondary-link">&boxbox; Track An Order</a>
            <a href="contact.html" class="mobile-secondary-link">&phone; Concierge / WhatsApp</a>
            <a href="faq.html" class="mobile-secondary-link">&#9432; FAQ &amp; Sizing</a>
          </div>
          <div class="mobile-drawer-footer">
            <div>LAGOS, NIGERIA</div>
            <div style="margin-top: 4px; color: var(--color-gold);">Complimentary packaging included</div>
          </div>
        </div>
      </div>

      <!-- Cart Drawer -->
      <div class="cart-drawer-overlay" id="cart-drawer-overlay" aria-hidden="true">
        <div class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          <div class="cart-drawer-header">
            <h2 class="cart-drawer-title">YOUR BAG (<span id="cart-drawer-count">0</span>)</h2>
            <button type="button" class="modal-close-btn" id="cart-drawer-close" aria-label="Close shopping bag">&times;</button>
          </div>
          <div class="cart-drawer-body" id="cart-drawer-items">
            <!-- Dynamic Cart Items -->
          </div>
          <div class="cart-drawer-footer" id="cart-drawer-footer-sec">
            <div class="cart-subtotal-row">
              <span class="cart-subtotal-label">Subtotal</span>
              <span class="cart-subtotal-val" id="cart-drawer-subtotal">₦0</span>
            </div>
            <p class="cart-shipping-note">Taxes &amp; simulated shipping calculated at checkout. Complimentary luxury packaging available.</p>
            <div class="cart-drawer-btns">
              <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
              <a href="cart.html" class="btn btn-secondary btn-block">View Full Bag</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Search Overlay -->
      <div class="search-modal-overlay" id="search-modal-overlay" aria-hidden="true">
        <div class="search-modal-container">
          <div class="container">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
              <button type="button" class="modal-close-btn" id="search-modal-close" aria-label="Close search" style="position: static;">&times;</button>
            </div>
            <div class="search-input-wrap">
              <input type="text" class="search-main-input" id="search-live-input" placeholder="Search bracelets, waist beads, pearls..." autofocus aria-label="Search products">
            </div>
            <div class="search-quick-tags">
              <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-grey); margin-right: 4px;">Popular:</span>
              <button type="button" class="search-tag" data-tag="Noir">Noir</button>
              <button type="button" class="search-tag" data-tag="Pearl">Baroque Pearl</button>
              <button type="button" class="search-tag" data-tag="Gold">Gold Spacers</button>
              <button type="button" class="search-tag" data-tag="Waist">Waist Beads</button>
              <button type="button" class="search-tag" data-tag="Bag">Beaded Bag</button>
              <button type="button" class="search-tag" data-tag="Custom">Custom</button>
            </div>
            <div id="search-live-results" class="search-results-grid">
              <!-- Live results inject here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.header-nav .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  bindEvents() {
    // Header scroll event
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const mobileClose = document.getElementById('mobile-drawer-close');
    const mobileOverlay = document.getElementById('mobile-drawer-overlay');

    if (mobileBtn && mobileOverlay) {
      mobileBtn.addEventListener('click', () => this.toggleMobileDrawer(true));
      if (mobileClose) mobileClose.addEventListener('click', () => this.toggleMobileDrawer(false));
      mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) this.toggleMobileDrawer(false);
      });
    }

    // Cart drawer toggle
    const cartToggle = document.getElementById('cart-drawer-toggle');
    const cartClose = document.getElementById('cart-drawer-close');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    if (cartToggle && cartOverlay) {
      cartToggle.addEventListener('click', () => this.openCartDrawer());
      if (cartClose) cartClose.addEventListener('click', () => this.closeCartDrawer());
      cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) this.closeCartDrawer();
      });
    }

    // Search modal toggle
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchClose = document.getElementById('search-modal-close');
    const searchOverlay = document.getElementById('search-modal-overlay');
    const searchInput = document.getElementById('search-live-input');

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => this.openSearchModal());
      if (searchClose) searchClose.addEventListener('click', () => this.closeSearchModal());
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) this.closeSearchModal();
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.handleLiveSearch(e.target.value));
      }

      // Popular tag clicks
      document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = tag.getAttribute('data-tag');
            this.handleLiveSearch(searchInput.value);
            searchInput.focus();
          }
        });
      });
    }

    // Global keyboard listener (Escape key closes open drawers)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.cartDrawerOpen) this.closeCartDrawer();
        if (this.searchModalOpen) this.closeSearchModal();
        if (this.mobileDrawerOpen) this.toggleMobileDrawer(false);
      }
    });

    // Listen for state change events
    window.addEventListener('bint:cart-updated', () => {
      this.updateBadges();
      if (this.cartDrawerOpen) {
        this.renderCartDrawerItems();
      }
    });

    window.addEventListener('bint:wishlist-updated', () => {
      this.updateBadges();
      this.syncWishlistButtons();
    });

    // Delegated click listeners for quick add & wishlist
    document.addEventListener('click', (e) => {
      // Quick add
      const quickAddBtn = e.target.closest('[data-quick-add]');
      if (quickAddBtn) {
        e.preventDefault();
        const pid = quickAddBtn.getAttribute('data-quick-add');
        const product = getProductById(pid);
        if (product) {
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            colour: product.colours[0] || 'Default',
            size: product.sizes[0] || 'Standard',
            quantity: 1
          });
          this.openCartDrawer();
        }
      }

      // Wishlist toggle
      const wishlistBtn = e.target.closest('[data-wishlist-id]');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = wishlistBtn.getAttribute('data-wishlist-id');
        const isNowSaved = toggleWishlist(pid);
        wishlistBtn.classList.toggle('active', isNowSaved);
        const svg = wishlistBtn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', isNowSaved ? 'currentColor' : 'none');
        }
      }
    });

    // Newsletter submit simulation
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input[type="email"]');
        if (input && input.value) {
          showToast(`Welcome to the world of Bint & Beads. Invitation sent to ${input.value}.`, 'gold');
          input.value = '';
        }
      });
    }
  }

  toggleMobileDrawer(open) {
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (!overlay) return;
    this.mobileDrawerOpen = open;
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  openCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!overlay) return;
    this.cartDrawerOpen = true;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.renderCartDrawerItems();
  }

  closeCartDrawer() {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!overlay) return;
    this.cartDrawerOpen = false;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openSearchModal() {
    const overlay = document.getElementById('search-modal-overlay');
    const input = document.getElementById('search-live-input');
    if (!overlay) return;
    this.searchModalOpen = true;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (input) {
      setTimeout(() => input.focus(), 150);
      this.handleLiveSearch(input.value || '');
    }
  }

  closeSearchModal() {
    const overlay = document.getElementById('search-modal-overlay');
    if (!overlay) return;
    this.searchModalOpen = false;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  handleLiveSearch(term) {
    const resultsContainer = document.getElementById('search-live-results');
    if (!resultsContainer) return;

    const query = (term || '').trim().toLowerCase();
    let matches = [];

    if (!query) {
      // Show curated picks
      matches = PRODUCTS.slice(0, 4);
    } else {
      matches = PRODUCTS.filter(p => {
        return p.name.toLowerCase().includes(query) ||
               p.category.toLowerCase().includes(query) ||
               p.collection.toLowerCase().includes(query) ||
               p.description.toLowerCase().includes(query) ||
               (p.colours && p.colours.some(c => c.toLowerCase().includes(query)));
      }).slice(0, 8);
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 0;">
          <p style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-black);">No handcrafted pieces found for "${escapeHtml(term)}"</p>
          <p style="font-size: 0.85rem; color: var(--color-grey); margin-top: 6px;">Try searching for "Gold", "Baroque", "Obsidian", or "Bag".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <a href="product.html?id=${p.id}" class="search-result-item">
        <img class="search-result-img" src="${p.images[0]}" alt="${escapeHtml(p.name)}" onerror="this.src='${getFallbackImage(p.name)}'">
        <div class="search-result-details">
          <h4>${this.highlightMatch(p.name, query)}</h4>
          <span>${formatCurrency(p.price)}</span>
        </div>
      </a>
    `).join('');
  }

  highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(text).replace(regex, '<span style="color: var(--color-gold); font-weight: 700;">$1</span>');
  }

  renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const countEl = document.getElementById('cart-drawer-count');
    const footerSec = document.getElementById('cart-drawer-footer-sec');
    if (!container) return;

    const cart = getCart();
    const count = getCartCount();
    const subtotal = getCartSubtotal();

    if (countEl) countEl.textContent = count;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 40px 10px;">
          <div class="empty-state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 class="empty-state-title" style="font-size: 1.35rem;">Your bag is empty</h3>
          <p class="empty-state-desc" style="font-size: 0.85rem;">Discover our handcrafted collection or compose a personalized creation in our studio.</p>
          <a href="shop.html" class="btn btn-secondary btn-sm" onclick="document.getElementById('cart-drawer-close').click();">Explore The Collection</a>
        </div>
      `;
      if (footerSec) footerSec.style.display = 'none';
      return;
    }

    if (footerSec) footerSec.style.display = 'flex';

    container.innerHTML = cart.map(item => {
      let customDetails = '';
      if (item.isCustom && item.customConfig) {
        const c = item.customConfig;
        customDetails = `
          <div style="font-size: 0.725rem; color: var(--color-deep-gold); background: var(--color-cream); padding: 4px 6px; border-radius: 2px; margin-top: 4px;">
            ${c.nameText ? `Name: <strong>${escapeHtml(c.nameText)}</strong> &bull; ` : ''}
            Finish: ${escapeHtml(c.letterFinish || '')} &bull; Charm: ${escapeHtml(c.charm || 'None')}
          </div>
        `;
      }

      return `
        <div class="cart-item" data-cart-id="${item.id}">
          <img class="cart-item-img" src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='${getFallbackImage(item.name)}'">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
            <div class="cart-item-meta">${escapeHtml(item.colour)} / ${escapeHtml(item.size)}</div>
            ${customDetails}
            <div class="cart-item-price">${formatCurrency(item.price)}</div>
            <div class="qty-control" style="height: 32px; margin-top: 6px;">
              <button type="button" class="qty-btn" data-cart-action="dec" data-id="${item.id}" style="width: 28px; font-size: 0.9rem;">&minus;</button>
              <span style="width: 32px; text-align: center; font-size: 0.85rem; font-weight: 600;">${item.quantity}</span>
              <button type="button" class="qty-btn" data-cart-action="inc" data-id="${item.id}" style="width: 28px; font-size: 0.9rem;">+</button>
            </div>
          </div>
          <div class="cart-item-actions">
            <button type="button" class="cart-item-remove" data-cart-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach cart actions
    container.querySelectorAll('[data-cart-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-cart-action');
        const id = btn.getAttribute('data-id');
        if (action === 'inc') {
          updateQuantity(id, 1);
        } else if (action === 'dec') {
          updateQuantity(id, -1);
        } else if (action === 'remove') {
          removeFromCart(id);
        }
      });
    });
  }

  updateBadges() {
    const cartBadge = document.getElementById('cart-badge-count');
    const wishlistBadge = document.getElementById('wishlist-badge-count');
    const count = getCartCount();
    const wishlist = getWishlist();

    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
      wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  syncWishlistButtons() {
    const wishlist = getWishlist();
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const pid = parseInt(btn.getAttribute('data-wishlist-id'), 10);
      const isSaved = wishlist.includes(pid);
      btn.classList.toggle('active', isSaved);
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      }
    });
  }

  initAnnouncementTicker() {
    const ticker = document.getElementById('announcement-ticker');
    if (!ticker) return;

    const messages = [
      'Complimentary signature packaging on all orders &bull; Handcrafted in Lagos, Dispatched Worldwide',
      'The Bridal Edit is now live &bull; Baroque pearls for timeless ceremonies',
      'Custom Studio &bull; Compose your personalized beaded talisman in 7 simple steps',
      'Doorstep Delivery across Nigeria &bull; Studio collection available in Victoria Island'
    ];

    let index = 0;
    setInterval(() => {
      index = (index + 1) % messages.length;
      ticker.style.opacity = '0';
      setTimeout(() => {
        ticker.innerHTML = messages[index];
        ticker.style.opacity = '1';
      }, 300);
    }, 5500);
  }
}

// Instantiate global app on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.bintApp = new BintApp();
});
