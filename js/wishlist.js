/**
 * BINT & BEADS - Universal Wishlist Page Controller
 */
(function() {
  'use strict';

  const BINT = window.BINT || {};
  const utils = BINT.utils || {};
  const state = BINT.state || {};

  const getProductById = utils.getProductById || (id => (BINT.PRODUCTS || []).find(p => p.id === Number(id)));
  const renderProductCard = utils.renderProductCard || (() => '');
  const getWishlist = state.getWishlist || (() => []);

  class WishlistPage {
    constructor() {
      this.init();
    }

    init() {
      this.renderWishlist();

      window.addEventListener('bint:wishlist-updated', () => {
        this.renderWishlist();
      });
    }

    renderWishlist() {
      const grid = document.getElementById('wishlist-grid');
      const emptyState = document.getElementById('wishlist-empty-state');
      const countEl = document.getElementById('wishlist-count-display');
      if (!grid) return;

      const savedIds = getWishlist();
      const savedProducts = savedIds.map(id => getProductById(id)).filter(Boolean);

      if (countEl) {
        countEl.textContent = `${savedProducts.length} ${savedProducts.length === 1 ? 'Piece' : 'Pieces'} Saved`;
      }

      if (savedProducts.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      grid.style.display = 'grid';
      if (emptyState) emptyState.style.display = 'none';

      grid.innerHTML = savedProducts.map(p => {
        return renderProductCard(p, { isWishlisted: true });
      }).join('');
    }
  }

  function initWishlist() {
    window.wishlistPage = new WishlistPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWishlist);
  } else {
    initWishlist();
  }
})();
