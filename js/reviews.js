/**
 * BINT & BEADS - Universal Dedicated Reviews Page Controller
 */
(function() {
  'use strict';

  const BINT = window.BINT || {};
  const utils = BINT.utils || {};

  const escapeHtml = utils.escapeHtml || (s => s);
  const showToast = utils.showToast || console.log;
  const getStorage = utils.getStorage || ((k, d) => d);
  const setStorage = utils.setStorage || (() => {});

  const INITIAL_REVIEWS = [
    {
      id: 1,
      author: "Halima S.",
      location: "Lagos, Nigeria",
      rating: 5,
      date: "2026-09-24",
      verified: true,
      productName: "Zara Noir & Gold Bracelet",
      title: "Tactile perfection and museum quality",
      comment: "The Zara Noir bracelet exceeded all expectations. You can feel the craftsmanship instantly — it has a substantial tactile weight, and the gold spacers hold their shine without tarnishing."
    },
    {
      id: 2,
      author: "Folake Adeleke",
      location: "Abuja, Nigeria",
      rating: 5,
      date: "2026-09-18",
      verified: true,
      productName: "Amina Baroque Pearl & Gold Choker",
      title: "Stole the spotlight at my introduction",
      comment: "I ordered custom waists and the Amina choker for my introduction. The baroque pearls have such character, not like factory round pearls. I received compliment after compliment all evening."
    },
    {
      id: 3,
      author: "Oluwaseun T.",
      location: "Victoria Island, Lagos",
      rating: 5,
      date: "2026-09-11",
      verified: true,
      productName: "The Sovereign Gift Suite",
      title: "Bespoke presentation is unparalleled",
      comment: "The unboxing experience alone is an event. The wax-sealed note in gold calligraphy was such an extraordinary touch for my wife's 30th birthday. Bint & Beads represents true African luxury."
    },
    {
      id: 4,
      author: "Khadija M.",
      location: "London, UK",
      rating: 5,
      date: "2026-08-30",
      verified: true,
      productName: "Safiya Architectural Beaded Tote",
      title: "Wearable sculpture that stops people in dinner",
      comment: "A wearable sculpture. People literally stopped me at dinner in Mayfair to ask where my beaded bag was from. Remarkable structural precision and pride in African beadwork."
    },
    {
      id: 5,
      author: "Ngozi Okafor",
      location: "Enugu, Nigeria",
      rating: 5,
      date: "2026-08-20",
      verified: true,
      productName: "Leila Royal Amber & Gold Waist Beads",
      title: "Sensual, comfortable and durable",
      comment: "The tie-on thread is heavy cotton that does not itch or fray in the shower. The amber beads glow against darker skin. Truly sacred craftsmanship."
    }
  ];

  class ReviewsPage {
    constructor() {
      this.ratingFilter = 'all';
      this.init();
    }

    init() {
      this.renderReviews();
      this.bindEvents();
    }

    getAllReviews() {
      const userReviews = getStorage('bint_reviews', []);
      return [...userReviews, ...INITIAL_REVIEWS];
    }

    bindEvents() {
      // Filter buttons (All, 5 Stars, 4 Stars)
      document.querySelectorAll('[data-review-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-review-filter]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.ratingFilter = btn.getAttribute('data-review-filter');
          this.renderReviews();
        });
      });

      // Write Review Modal
      const openBtn = document.getElementById('open-general-review-modal');
      const modalBackdrop = document.getElementById('general-review-backdrop');
      const closeBtn = document.getElementById('general-review-close');
      const form = document.getElementById('general-review-form');

      if (openBtn && modalBackdrop) {
        openBtn.addEventListener('click', () => {
          modalBackdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
          modalBackdrop.classList.remove('active');
          document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) closeModal();
        });

        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const author = form.querySelector('[name="author"]').value.trim();
            const location = form.querySelector('[name="location"]').value.trim() || 'Lagos';
            const rating = parseInt(form.querySelector('[name="rating"]').value, 10) || 5;
            const title = form.querySelector('[name="title"]').value.trim();
            const comment = form.querySelector('[name="comment"]').value.trim();
            const product = form.querySelector('[name="product"]').value.trim() || 'Bespoke Piece';

            const newRev = {
              id: Date.now(),
              author,
              location,
              rating,
              date: new Date().toISOString().split('T')[0],
              verified: true,
              productName: product,
              title,
              comment
            };

            const existing = getStorage('bint_reviews', []);
            existing.unshift(newRev);
            setStorage('bint_reviews', existing);

            showToast('Thank you. Your patron review has been recorded.', 'gold');
            form.reset();
            closeModal();
            this.renderReviews();
          });
        }
      }
    }

    renderReviews() {
      const container = document.getElementById('reviews-stream-container');
      if (!container) return;

      let list = this.getAllReviews();

      if (this.ratingFilter !== 'all') {
        const targetRating = parseInt(this.ratingFilter, 10);
        list = list.filter(r => r.rating === targetRating);
      }

      if (list.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-grey-dark);">No reviews found matching this filter rating.</div>`;
        return;
      }

      container.innerHTML = list.map(r => `
        <article class="review-stream-card" style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: 4px; padding: 28px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="color: var(--color-gold); font-size: 1.1rem; letter-spacing: 2px; margin-bottom: 4px;">
                ${'&#9733;'.repeat(r.rating)}<span style="color: var(--color-sand);">${'&#9733;'.repeat(5 - r.rating)}</span>
              </div>
              <strong style="color: var(--color-black); font-size: 1.05rem;">${escapeHtml(r.author)}</strong>
              <span style="font-size: 0.8rem; color: var(--color-grey); margin-left: 8px;">&bull; ${escapeHtml(r.location)}</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; color: var(--color-grey);">${r.date}</span>
              <div style="font-size: 0.75rem; color: var(--color-deep-gold); font-weight: 600; margin-top: 2px;">
                ${escapeHtml(r.productName || 'Bespoke Commission')}
              </div>
            </div>
          </div>

          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-black); margin-bottom: 8px;">${escapeHtml(r.title)}</h3>
          <p style="color: var(--color-grey-dark); font-size: 0.925rem; line-height: 1.7;">${escapeHtml(r.comment)}</p>
        </article>
      `).join('');
    }
  }

  function initReviews() {
    window.reviewsPage = new ReviewsPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviews);
  } else {
    initReviews();
  }
})();
