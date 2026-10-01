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
  const clearCart = state.clearCart || (() => {});
  const getCartSubtotal = state.getCartSubtotal || (() => 0);
  const saveOrder = state.saveOrder || (() => {});

class CheckoutPage {
  constructor() {
    this.currentStep = 1;
    this.cart = getCart();

    this.orderData = {
      contact: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      delivery: {
        methodId: 'bint_delivery',
        methodName: 'Bint Courier Delivery',
        price: 3500,
        area: 'lagos-island',
        address: '',
        landmark: '',
        pickupLocation: 'Studio Atelier — 14 Karimu Kotun, Victoria Island, Lagos',
        pickupDate: '',
        pickupTime: '10:00 AM – 12:00 PM'
      },
      packaging: {
        id: 'signature',
        name: 'Signature Velvet Pouch',
        price: 0
      }
    };

    this.init();
  }

  init() {
    if (this.cart.length === 0) {
      showToast('Your bag is currently empty. Redirecting to catalogue...', 'info');
      setTimeout(() => {
        window.location.href = 'shop.html';
      }, 1500);
      return;
    }

    this.loadInitialPackaging();
    this.bindEvents();
    this.renderStep();
    this.renderSummary();
  }

  loadInitialPackaging() {
    const savedPkgId = getStorage('bint_selected_packaging', 'signature');
    const opt = BINT_CONFIG.packagingOptions.find(p => p.id === savedPkgId) || BINT_CONFIG.packagingOptions[0];
    this.orderData.packaging = {
      id: opt.id,
      name: opt.name,
      price: opt.price
    };
  }

  bindEvents() {
    // Navigation Step Buttons
    const continueBtn = document.getElementById('checkout-continue-btn');
    const backBtn = document.getElementById('checkout-back-btn');

    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.handleContinueOrPlaceOrder());
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => this.handleBack());
    }

    // Direct Step Tabs click
    document.querySelectorAll('[data-checkout-step]').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetStep = parseInt(tab.getAttribute('data-checkout-step'), 10);
        if (targetStep < this.currentStep) {
          this.currentStep = targetStep;
          this.renderStep();
        }
      });
    });

    // Delivery Method Radio Cards
    document.querySelectorAll('[data-delivery-method]').forEach(card => {
      card.addEventListener('click', () => {
        const methodId = card.getAttribute('data-delivery-method');
        this.selectDeliveryMethod(methodId);
      });
    });

    // Delivery Area Select (For Bint Delivery)
    const areaSelect = document.getElementById('delivery-area-select');
    if (areaSelect) {
      areaSelect.addEventListener('change', (e) => {
        const area = e.target.value;
        this.orderData.delivery.area = area;
        const bintDelivery = BINT_CONFIG.deliveryMethods.find(m => m.id === 'bint_delivery');
        this.orderData.delivery.price = bintDelivery.rates[area] || 3500;
        this.renderSummary();
      });
    }

    // Packaging Cards
    document.querySelectorAll('[data-checkout-pkg]').forEach(card => {
      card.addEventListener('click', () => {
        const pkgId = card.getAttribute('data-checkout-pkg');
        const opt = BINT_CONFIG.packagingOptions.find(p => p.id === pkgId);
        if (opt) {
          document.querySelectorAll('[data-checkout-pkg]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.orderData.packaging = {
            id: opt.id,
            name: opt.name,
            price: opt.price
          };
          this.renderSummary();
        }
      });
    });
  }

  selectDeliveryMethod(methodId) {
    document.querySelectorAll('[data-delivery-method]').forEach(c => c.classList.remove('selected'));
    const targetCard = document.querySelector(`[data-delivery-method="${methodId}"]`);
    if (targetCard) targetCard.classList.add('selected');

    this.orderData.delivery.methodId = methodId;

    // Show/hide subfields
    const bintFields = document.getElementById('bint-delivery-fields');
    const riderFields = document.getElementById('rider-delivery-fields');
    const pickupFields = document.getElementById('pickup-delivery-fields');

    if (bintFields) bintFields.style.display = methodId === 'bint_delivery' ? 'block' : 'none';
    if (riderFields) riderFields.style.display = methodId === 'send_rider' ? 'block' : 'none';
    if (pickupFields) pickupFields.style.display = methodId === 'store_pickup' ? 'block' : 'none';

    if (methodId === 'bint_delivery') {
      this.orderData.delivery.methodName = 'Bint Courier Delivery';
      const area = this.orderData.delivery.area || 'lagos-island';
      const rates = BINT_CONFIG.deliveryMethods[0].rates;
      this.orderData.delivery.price = rates[area] || 3500;
    } else if (methodId === 'send_rider') {
      this.orderData.delivery.methodName = 'Send My Rider (Pickup)';
      this.orderData.delivery.price = 0;
    } else if (methodId === 'store_pickup') {
      this.orderData.delivery.methodName = 'Studio Concierge Collection';
      this.orderData.delivery.price = 0;
    }

    this.renderSummary();
  }

  renderStep() {
    // Show current pane
    document.querySelectorAll('.checkout-pane').forEach((pane, idx) => {
      pane.style.display = (idx + 1 === this.currentStep) ? 'block' : 'none';
    });

    // Update navigation tabs
    document.querySelectorAll('.checkout-step-tab').forEach((tab, idx) => {
      const stepNum = idx + 1;
      tab.classList.toggle('active', stepNum === this.currentStep);
      tab.classList.toggle('completed', stepNum < this.currentStep);
    });

    // Update buttons
    const backBtn = document.getElementById('checkout-back-btn');
    const continueBtn = document.getElementById('checkout-continue-btn');

    if (backBtn) {
      backBtn.style.visibility = (this.currentStep === 1) ? 'hidden' : 'visible';
    }

    if (continueBtn) {
      if (this.currentStep === 4) {
        continueBtn.innerHTML = 'Place Demo Order &rarr;';
        continueBtn.className = 'btn btn-gold btn-lg btn-block';
        this.renderReviewStep();
      } else {
        continueBtn.innerHTML = 'Continue to Next Step &rarr;';
        continueBtn.className = 'btn btn-primary btn-lg btn-block';
      }
    }

    // Scroll to top of pane
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  handleBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  }

  handleContinueOrPlaceOrder() {
    if (this.currentStep === 1) {
      // Validate Contact
      const fname = document.getElementById('checkout-first-name').value.trim();
      const lname = document.getElementById('checkout-last-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();

      if (!fname || !lname || !email || !phone) {
        showToast('Please complete your contact name, email, and phone', 'info');
        return;
      }

      this.orderData.contact = { firstName: fname, lastName: lname, email, phone };
      this.currentStep = 2;
      this.renderStep();
    } else if (this.currentStep === 2) {
      // Validate Delivery
      if (this.orderData.delivery.methodId === 'bint_delivery') {
        const address = document.getElementById('checkout-address').value.trim();
        if (!address) {
          showToast('Please provide your doorstep delivery street address', 'info');
          return;
        }
        this.orderData.delivery.address = address;
        this.orderData.delivery.landmark = document.getElementById('checkout-landmark').value.trim();
      } else if (this.orderData.delivery.methodId === 'store_pickup') {
        this.orderData.delivery.pickupLocation = document.getElementById('checkout-pickup-location').value;
        this.orderData.delivery.pickupTime = document.getElementById('checkout-pickup-time').value;
      }
      this.currentStep = 3;
      this.renderStep();
    } else if (this.currentStep === 3) {
      // Packaging step proceeds to review
      this.currentStep = 4;
      this.renderStep();
    } else if (this.currentStep === 4) {
      // Place demo order!
      this.placeDemoOrder();
    }
  }

  renderReviewStep() {
    const contactSummary = document.getElementById('review-contact-summary');
    const deliverySummary = document.getElementById('review-delivery-summary');
    const packagingSummary = document.getElementById('review-packaging-summary');

    if (contactSummary) {
      const c = this.orderData.contact;
      contactSummary.innerHTML = `
        <strong>${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</strong><br>
        Email: ${escapeHtml(c.email)}<br>
        WhatsApp/Phone: ${escapeHtml(c.phone)}
      `;
    }

    if (deliverySummary) {
      const d = this.orderData.delivery;
      if (d.methodId === 'bint_delivery') {
        deliverySummary.innerHTML = `
          <strong>${escapeHtml(d.methodName)}</strong> (${formatCurrency(d.price)})<br>
          Address: ${escapeHtml(d.address)}<br>
          ${d.landmark ? `Landmark: ${escapeHtml(d.landmark)}<br>` : ''}
          Estimated Delivery: 1 – 3 Business Days
        `;
      } else if (d.methodId === 'send_rider') {
        deliverySummary.innerHTML = `
          <strong>${escapeHtml(d.methodName)}</strong><br>
          Dispatch address: Studio 14, Victoria Island, Lagos<br>
          <em>Rider will need your order verification reference.</em>
        `;
      } else {
        deliverySummary.innerHTML = `
          <strong>${escapeHtml(d.methodName)}</strong><br>
          Location: ${escapeHtml(d.pickupLocation)}<br>
          Preferred Window: ${escapeHtml(d.pickupTime)}
        `;
      }
    }

    if (packagingSummary) {
      const p = this.orderData.packaging;
      packagingSummary.innerHTML = `
        <strong>${escapeHtml(p.name)}</strong> (${p.price === 0 ? 'Complimentary' : formatCurrency(p.price)})
      `;
    }
  }

  renderSummary() {
    const subtotal = getCartSubtotal();
    const pkgPrice = this.orderData.packaging.price;
    const deliveryPrice = this.orderData.delivery.price;
    const total = subtotal + pkgPrice + deliveryPrice;

    const subtotalEl = document.getElementById('checkout-subtotal');
    const deliveryEl = document.getElementById('checkout-delivery-fee');
    const packagingEl = document.getElementById('checkout-packaging-fee');
    const totalEl = document.getElementById('checkout-total');
    const itemsListEl = document.getElementById('checkout-items-list');

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (deliveryEl) deliveryEl.textContent = deliveryPrice === 0 ? 'FREE' : formatCurrency(deliveryPrice);
    if (packagingEl) packagingEl.textContent = pkgPrice === 0 ? 'Complimentary' : formatCurrency(pkgPrice);
    if (totalEl) totalEl.textContent = formatCurrency(total);

    if (itemsListEl) {
      itemsListEl.innerHTML = this.cart.map(item => `
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" style="width: 48px; height: 58px; object-fit: cover; border-radius: 2px;" onerror="this.src='${getFallbackImage(item.name)}'">
          <div style="flex: 1; font-size: 0.8125rem;">
            <strong style="color: var(--color-black); display: block;">${escapeHtml(item.name)}</strong>
            <span style="color: var(--color-grey); font-size: 0.75rem;">Qty: ${item.quantity} &bull; ${escapeHtml(item.colour)}</span>
          </div>
          <span style="font-weight: 600; font-size: 0.85rem;">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }
  }

  placeDemoOrder() {
    const subtotal = getCartSubtotal();
    const pkgPrice = this.orderData.packaging.price;
    const deliveryPrice = this.orderData.delivery.price;
    const total = subtotal + pkgPrice + deliveryPrice;

    // Generate realistic reference: BB-2026-XXXX
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const orderRef = `BB-2026-${refNum}`;

    const newOrder = {
      orderRef,
      createdAt: new Date().toISOString(),
      customer: { ...this.orderData.contact },
      items: [...this.cart],
      packaging: { ...this.orderData.packaging },
      delivery: { ...this.orderData.delivery },
      subtotal,
      packagingPrice: pkgPrice,
      deliveryPrice,
      total,
      status: 'crafting',
      statusStep: 3 // Crafting stage
    };

    saveOrder(newOrder);
    clearCart();

    showToast(`Order ${orderRef} placed successfully!`, 'gold');
    setTimeout(() => {
      window.location.href = `order-success.html?ref=${orderRef}`;
    }, 400);
  }
}

  function initCheckout() {
    window.checkoutPage = new CheckoutPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
  } else {
    initCheckout();
  }
})();
