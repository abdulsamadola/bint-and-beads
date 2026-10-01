(function() {
  'use strict';

  const BINT = window.BINT || {};
  const PRODUCTS = BINT.PRODUCTS || [];
  const utils = BINT.utils || {};
  const state = BINT.state || {};

  const formatCurrency = utils.formatCurrency || (n => `₦${Number(n).toLocaleString()}`);
  const getProductById = utils.getProductById || (id => PRODUCTS.find(p => p.id === Number(id)));
  const getProductBySlug = utils.getProductBySlug || (s => PRODUCTS.find(p => p.slug === s));
  const renderProductCard = utils.renderProductCard || (() => '');
  const getCategoryLabel = utils.getCategoryLabel || (c => c);
  const showToast = utils.showToast || console.log;
  const escapeHtml = utils.escapeHtml || (s => s);
  const getColorHex = utils.getColorHex || (() => '#C6A15B');
  const getStorage = utils.getStorage || ((k, d) => d);
  const setStorage = utils.setStorage || (() => {});
  const getWhatsAppLink = utils.getWhatsAppLink || ((msg) => `https://wa.me/2348000002468?text=${encodeURIComponent(msg)}`);

  const addToCart = state.addToCart || (() => {});
  const isWishlisted = state.isProductWishlisted || (() => false);
  const toggleWishlist = state.toggleWishlist || (() => false);

  const INITIAL_REVIEWS = [
    { id: 101, name: "Zainab Al-Mansoor", rating: 5, date: "2026-09-14", verified: true, title: "Exquisite craftsmanship and weight", comment: "The tactile sensation of these beads is unmatched. The gold spacers catch the light subtly without being gaudy. Arrived in a keepsake onyx box that felt like receiving an heirloom." },
    { id: 102, name: "Chioma E.", rating: 5, date: "2026-09-10", verified: true, title: "Stunning bespoke finish", comment: "Ordered with custom gold-leaf lettering. The tension of the cord and the precision of the knotting is museum quality. Highly recommended." },
    { id: 103, name: "Morayo Adeleke", rating: 5, date: "2026-08-28", verified: true, title: "A timeless African staple", comment: "Bint & Beads has completely redefined modern beaded luxury. Elegant, understated, yet draws compliments wherever I travel." }
  ];

class ProductDetail {
  constructor() {
    this.product = null;
    this.selectedColour = '';
    this.selectedSize = '';
    this.quantity = 1;
    this.init();
  }

  init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const slug = params.get('slug');

    if (id) {
      this.product = getProductById(id);
    } else if (slug) {
      this.product = getProductBySlug(slug);
    }

    // Graceful fallback to first product if invalid or missing ID
    if (!this.product) {
      this.product = PRODUCTS[0];
    }

    this.selectedColour = this.product.colours ? this.product.colours[0] : 'Default';
    this.selectedSize = this.product.sizes ? this.product.sizes[0] : 'Standard';

    // Update Page Title
    document.title = `${this.product.name} | BINT & BEADS`;

    this.renderDetails();
    this.renderGallery();
    this.bindEvents();
    this.renderAccordions();
    this.renderReviews();
    this.renderRelatedProducts();
  }

  renderDetails() {
    // Breadcrumbs
    const crumbCat = document.getElementById('crumb-category');
    const crumbProduct = document.getElementById('crumb-product');
    if (crumbCat) {
      crumbCat.textContent = getCategoryLabel(this.product.category);
      crumbCat.href = `shop.html?category=${this.product.category}`;
    }
    if (crumbProduct) {
      crumbProduct.textContent = this.product.name;
    }

    // Title & Meta
    const metaCat = document.getElementById('product-meta-cat');
    const titleEl = document.getElementById('product-title');
    const priceCurrent = document.getElementById('product-price-current');
    const priceOld = document.getElementById('product-price-old');
    const shortDesc = document.getElementById('product-short-desc');
    const ratingSummary = document.getElementById('product-rating-summary');

    if (metaCat) metaCat.textContent = `${getCategoryLabel(this.product.category)} &bull; ${this.product.collection.toUpperCase()}`;
    if (titleEl) titleEl.textContent = this.product.name;
    if (priceCurrent) priceCurrent.textContent = formatCurrency(this.product.price);
    if (priceOld) {
      if (this.product.oldPrice) {
        priceOld.textContent = formatCurrency(this.product.oldPrice);
        priceOld.style.display = 'inline';
      } else {
        priceOld.style.display = 'none';
      }
    }
    if (shortDesc) shortDesc.textContent = this.product.shortDescription || this.product.description;

    if (ratingSummary) {
      ratingSummary.innerHTML = `
        <div class="rating-stars"><span>&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        <span>${this.product.rating.toFixed(1)} (${this.product.reviewCount} Reviews)</span>
      `;
    }

    // Render Colours
    const coloursWrap = document.getElementById('colour-options-container');
    const colourDisplay = document.getElementById('selected-colour-display');
    if (coloursWrap && this.product.colours && this.product.colours.length > 0) {
      if (colourDisplay) colourDisplay.textContent = this.selectedColour;
      coloursWrap.innerHTML = this.product.colours.map((col, idx) => `
        <button type="button" class="colour-select-btn ${col === this.selectedColour ? 'active' : ''}" data-colour-val="${escapeHtml(col)}">
          <span class="swatch-dot" style="background-color: ${getColorHex(col)};"></span>
          <span>${escapeHtml(col)}</span>
        </button>
      `).join('');

      coloursWrap.querySelectorAll('.colour-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          coloursWrap.querySelectorAll('.colour-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedColour = btn.getAttribute('data-colour-val');
          if (colourDisplay) colourDisplay.textContent = this.selectedColour;
        });
      });
    }

    // Render Sizes
    const sizesWrap = document.getElementById('size-options-container');
    const sizeDisplay = document.getElementById('selected-size-display');
    if (sizesWrap && this.product.sizes && this.product.sizes.length > 0) {
      if (sizeDisplay) sizeDisplay.textContent = this.selectedSize;
      sizesWrap.innerHTML = this.product.sizes.map((sz, idx) => `
        <button type="button" class="size-select-btn ${sz === this.selectedSize ? 'active' : ''}" data-size-val="${escapeHtml(sz)}">
          ${escapeHtml(sz)}
        </button>
      `).join('');

      sizesWrap.querySelectorAll('.size-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sizesWrap.querySelectorAll('.size-select-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedSize = btn.getAttribute('data-size-val');
          if (sizeDisplay) sizeDisplay.textContent = this.selectedSize;
        });
      });
    } else {
      const sizeSection = document.getElementById('size-variant-section');
      if (sizeSection) sizeSection.style.display = 'none';
    }

    // Customise Link Banner
    const customLink = document.getElementById('customise-this-link');
    if (customLink) {
      customLink.href = `customize.html?accessory=${this.product.category}`;
    }

    // WhatsApp Concierge Link
    const waLink = document.getElementById('product-whatsapp-inquiry');
    if (waLink) {
      waLink.href = getWhatsAppLink(`Hello Bint & Beads Concierge, I am interested in inquiring about the "${this.product.name}" (${formatCurrency(this.product.price)}).`);
    }

    // Wishlist Button state
    const wishlistBtn = document.getElementById('product-detail-wishlist-btn');
    if (wishlistBtn) {
      const saved = isWishlisted(this.product.id);
      wishlistBtn.classList.toggle('active', saved);
      const svg = wishlistBtn.querySelector('svg');
      if (svg) svg.setAttribute('fill', saved ? 'currentColor' : 'none');
    }
  }

  renderGallery() {
    const mainImg = document.getElementById('product-main-image');
    const thumbsContainer = document.getElementById('product-thumbnails-list');
    if (!mainImg || !thumbsContainer) return;

    mainImg.src = this.product.images[0];
    mainImg.alt = this.product.name;

    thumbsContainer.innerHTML = this.product.images.map((imgUrl, i) => `
      <button type="button" class="product-thumb-btn ${i === 0 ? 'active' : ''}" data-img-src="${imgUrl}" aria-label="View photo ${i + 1}">
        <img class="product-thumb-img" src="${imgUrl}" alt="${escapeHtml(this.product.name)} thumbnail ${i + 1}">
      </button>
    `).join('');

    thumbsContainer.querySelectorAll('.product-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        thumbsContainer.querySelectorAll('.product-thumb-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetSrc = btn.getAttribute('data-img-src');
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = targetSrc;
          mainImg.style.opacity = '1';
        }, 150);
      });
    });
  }

  bindEvents() {
    // Quantity stepper
    const qtyInput = document.getElementById('product-qty-input');
    const qtyMinus = document.getElementById('qty-btn-minus');
    const qtyPlus = document.getElementById('qty-btn-plus');

    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyInput.value = this.quantity;
        }
      });

      qtyPlus.addEventListener('click', () => {
        this.quantity++;
        qtyInput.value = this.quantity;
      });

      qtyInput.addEventListener('change', () => {
        const val = parseInt(qtyInput.value, 10);
        this.quantity = isNaN(val) || val < 1 ? 1 : val;
        qtyInput.value = this.quantity;
      });
    }

    // Add to Bag Button
    const addBtn = document.getElementById('add-to-bag-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart({
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.images[0],
          colour: this.selectedColour,
          size: this.selectedSize,
          quantity: this.quantity
        });

        if (window.bintApp) {
          window.bintApp.openCartDrawer();
        }
      });
    }

    // Wishlist Toggle
    const wishlistBtn = document.getElementById('product-detail-wishlist-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        const isNowSaved = toggleWishlist(this.product.id);
        wishlistBtn.classList.toggle('active', isNowSaved);
        const svg = wishlistBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isNowSaved ? 'currentColor' : 'none');
      });
    }

    // Accordions
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Toggle
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });

    // Review modal / Form Toggle
    const writeReviewBtn = document.getElementById('open-review-form-btn');
    const reviewFormWrap = document.getElementById('review-form-wrapper');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    const reviewForm = document.getElementById('product-review-form');

    if (writeReviewBtn && reviewFormWrap) {
      writeReviewBtn.addEventListener('click', () => {
        reviewFormWrap.style.display = reviewFormWrap.style.display === 'none' ? 'block' : 'none';
        if (reviewFormWrap.style.display === 'block') {
          reviewFormWrap.scrollIntoView({ behavior: 'smooth' });
        }
      });

      if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => {
          reviewFormWrap.style.display = 'none';
        });
      }

      if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
      }
    }
  }

  renderAccordions() {
    const descContent = document.getElementById('acc-desc-content');
    const matContent = document.getElementById('acc-materials-content');
    if (descContent) {
      descContent.innerHTML = `<p>${escapeHtml(this.product.description)}</p>`;
    }
    if (matContent && this.product.materials) {
      matContent.innerHTML = `
        <ul style="list-style: disc; margin-left: 20px; color: var(--color-grey-dark); line-height: 1.8;">
          ${this.product.materials.map(m => `<li>${escapeHtml(m)}</li>`).join('')}
        </ul>
      `;
    }
  }

  renderReviews() {
    const listContainer = document.getElementById('reviews-list-container');
    if (!listContainer) return;

    // Retrieve seed + user submitted reviews
    const storedReviews = getStorage('bint_reviews', []);
    const productReviews = [
      ...INITIAL_REVIEWS.filter(r => r.productId === this.product.id),
      ...storedReviews.filter(r => r.productId === this.product.id)
    ];

    const count = productReviews.length;
    const avg = count > 0 
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
      : this.product.rating.toFixed(1);

    const scoreBig = document.getElementById('reviews-score-big');
    const scoreStars = document.getElementById('reviews-score-stars');
    const scoreTotal = document.getElementById('reviews-score-total');

    if (scoreBig) scoreBig.textContent = avg;
    if (scoreStars) scoreStars.innerHTML = '&#9733;&#9733;&#9733;&#9733;&#9733;';
    if (scoreTotal) scoreTotal.textContent = `Based on ${count || this.product.reviewCount} customer reflections`;

    if (count === 0) {
      listContainer.innerHTML = `
        <p style="color: var(--color-grey); font-style: italic;">No reflections submitted for this specific piece yet. Be the first to share your experience.</p>
      `;
      return;
    }

    listContainer.innerHTML = productReviews.map(r => `
      <div class="review-item-card">
        <div class="review-item-header">
          <div>
            <span class="review-item-author">${escapeHtml(r.author)}</span>
            ${r.verified ? '<span class="review-item-verified">&check; Verified Buyer</span>' : ''}
            <div class="rating-stars" style="margin-top: 4px;">
              ${'&#9733;'.repeat(r.rating)}${'&#9734;'.repeat(5 - r.rating)}
            </div>
          </div>
          <span style="font-size: 0.75rem; color: var(--color-grey);">${r.date || 'Recent'}</span>
        </div>
        <h4 class="review-item-title">${escapeHtml(r.title)}</h4>
        <p style="font-size: 0.9rem; color: var(--color-grey-dark); line-height: 1.6;">${escapeHtml(r.comment)}</p>
      </div>
    `).join('');
  }

  handleReviewSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="author"]').value.trim();
    const rating = parseInt(form.querySelector('[name="rating"]').value, 10);
    const title = form.querySelector('[name="title"]').value.trim();
    const comment = form.querySelector('[name="comment"]').value.trim();

    if (!name || !title || !comment) {
      showToast('Please complete all review fields', 'info');
      return;
    }

    const newReview = {
      id: Date.now(),
      productId: this.product.id,
      productName: this.product.name,
      author: name,
      rating: rating || 5,
      title: title,
      comment: comment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    const stored = getStorage('bint_reviews', []);
    stored.unshift(newReview);
    setStorage('bint_reviews', stored);

    showToast('Thank you. Your review has been added to our reflections.', 'gold');
    form.reset();
    document.getElementById('review-form-wrapper').style.display = 'none';
    this.renderReviews();
  }

  renderRelatedProducts() {
    const container = document.getElementById('related-products-grid');
    if (!container) return;

    // Filter by same category or collection, excluding current
    const related = PRODUCTS.filter(p => {
      return p.id !== this.product.id && (p.category === this.product.category || p.collection === this.product.collection);
    }).slice(0, 4);

    container.innerHTML = related.map(p => {
      return renderProductCard(p, { isWishlisted: isWishlisted(p.id) });
    }).join('');
  }
}

  function initProduct() {
    window.productDetail = new ProductDetail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProduct);
  } else {
    initProduct();
  }
})();
