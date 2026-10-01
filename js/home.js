/**
 * BINT & BEADS - Universal Homepage Logic
 * Compatible with HTTP, dev servers, and local file:// protocols.
 */
(function() {
  'use strict';

  function initHome() {
    const products = (window.BINT && window.BINT.PRODUCTS) || [];
    const isWishlisted = (window.BINT && window.BINT.state && window.BINT.state.isWishlisted) || (() => false);
    const renderCard = (window.BINT && window.BINT.utils && window.BINT.utils.renderProductCard) || defaultRenderCard;

    renderNewArrivals(products, renderCard, isWishlisted);
    renderBestsellers(products, renderCard, isWishlisted);
    initGiftPills(products, renderCard, isWishlisted);
    initTestimonialsCarousel();
  }

  function defaultRenderCard(p, options) {
    const wishlisted = options && options.isWishlisted;
    const formattedPrice = (window.BINT && window.BINT.utils && window.BINT.utils.formatCurrency)
      ? window.BINT.utils.formatCurrency(p.price)
      : `₦${Number(p.price).toLocaleString()}`;

    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-card-media">
          ${p.badge ? `<span class="badge ${p.badge === 'NEW' ? 'badge-new' : (p.badge === 'LIMITED' ? 'badge-limited' : 'badge-gold')}">${p.badge}</span>` : ''}
          <button type="button" class="btn-wishlist ${wishlisted ? 'active' : ''}" data-wishlist-id="${p.id}" aria-label="Add ${p.name} to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <a href="product.html?id=${p.id}" class="product-img-wrapper">
            <img src="${p.images[0]}" alt="${p.name}" class="product-img-primary" loading="lazy">
            ${p.images[1] ? `<img src="${p.images[1]}" alt="${p.name} alternate view" class="product-img-hover" loading="lazy">` : ''}
          </a>
          <button type="button" class="btn-quick-add" data-quick-add-id="${p.id}">
            + Quick Add &bull; ${formattedPrice}
          </button>
        </div>
        <div class="product-card-info">
          <span class="product-category">${(p.category || 'Accessories').toUpperCase()}</span>
          <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="product-price-row">
            <span class="product-price">${formattedPrice}</span>
            ${p.originalPrice ? `<span class="product-original-price">₦${Number(p.originalPrice).toLocaleString()}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderNewArrivals(products, renderCard, isWishlisted) {
    const container = document.getElementById('new-arrivals-grid');
    if (!container || !products.length) return;

    const newItems = products.filter(p => p.newArrival || p.badge === 'NEW').slice(0, 4);
    const itemsToRender = newItems.length >= 4 ? newItems : products.slice(0, 4);
    container.innerHTML = itemsToRender.map(p => renderCard(p, { isWishlisted: isWishlisted(p.id) })).join('');
  }

  function renderBestsellers(products, renderCard, isWishlisted) {
    const container = document.getElementById('bestsellers-grid');
    if (!container || !products.length) return;

    const bestItems = products.filter(p => p.bestSeller || p.badge === 'BESTSELLER').slice(0, 4);
    const itemsToRender = bestItems.length >= 4 ? bestItems : products.slice(4, 8);
    container.innerHTML = itemsToRender.map(p => renderCard(p, { isWishlisted: isWishlisted(p.id) })).join('');
  }

  function initGiftPills(products, renderCard, isWishlisted) {
    const pills = document.querySelectorAll('.gift-pill');
    const container = document.getElementById('gift-products-grid');
    if (!container || !products.length) return;

    const renderGiftCategory = (categoryKeyword) => {
      let matched = [];
      const kw = (categoryKeyword || '').toLowerCase();
      if (kw === 'all' || kw === 'just because') {
        matched = products.filter(p => p.category === 'gift-sets' || p.category === 'bracelets').slice(0, 4);
      } else if (kw.includes('wedding') || kw.includes('bridesmaid')) {
        matched = products.filter(p => p.collection === 'bridal' || p.category === 'gift-sets' || p.tags.includes('bridal')).slice(0, 4);
      } else if (kw.includes('him')) {
        matched = products.filter(p => p.collection === 'noir' || p.category === 'keychains' || p.tags.includes('mens')).slice(0, 4);
      } else {
        matched = products.filter(p => p.featured || p.bestSeller).slice(0, 4);
      }

      if (!matched.length) matched = products.slice(0, 4);
      container.innerHTML = matched.map(p => renderCard(p, { isWishlisted: isWishlisted(p.id) })).join('');
    };

    renderGiftCategory('all');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const tag = pill.getAttribute('data-gift-tag') || 'all';
        renderGiftCategory(tag);
      });
    });
  }

  function initTestimonialsCarousel() {
    const quoteEl = document.getElementById('testimonial-quote');
    const authorEl = document.getElementById('testimonial-author');
    const metaEl = document.getElementById('testimonial-meta');
    const dotsContainer = document.getElementById('testimonial-dots');
    if (!quoteEl || !authorEl || !dotsContainer) return;

    const testimonials = [
      {
        quote: "The Zara Noir bracelet exceeded all expectations. You can feel the craftsmanship instantly — it has a substantial tactile weight, and the gold spacers hold their shine. Museum-tier presentation.",
        author: "Halima S.",
        meta: "Verified Buyer &bull; Lagos"
      },
      {
        quote: "I ordered custom waists and the Amina choker for my introduction. The baroque pearls have such character, not like factory round pearls. I received compliment after compliment all evening.",
        author: "Folake A.",
        meta: "Custom Studio Bride &bull; Abuja"
      },
      {
        quote: "The unboxing experience alone is an event. The wax-sealed note in gold calligraphy was such an extraordinary touch for my wife’s 30th birthday. Bint & Beads represents true luxury.",
        author: "Oluwaseun T.",
        meta: "The Sovereign Gift Suite &bull; Victoria Island"
      },
      {
        quote: "A wearable sculpture. People literally stopped me at dinner in London to ask where my beaded bag was from. Remarkable structural precision and pride in African beadwork.",
        author: "Khadija M.",
        meta: "Safiya Architectural Tote &bull; London / Lekki"
      }
    ];

    let current = 0;

    dotsContainer.innerHTML = testimonials.map((_, i) => `
      <button type="button" class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
    `).join('');

    const updateSlide = (index) => {
      current = index;
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = `"${testimonials[current].quote}"`;
        authorEl.textContent = testimonials[current].author;
        metaEl.innerHTML = testimonials[current].meta;
        quoteEl.style.opacity = '1';
      }, 200);

      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        updateSlide(idx);
      });
    });

    setInterval(() => {
      const next = (current + 1) % testimonials.length;
      updateSlide(next);
    }, 6500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
  } else {
    initHome();
  }
})();
