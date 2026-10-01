/**
 * BINT & BEADS - Universal Track Order Controller
 */
(function() {
  'use strict';

  const BINT = window.BINT || {};
  const utils = BINT.utils || {};
  const state = BINT.state || {};

  const formatCurrency = utils.formatCurrency || (n => `₦${Number(n).toLocaleString()}`);
  const escapeHtml = utils.escapeHtml || (s => s);
  const showToast = utils.showToast || console.log;
  const getOrderByReference = state.getOrderByReference || (() => null);

  class TrackingPage {
    constructor() {
      this.init();
    }

    init() {
      const params = new URLSearchParams(window.location.search);
      const initialRef = params.get('ref');

      const form = document.getElementById('tracking-search-form');
      const inputRef = document.getElementById('tracking-ref-input');

      if (initialRef && inputRef) {
        inputRef.value = initialRef;
        this.lookupOrder(initialRef);
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const refVal = inputRef.value.trim();
          if (refVal) {
            this.lookupOrder(refVal);
          }
        });
      }

      // Demo reference chips
      document.querySelectorAll('.sample-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-ref');
          if (inputRef) inputRef.value = code;
          this.lookupOrder(code);
        });
      });
    }

    lookupOrder(ref) {
      const resultBox = document.getElementById('tracking-result-box');
      const errorBox = document.getElementById('tracking-error-box');

      const order = getOrderByReference(ref);

      if (!order) {
        if (resultBox) resultBox.style.display = 'none';
        if (errorBox) {
          errorBox.style.display = 'block';
          const searchedRef = errorBox.querySelector('#error-searched-ref');
          if (searchedRef) searchedRef.textContent = ref;
        }
        return;
      }

      if (errorBox) errorBox.style.display = 'none';
      if (resultBox) {
        resultBox.style.display = 'block';
        this.renderOrderDetails(order);
      }
    }

    renderOrderDetails(order) {
      const refEl = document.getElementById('track-order-ref-display');
      const dateEl = document.getElementById('track-order-date');
      const totalEl = document.getElementById('track-order-total');
      const deliveryEl = document.getElementById('track-order-delivery');
      const itemsList = document.getElementById('track-order-items');

      if (refEl) refEl.textContent = order.orderRef;
      if (dateEl) {
        const d = new Date(order.createdAt);
        dateEl.textContent = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      if (totalEl) totalEl.textContent = formatCurrency(order.total);
      if (deliveryEl && order.delivery) {
        deliveryEl.textContent = order.delivery.methodName || 'Bint Courier Delivery';
      }

      // Progress Stepper Highlight (Steps 1 to 7)
      const currentStep = order.statusStep || 3;
      const stepLabels = [
        'Order Received',
        'Material Curation',
        'Studio Crafting',
        'Quality Inspection',
        'Signature Packaging',
        'Out for Delivery',
        'Delivered with Grace'
      ];

      const currentStatusLabel = document.getElementById('track-current-status-label');
      if (currentStatusLabel) {
        currentStatusLabel.textContent = stepLabels[currentStep - 1] || 'Crafting';
      }

      document.querySelectorAll('.timeline-step').forEach((el, index) => {
        const stepNum = index + 1;
        el.classList.remove('active', 'completed');
        if (stepNum < currentStep) {
          el.classList.add('completed');
        } else if (stepNum === currentStep) {
          el.classList.add('active');
        }
      });

      // Render Items
      if (itemsList && order.items) {
        itemsList.innerHTML = order.items.map(item => `
          <div style="display: flex; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
            <img src="${item.image || 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(item.name)}" style="width: 50px; height: 60px; object-fit: cover; border-radius: 2px;">
            <div style="flex: 1;">
              <strong style="color: var(--color-black); font-size: 0.9rem;">${escapeHtml(item.name)}</strong>
              <div style="font-size: 0.75rem; color: var(--color-grey);">${escapeHtml(item.colour || '')} ${item.size ? `(${escapeHtml(item.size)})` : ''} &bull; Qty: ${item.quantity || 1}</div>
            </div>
            <span style="font-weight: 600; font-size: 0.9rem;">${formatCurrency(item.price * (item.quantity || 1))}</span>
          </div>
        `).join('');
      }
    }
  }

  function initTracking() {
    window.trackingPage = new TrackingPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
})();
