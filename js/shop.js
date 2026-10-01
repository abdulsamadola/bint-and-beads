/**
 * BINT & BEADS - Shop & Catalogue Logic
 * Universal implementation supporting both module and standard script execution.
 */
(function() {
  'use strict';

  function initShopCatalogue() {
    const products = (window.BINT && window.BINT.PRODUCTS) || [];
    const utils = (window.BINT && window.BINT.utils) || {};
    const state = (window.BINT && window.BINT.state) || {};

    const filters = {
      categories: new Set(),
      collections: new Set(),
      colours: new Set(),
      priceRange: null,
      customizableOnly: false,
      readyToShipOnly: false,
      statusFilter: null,
      searchQuery: ''
    };

    let sortBy = 'featured';

    // Parse URL Query Params
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) filters.categories.add(params.get('category').toLowerCase());
    if (params.has('collection')) filters.collections.add(params.get('collection').toLowerCase());
    if (params.has('colour')) filters.colours.add(params.get('colour'));
    if (params.has('readyToShip')) filters.readyToShipOnly = params.get('readyToShip') === 'true';
    if (params.has('customizable')) filters.customizableOnly = params.get('customizable') === 'true';
    if (params.has('filter')) filters.statusFilter = params.get('filter');
    if (params.has('search')) filters.searchQuery = params.get('search');
    if (params.has('sort')) sortBy = params.get('sort');

    const sortSelect = document.getElementById('shop-sort-select');
    if (sortSelect) {
      sortSelect.value = sortBy;
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        applyFilters();
      });
    }

    // Category Checkboxes
    document.querySelectorAll('[data-filter-category]').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.getAttribute('data-filter-category');
        if (cb.checked) filters.categories.add(val);
        else filters.categories.delete(val);
        syncFormControls();
        applyFilters();
      });
    });

    // Collection Checkboxes
    document.querySelectorAll('[data-filter-collection]').forEach(cb => {
      cb.addEventListener('change', () => {
        const val = cb.getAttribute('data-filter-collection');
        if (cb.checked) filters.collections.add(val);
        else filters.collections.delete(val);
        syncFormControls();
        applyFilters();
      });
    });

    // Price Radios
    document.querySelectorAll('[data-filter-price]').forEach(rb => {
      rb.addEventListener('change', () => {
        if (rb.checked) filters.priceRange = rb.getAttribute('data-filter-price');
        syncFormControls();
        applyFilters();
      });
    });

    // Availability & Custom flags
    document.querySelectorAll('[data-filter-ready]').forEach(cb => {
      cb.addEventListener('change', () => {
        filters.readyToShipOnly = cb.checked;
        syncFormControls();
        applyFilters();
      });
    });

    document.querySelectorAll('[data-filter-custom]').forEach(cb => {
      cb.addEventListener('change', () => {
        filters.customizableOnly = cb.checked;
        syncFormControls();
        applyFilters();
      });
    });

    // Color Swatches
    document.querySelectorAll('.color-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.getAttribute('data-color');
        if (filters.colours.has(col)) {
          filters.colours.delete(col);
          btn.classList.remove('selected');
        } else {
          filters.colours.add(col);
          btn.classList.add('selected');
        }
        applyFilters();
      });
    });

    // Mobile Drawer
    const mobileTrigger = document.getElementById('filter-mobile-trigger');
    const drawerOverlay = document.getElementById('filter-drawer-overlay');
    const drawerClose = document.getElementById('filter-drawer-close');
    const drawerApply = document.getElementById('filter-drawer-apply');

    if (mobileTrigger && drawerOverlay) {
      mobileTrigger.addEventListener('click', () => {
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      const closeDrawer = () => {
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
      if (drawerApply) drawerApply.addEventListener('click', closeDrawer);
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeDrawer();
      });
    }

    function syncFormControls() {
      document.querySelectorAll('[data-filter-category]').forEach(cb => {
        cb.checked = filters.categories.has(cb.getAttribute('data-filter-category'));
      });
      document.querySelectorAll('[data-filter-collection]').forEach(cb => {
        cb.checked = filters.collections.has(cb.getAttribute('data-filter-collection'));
      });
      if (filters.priceRange) {
        document.querySelectorAll(`[data-filter-price="${filters.priceRange}"]`).forEach(r => r.checked = true);
      }
      document.querySelectorAll('[data-filter-ready]').forEach(cb => {
        cb.checked = filters.readyToShipOnly;
      });
      document.querySelectorAll('[data-filter-custom]').forEach(cb => {
        cb.checked = filters.customizableOnly;
      });
      document.querySelectorAll('.color-filter-btn').forEach(btn => {
        btn.classList.toggle('selected', filters.colours.has(btn.getAttribute('data-color')));
      });
    }

    function applyFilters() {
      let result = [...products];

      if (filters.categories.size > 0) {
        result = result.filter(p => filters.categories.has(p.category));
      }

      if (filters.collections.size > 0) {
        result = result.filter(p => filters.collections.has(p.collection));
      }

      if (filters.colours.size > 0) {
        result = result.filter(p => p.colours && p.colours.some(c => filters.colours.has(c)));
      }

      if (filters.priceRange === 'under-30k') {
        result = result.filter(p => p.price < 30000);
      } else if (filters.priceRange === '30k-60k') {
        result = result.filter(p => p.price >= 30000 && p.price <= 60000);
      } else if (filters.priceRange === 'above-60k') {
        result = result.filter(p => p.price > 60000);
      }

      if (filters.readyToShipOnly) {
        result = result.filter(p => p.readyToShip);
      }

      if (filters.customizableOnly) {
        result = result.filter(p => p.customizable);
      }

      if (filters.statusFilter === 'newArrival') {
        result = result.filter(p => p.newArrival || p.badge === 'NEW');
      } else if (filters.statusFilter === 'bestSeller') {
        result = result.filter(p => p.bestSeller);
      }

      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        result = result.filter(p => {
          return p.name.toLowerCase().includes(q) ||
                 p.category.toLowerCase().includes(q) ||
                 p.description.toLowerCase().includes(q);
        });
      }

      if (sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      } else if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else {
        result.sort((a, b) => {
          const scoreA = (a.featured ? 2 : 0) + (a.bestSeller ? 1 : 0);
          const scoreB = (b.featured ? 2 : 0) + (b.bestSeller ? 1 : 0);
          return scoreB - scoreA;
        });
      }

      renderActiveChips();
      renderGrid(result);
    }

    function renderActiveChips() {
      const bar = document.getElementById('active-filters-bar');
      if (!bar) return;
      const chips = [];

      filters.categories.forEach(cat => {
        chips.push({
          label: `Category: ${utils.getCategoryLabel(cat)}`,
          remove: () => { filters.categories.delete(cat); syncFormControls(); applyFilters(); }
        });
      });

      filters.collections.forEach(col => {
        chips.push({
          label: `Collection: ${col.toUpperCase()}`,
          remove: () => { filters.collections.delete(col); syncFormControls(); applyFilters(); }
        });
      });

      filters.colours.forEach(col => {
        chips.push({
          label: `Colour: ${col}`,
          remove: () => { filters.colours.delete(col); syncFormControls(); applyFilters(); }
        });
      });

      if (filters.priceRange) {
        chips.push({
          label: filters.priceRange === 'under-30k' ? 'Under ₦30k' : (filters.priceRange === '30k-60k' ? '₦30k – ₦60k' : 'Above ₦60k'),
          remove: () => {
            filters.priceRange = null;
            document.querySelectorAll('[data-filter-price]').forEach(r => r.checked = false);
            applyFilters();
          }
        });
      }

      if (filters.readyToShipOnly) {
        chips.push({
          label: 'Ready To Ship',
          remove: () => { filters.readyToShipOnly = false; syncFormControls(); applyFilters(); }
        });
      }

      if (filters.customizableOnly) {
        chips.push({
          label: 'Customisable',
          remove: () => { filters.customizableOnly = false; syncFormControls(); applyFilters(); }
        });
      }

      if (filters.statusFilter) {
        chips.push({
          label: filters.statusFilter === 'newArrival' ? 'New Arrivals' : 'Most Loved',
          remove: () => { filters.statusFilter = null; applyFilters(); }
        });
      }

      if (chips.length === 0) {
        bar.innerHTML = '';
        return;
      }

      bar.innerHTML = `
        ${chips.map((c, idx) => `
          <span class="active-filter-chip">
            ${c.label}
            <button type="button" class="active-filter-remove" data-chip="${idx}">&times;</button>
          </span>
        `).join('')}
        <button type="button" class="clear-all-filters-btn" id="clear-all-chips">Clear All</button>
      `;

      bar.querySelectorAll('.active-filter-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-chip'), 10);
          if (chips[idx]) chips[idx].remove();
        });
      });

      const clearBtn = document.getElementById('clear-all-chips');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          filters.categories.clear();
          filters.collections.clear();
          filters.colours.clear();
          filters.priceRange = null;
          filters.readyToShipOnly = false;
          filters.customizableOnly = false;
          filters.statusFilter = null;
          document.querySelectorAll('[data-filter-price]').forEach(r => r.checked = false);
          syncFormControls();
          applyFilters();
        });
      }
    }

    function renderGrid(productList) {
      const grid = document.getElementById('shop-product-grid');
      const countEl = document.getElementById('shop-product-count');
      if (!grid) return;

      if (countEl) {
        countEl.innerHTML = `Showing <span class="shop-count-highlight">${productList.length}</span> handcrafted ${productList.length === 1 ? 'piece' : 'pieces'}`;
      }

      if (productList.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">
              <img src="assets/images/emblem.svg" alt="Empty" style="width: 48px; height: 48px; opacity: 0.5; margin: 0 auto;">
            </div>
            <h2 class="empty-state-title">No pieces match your filters</h2>
            <p class="empty-state-desc">Try resetting your filters to explore our complete studio archives.</p>
            <button type="button" class="btn btn-primary" id="reset-empty-btn">Reset All Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('reset-empty-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            filters.categories.clear();
            filters.collections.clear();
            filters.colours.clear();
            filters.priceRange = null;
            filters.readyToShipOnly = false;
            filters.customizableOnly = false;
            filters.statusFilter = null;
            document.querySelectorAll('[data-filter-price]').forEach(r => r.checked = false);
            syncFormControls();
            applyFilters();
          });
        }
        return;
      }

      grid.innerHTML = productList.map(p => utils.renderProductCard(p)).join('');
    }

    // Initial Execution
    syncFormControls();
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopCatalogue);
  } else {
    initShopCatalogue();
  }
})();
