/**
 * BINT & BEADS - Universal Order Success Controller
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
  const getOrders = state.getOrders || (() => []);

  function initSuccess() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');

    let order = null;
    if (ref) {
      order = getOrderByReference(ref);
    }

    if (!order) {
      const all = getOrders();
      order = all.length > 0 ? all[0] : null;
    }

    if (!order) {
      // Create a fallback demo order if none exists
      order = {
        orderRef: 'BB-2026-0184',
        createdAt: new Date().toISOString(),
        customer: { firstName: 'Honoured', lastName: 'Patron', email: 'patron@example.com', phone: '+234 800 000 0000' },
        items: [
          { name: 'Zara Noir & Gold Bracelet', price: 35000, quantity: 1, colour: 'Black', size: 'M (17.5cm)', image: 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=600&q=80' }
        ],
        packaging: { name: 'Signature Velvet Pouch', price: 0 },
        delivery: { methodName: 'Bint Courier Delivery', price: 3500, address: 'Lekki Phase 1, Lagos' },
        total: 38500
      };
    }

    renderOrderSuccess(order);
  }

  function renderOrderSuccess(order) {
    const nameEl = document.getElementById('success-customer-name');
    const refEl = document.getElementById('success-order-ref');
    const itemsContainer = document.getElementById('success-items-list');
    const deliverySummaryEl = document.getElementById('success-delivery-summary');
    const totalEl = document.getElementById('success-total');
    const trackBtn = document.getElementById('success-track-btn');
    const copyBtn = document.getElementById('copy-ref-btn');

    if (nameEl) nameEl.textContent = ((order.customer && order.customer.firstName) || 'Honoured Patron').toUpperCase();
    if (refEl) refEl.textContent = order.orderRef;
    if (totalEl) totalEl.textContent = formatCurrency(order.total);

    if (trackBtn) {
      trackBtn.href = `track-order.html?ref=${encodeURIComponent(order.orderRef)}`;
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(order.orderRef).then(() => {
            showToast(`Copied reference "${order.orderRef}" to clipboard`, 'gold');
          }).catch(() => {
            showToast(`Order reference: ${order.orderRef}`, 'info');
          });
        } else {
          showToast(`Order reference: ${order.orderRef}`, 'info');
        }
      });
    }

    if (deliverySummaryEl && order.delivery) {
      const d = order.delivery;
      if (d.methodId === 'bint_delivery' || d.address) {
        deliverySummaryEl.innerHTML = `
          <strong>${escapeHtml(d.methodName || 'Bint Courier Delivery')}</strong><br>
          <span style="color: var(--color-grey-dark); font-size: 0.85rem;">
            ${escapeHtml(d.address || 'Doorstep Delivery, Lagos')}<br>
            ${d.landmark ? `Landmark: ${escapeHtml(d.landmark)}<br>` : ''}
            Recipient: ${escapeHtml(order.customer ? order.customer.phone : '')}
          </span>
        `;
      } else {
        deliverySummaryEl.innerHTML = `
          <strong>Studio Atelier Pickup</strong><br>
          <span style="color: var(--color-grey-dark); font-size: 0.85rem;">
            ${escapeHtml(d.pickupLocation || '14 Karimu Kotun, Victoria Island, Lagos')}<br>
            ${d.pickupDate ? `Scheduled Date: ${escapeHtml(d.pickupDate)}<br>` : ''}
            ${d.pickupTime ? `Window: ${escapeHtml(d.pickupTime)}` : ''}
          </span>
        `;
      }
    }

    if (itemsContainer && order.items) {
      itemsContainer.innerHTML = order.items.map(item => `
        <div style="display: flex; gap: 16px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
          <img src="${item.image || 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=200&q=80'}" alt="${escapeHtml(item.name)}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 4px;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.9rem; color: var(--color-black);">${escapeHtml(item.name)}</div>
            <div style="font-size: 0.75rem; color: var(--color-grey);">Qty: ${item.quantity || 1} &bull; ${escapeHtml(item.colour || '')} ${item.size ? `(${escapeHtml(item.size)})` : ''}</div>
          </div>
          <div style="font-weight: 600; font-size: 0.9rem; color: var(--color-black);">${formatCurrency(item.price * (item.quantity || 1))}</div>
        </div>
      `).join('');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuccess);
  } else {
    initSuccess();
  }
})();
