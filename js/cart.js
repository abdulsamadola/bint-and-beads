(function() {
  'use strict';

  const BINT = window.BINT || {};
  const BINT_CONFIG = BINT.CONFIG || {};
  const utils = BINT.utils || {};
  const state = BINT.state || {};

  const formatCurrency = utils.formatCurrency || (n => `₦${Number(n).toLocaleString()}`);
  const escapeHtml = utils.escapeHtml || (s => s);
  const showToast = utils.showToast || console.log;
  const getStorage = utils.getStorage || ((k, d) => d);
  const setStorage = utils.setStorage || (() => {});
  const getCart = state.getCart || (() => []);
  const updateQuantity = state.updateQuantity || (() => {});
  const removeFromCart = state.removeFromCart || (() => {});
  const getCartSubtotal = state.getCartSubtotal || (() => 0);
  const toggleWishlist = state.toggleWishlist || (() => false);

class CartPage {
  constructor() {
    this.selectedPackaging = getStorage('bint_selected_packaging', 'signature');
    this.init();
  }

  init() {
    this.renderCart();
    this.bindEvents();

    window.addEventListener('bint:cart-updated', () => {
      this.renderCart();
    });
  }

  bindEvents() {
    // Listen for packaging radio change
    document.querySelectorAll('[name="cart_packaging"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPackaging = e.target.value;
        setStorage('bint_selected_packaging', this.selectedPackaging);
        this.updateSummary();
        showToast('Packaging preference updated', 'info');
      });
    });
  }

  renderCart() {
    const itemsContainer = document.getElementById('cart-page-items');
    const emptyContainer = document.getElementById('cart-page-empty');
    const summaryCard = document.getElementById('cart-page-summary');
    if (!itemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
      if (itemsContainer) itemsContainer.style.display = 'none';
      if (summaryCard) summaryCard.style.display = 'none';
      if (emptyContainer) emptyContainer.style.display = 'block';
      return;
    }

    if (itemsContainer) itemsContainer.style.display = 'flex';
    if (summaryCard) summaryCard.style.display = 'block';
    if (emptyContainer) emptyContainer.style.display = 'none';

    itemsContainer.innerHTML = cart.map(item => {
      let customHtml = '';
      if (item.isCustom && item.customConfig) {
        const c = item.customConfig;
        customHtml = `
          <div class="cart-custom-badge-box">
            <strong>Bint Custom Studio Piece</strong><br>
            ${c.nameText ? `Name Inscription: <strong>${escapeHtml(c.nameText)}</strong> &bull; ` : ''}
            Finish: ${escapeHtml(c.letterFinish || 'Gold')} &bull; Charm: ${escapeHtml(c.charm || 'None')} &bull; Style: ${escapeHtml(c.style || 'Signature')}
          </div>
        `;
      }

      return `
        <article class="cart-page-item" data-cart-id="${item.id}">
          <img class="cart-page-item-img" src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='${getFallbackImage(item.name)}'">
          
          <div class="cart-page-item-details">
            <span class="text-meta" style="font-size: 0.6875rem;">Handcrafted Silhouette</span>
            <h3><a href="${item.isCustom ? 'customize.html' : `product.html?id=${item.productId}`}">${escapeHtml(item.name)}</a></h3>
            <div class="cart-page-item-meta">
              Colour: <strong>${escapeHtml(item.colour)}</strong> &bull; Size: <strong>${escapeHtml(item.size)}</strong>
            </div>
            ${customHtml}
            <div class="cart-page-item-price">${formatCurrency(item.price)}</div>

            <div class="cart-item-utility-links">
              ${!item.isCustom ? `<button type="button" class="cart-link-btn" data-cart-action="save-wishlist" data-id="${item.id}" data-pid="${item.productId}">Save for Later</button>` : ''}
              <button type="button" class="cart-link-btn remove" data-cart-action="remove" data-id="${item.id}">Remove</button>
            </div>
          </div>

          <div class="cart-page-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn" data-cart-action="dec" data-id="${item.id}" aria-label="Decrease quantity">&minus;</button>
              <span class="qty-input" style="line-height: 48px;">${item.quantity}</span>
              <button type="button" class="qty-btn" data-cart-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach row events
    itemsContainer.querySelectorAll('[data-cart-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-cart-action');
        const id = btn.getAttribute('data-id');
        const pid = btn.getAttribute('data-pid');

        if (action === 'inc') {
          updateQuantity(id, 1);
        } else if (action === 'dec') {
          updateQuantity(id, -1);
        } else if (action === 'remove') {
          removeFromCart(id);
        } else if (action === 'save-wishlist') {
          if (pid) {
            toggleWishlist(pid);
            removeFromCart(id);
          }
        }
      });
    });

    this.updateSummary();
  }

  updateSummary() {
    const subtotal = getCartSubtotal();
    const pkgOption = BINT_CONFIG.packagingOptions.find(p => p.id === this.selectedPackaging) || BINT_CONFIG.packagingOptions[0];
    const pkgPrice = pkgOption.price;
    const total = subtotal + pkgPrice;

    const subtotalEl = document.getElementById('summary-subtotal');
    const pkgTitleEl = document.getElementById('summary-packaging-title');
    const pkgPriceEl = document.getElementById('summary-packaging-price');
    const totalEl = document.getElementById('summary-total');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (pkgTitleEl) pkgTitleEl.textContent = pkgOption.name;
    if (pkgPriceEl) pkgPriceEl.textContent = pkgPrice === 0 ? 'Complimentary' : formatCurrency(pkgPrice);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    // Sync packaging radio selected state
    document.querySelectorAll('[name="cart_packaging"]').forEach(r => {
      r.checked = (r.value === this.selectedPackaging);
      const parentCard = r.closest('.packaging-radio-card');
      if (parentCard) parentCard.classList.toggle('selected', r.checked);
    });
  }
}

  function initCart() {
    window.cartPage = new CartPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }
})();
