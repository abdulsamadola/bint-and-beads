/**
 * BINT & BEADS - Custom Studio Controller
 * Universal, error-free 7-step luxury product configurator.
 */
(function() {
  'use strict';

  class CustomStudio {
    constructor() {
      this.totalSteps = 7;
      this.currentStep = 1;

      this.stepNames = [
        'Silhouette',
        'Recipient',
        'Direction',
        'Palette',
        'Inscription',
        'Sizing',
        'Presentation'
      ];

      this.config = {
        accessory: 'bracelet',
        recipient: 'myself',
        style: 'contemporary',
        primaryColour: 'Black',
        secondaryColour: 'Gold',
        accentColour: 'Cream',
        outfitImage: null,
        nameText: '',
        letterFinish: 'gold',
        charm: 'none',
        size: 'M (17.5cm)',
        packaging: 'signature',
        giftMessage: ''
      };

      this.init();
    }

    init() {
      this.loadDraftOrParams();
      this.bindEvents();
      this.renderCurrentStep();
      this.updateSummaryAndPricing();
    }

    loadDraftOrParams() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('accessory')) {
        const acc = params.get('accessory').toLowerCase();
        if (['bracelet', 'necklace', 'waist-beads', 'anklet', 'beaded-bag', 'phone-charm', 'keychain', 'gift-set'].includes(acc)) {
          this.config.accessory = acc;
        }
      }

      if (window.BINT && window.BINT.utils) {
        const draft = window.BINT.utils.getStorage('bint_custom_design');
        if (draft && typeof draft === 'object') {
          this.config = Object.assign({}, this.config, draft);
        }
      }
    }

    saveDraft() {
      if (window.BINT && window.BINT.utils) {
        window.BINT.utils.setStorage('bint_custom_design', this.config);
      }
    }

    calculatePrice() {
      const config = (window.BINT && window.BINT.CONFIG) || {};
      const rules = config.customPricing || {
        basePrices: { bracelet: 32000, necklace: 48000, 'waist-beads': 28000, anklet: 26000, 'beaded-bag': 85000, 'phone-charm': 16000, keychain: 14000, 'gift-set': 78000 },
        styleMultiplier: { minimal: 1.0, classic: 1.05, statement: 1.25, traditional: 1.15, contemporary: 1.2, crystal: 1.3, pearl: 1.35, 'mixed-bead': 1.22 },
        letterFinishPrice: { gold: 3000, silver: 2500, black: 2000, white: 1500 },
        charmPrice: { none: 0, heart: 3500, crown: 4000, star: 3500, butterfly: 4500, initial: 3000 }
      };

      const base = rules.basePrices[this.config.accessory] || 32000;
      const styleMulti = rules.styleMultiplier[this.config.style] || 1.0;
      const letterCost = (this.config.nameText && this.config.nameText.trim().length > 0)
        ? (rules.letterFinishPrice[this.config.letterFinish] || 3000)
        : 0;
      const charmCost = rules.charmPrice[this.config.charm] || 0;

      let packagingCost = 0;
      if (this.config.packaging === 'gift-box') packagingCost = 4500;
      if (this.config.packaging === 'luxury-set') packagingCost = 8500;

      return Math.round(base * styleMulti) + letterCost + charmCost + packagingCost;
    }

    bindEvents() {
      // Step buttons (Top and Bottom)
      document.querySelectorAll('#studio-next-btn, #studio-next-btn-top').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleNextOrSubmit();
        });
      });

      document.querySelectorAll('#studio-prev-btn, #studio-prev-btn-top').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToPrevStep();
        });
      });

      // Step Tabs in progress bar
      document.querySelectorAll('[data-step-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
          const target = parseInt(tab.getAttribute('data-step-tab'), 10);
          if (target && target <= this.totalSteps) {
            this.currentStep = target;
            this.renderCurrentStep();
          }
        });
      });

      // STEP 1: Accessory Cards
      document.querySelectorAll('[data-accessory-val]').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('[data-accessory-val]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.config.accessory = card.getAttribute('data-accessory-val');
          this.updateSizesForAccessory();
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // STEP 2: Recipient Cards
      document.querySelectorAll('[data-recipient-val]').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('[data-recipient-val]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.config.recipient = card.getAttribute('data-recipient-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // STEP 3: Style Direction Cards
      document.querySelectorAll('[data-style-val]').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('[data-style-val]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.config.style = card.getAttribute('data-style-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // STEP 4: Colors
      this.bindColorGroup('primary', 'primaryColour');
      this.bindColorGroup('secondary', 'secondaryColour');
      this.bindColorGroup('accent', 'accentColour');

      // STEP 4: Match My Outfit Image Upload
      const outfitInput = document.getElementById('outfit-upload-input');
      const outfitBox = document.getElementById('outfit-upload-box');
      const outfitPreview = document.getElementById('outfit-preview-img');

      if (outfitInput && outfitBox) {
        outfitBox.addEventListener('click', () => outfitInput.click());
        outfitInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.config.outfitImage = event.target.result;
              if (outfitPreview) {
                outfitPreview.src = event.target.result;
                outfitPreview.style.display = 'block';
              }
              if (window.BINT && window.BINT.utils) {
                window.BINT.utils.showToast('Outfit preview loaded locally. Our artisans will reference its palette.', 'gold');
              }
              this.saveDraft();
            };
            reader.readAsDataURL(file);
          }
        });
      }

      // STEP 5: Name Inscription
      const nameInput = document.getElementById('custom-name-input');
      const charCounter = document.getElementById('custom-name-counter');
      if (nameInput) {
        nameInput.value = this.config.nameText;
        nameInput.addEventListener('input', (e) => {
          const val = e.target.value.toUpperCase().slice(0, 12);
          nameInput.value = val;
          this.config.nameText = val;
          if (charCounter) charCounter.textContent = `${val.length} / 12 characters`;
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      }

      // Finish buttons
      document.querySelectorAll('[data-finish-val]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-finish-val]').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.config.letterFinish = btn.getAttribute('data-finish-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // Charms
      document.querySelectorAll('[data-charm-val]').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('[data-charm-val]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.config.charm = card.getAttribute('data-charm-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // STEP 7: Packaging
      document.querySelectorAll('[data-packaging-val]').forEach(card => {
        card.addEventListener('click', () => {
          document.querySelectorAll('[data-packaging-val]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          this.config.packaging = card.getAttribute('data-packaging-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });

      // Gift message
      const giftMsg = document.getElementById('custom-gift-message');
      const giftCounter = document.getElementById('gift-msg-counter');
      if (giftMsg) {
        giftMsg.addEventListener('input', (e) => {
          const val = e.target.value.slice(0, 150);
          giftMsg.value = val;
          this.config.giftMessage = val;
          if (giftCounter) giftCounter.textContent = `${val.length} / 150 characters`;
          this.saveDraft();
        });
      }

      // Bespoke Modal
      this.bindBespokeModal();
    }

    bindColorGroup(groupKey, stateProp) {
      document.querySelectorAll(`[data-color-group="${groupKey}"]`).forEach(dot => {
        dot.addEventListener('click', () => {
          document.querySelectorAll(`[data-color-group="${groupKey}"]`).forEach(d => d.classList.remove('selected'));
          dot.classList.add('selected');
          this.config[stateProp] = dot.getAttribute('data-color-val');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });
    }

    updateSizesForAccessory() {
      const container = document.getElementById('custom-sizes-container');
      if (!container) return;

      const acc = this.config.accessory;
      let sizeOptions = [];

      if (acc === 'bracelet') {
        sizeOptions = ['XS (15cm)', 'S (16.5cm)', 'M (17.5cm)', 'L (19cm)', 'XL (20.5cm)', 'Custom Wrist'];
      } else if (acc === 'necklace') {
        sizeOptions = ['14-inch Choker', '16-inch Princess', '18-inch Matinee', '22-inch Opera'];
      } else if (acc === 'waist-beads') {
        sizeOptions = ['Standard (Up to 45")', 'Extended (Up to 55")', 'Custom Measurement'];
      } else if (acc === 'anklet') {
        sizeOptions = ['Petite (21cm + 3cm)', 'Standard (24cm + 3cm)', 'Generous (27cm + 3cm)'];
      } else if (acc === 'beaded-bag') {
        sizeOptions = ['Standard Atelier Silhouette (22cm x 16cm)'];
      } else {
        sizeOptions = ['Standard Artisan Drop'];
      }

      if (!sizeOptions.includes(this.config.size)) {
        this.config.size = sizeOptions[0];
      }

      container.innerHTML = sizeOptions.map(sz => `
        <button type="button" class="size-select-btn ${sz === this.config.size ? 'active' : ''}" data-custom-size="${sz}">
          ${sz}
        </button>
      `).join('');

      container.querySelectorAll('[data-custom-size]').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('[data-custom-size]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.config.size = btn.getAttribute('data-custom-size');
          this.saveDraft();
          this.updateSummaryAndPricing();
        });
      });
    }

    renderCurrentStep() {
      // Show only active step pane
      for (let i = 1; i <= this.totalSteps; i++) {
        const pane = document.getElementById(`step-pane-${i}`);
        if (pane) {
          pane.style.display = (i === this.currentStep) ? 'block' : 'none';
        }
      }

      // Update sticky progress text & bar
      const counterEl = document.getElementById('studio-step-num');
      const titleEl = document.getElementById('studio-step-title-text');
      const fillEl = document.getElementById('studio-progress-fill');
      const stepName = this.stepNames[this.currentStep - 1] || 'Configure';

      if (counterEl) {
        counterEl.textContent = `Step 0${this.currentStep} of 0${this.totalSteps}`;
      }
      if (titleEl) {
        titleEl.textContent = stepName;
      }
      if (fillEl) {
        fillEl.style.width = `${(this.currentStep / this.totalSteps) * 100}%`;
      }

      // Update step tabs
      document.querySelectorAll('[data-step-tab]').forEach(tab => {
        const tNum = parseInt(tab.getAttribute('data-step-tab'), 10);
        tab.classList.toggle('active', tNum === this.currentStep);
        tab.classList.toggle('completed', tNum < this.currentStep);
      });

      // Update Prev / Next Buttons
      const prevBtns = document.querySelectorAll('#studio-prev-btn, #studio-prev-btn-top');
      const nextBtns = document.querySelectorAll('#studio-next-btn, #studio-next-btn-top');

      prevBtns.forEach(btn => {
        btn.style.visibility = (this.currentStep === 1) ? 'hidden' : 'visible';
      });

      const utils = (window.BINT && window.BINT.utils) || {};
      const formatCurrency = utils.formatCurrency || (n => `₦${Number(n).toLocaleString()}`);

      nextBtns.forEach(btn => {
        if (this.currentStep === this.totalSteps) {
          btn.innerHTML = `Add to Bag &bull; ${formatCurrency(this.calculatePrice())}`;
          btn.className = (btn.id === 'studio-next-btn-top') ? 'btn btn-gold btn-sm' : 'btn btn-gold btn-lg';
        } else {
          btn.innerHTML = (btn.id === 'studio-next-btn-top') ? `Continue &rarr;` : `Continue to Next Step &rarr;`;
          btn.className = (btn.id === 'studio-next-btn-top') ? 'btn btn-primary btn-sm' : 'btn btn-primary';
        }
      });

      this.syncActiveCards();
      this.updateSizesForAccessory();

      // Smooth scroll to top of configurator on step change
      const hero = document.getElementById('studio-progress-bar');
      if (hero && this.currentStep > 1) {
        const headerOffset = 100;
        const elementPosition = hero.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }

    syncActiveCards() {
      document.querySelectorAll('[data-accessory-val]').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-accessory-val') === this.config.accessory);
      });
      document.querySelectorAll('[data-recipient-val]').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-recipient-val') === this.config.recipient);
      });
      document.querySelectorAll('[data-style-val]').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-style-val') === this.config.style);
      });
      document.querySelectorAll('[data-color-group="primary"]').forEach(d => {
        d.classList.toggle('selected', d.getAttribute('data-color-val') === this.config.primaryColour);
      });
      document.querySelectorAll('[data-color-group="secondary"]').forEach(d => {
        d.classList.toggle('selected', d.getAttribute('data-color-val') === this.config.secondaryColour);
      });
      document.querySelectorAll('[data-color-group="accent"]').forEach(d => {
        d.classList.toggle('selected', d.getAttribute('data-color-val') === this.config.accentColour);
      });
      document.querySelectorAll('[data-finish-val]').forEach(b => {
        b.classList.toggle('selected', b.getAttribute('data-finish-val') === this.config.letterFinish);
      });
      document.querySelectorAll('[data-charm-val]').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-charm-val') === this.config.charm);
      });
      document.querySelectorAll('[data-packaging-val]').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-packaging-val') === this.config.packaging);
      });
    }

    goToPrevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.renderCurrentStep();
      }
    }

    handleNextOrSubmit() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.renderCurrentStep();
      } else {
        this.addCustomPieceToBag();
      }
    }

    addCustomPieceToBag() {
      const price = this.calculatePrice();
      const title = `Bint Custom ${capitalize(this.config.accessory)}`;

      if (window.BINT && window.BINT.state) {
        window.BINT.state.addToCart({
          productId: 9999,
          name: title,
          price: price,
          image: 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=700&q=80',
          colour: `${this.config.primaryColour} / ${this.config.secondaryColour}`,
          size: this.config.size,
          quantity: 1,
          isCustom: true,
          customConfig: Object.assign({}, this.config)
        });
      }

      if (window.openCartDrawer) {
        window.openCartDrawer();
      }
    }

    updateSummaryAndPricing() {
      const price = this.calculatePrice();
      const utils = (window.BINT && window.BINT.utils) || {};
      const formatCurrency = utils.formatCurrency || (n => `₦${n}`);
      const getColorHex = utils.getColorHex || (c => '#C6A15B');

      const priceDisplay = document.getElementById('studio-price-display');
      const accDisplay = document.getElementById('summary-accessory');
      const styleDisplay = document.getElementById('summary-style');
      const colorsDisplay = document.getElementById('summary-colors');
      const nameDisplay = document.getElementById('summary-name');
      const finishDisplay = document.getElementById('summary-finish');
      const charmDisplay = document.getElementById('summary-charm');
      const sizeDisplay = document.getElementById('summary-size');
      const packDisplay = document.getElementById('summary-packaging');

      const previewLettering = document.getElementById('preview-lettering');
      const previewCharm = document.getElementById('preview-charm');
      const previewSwatches = document.getElementById('preview-swatches');

      if (priceDisplay) priceDisplay.textContent = formatCurrency(price);
      if (accDisplay) accDisplay.textContent = capitalize(this.config.accessory);
      if (styleDisplay) styleDisplay.textContent = capitalize(this.config.style);
      if (colorsDisplay) colorsDisplay.textContent = `${this.config.primaryColour}, ${this.config.secondaryColour}`;
      if (nameDisplay) nameDisplay.textContent = this.config.nameText || 'None (Unengraved)';
      if (finishDisplay) finishDisplay.textContent = capitalize(this.config.letterFinish);
      if (charmDisplay) charmDisplay.textContent = capitalize(this.config.charm);
      if (sizeDisplay) sizeDisplay.textContent = this.config.size;

      if (packDisplay) {
        const packMap = {
          'signature': 'Signature Velvet Pouch',
          'gift-box': 'Bint Keepsake Box (+₦4.5k)',
          'luxury-set': 'Luxury Gift Suite (+₦8.5k)',
          'minimal': 'Minimal Studio Pack'
        };
        packDisplay.textContent = packMap[this.config.packaging] || 'Signature';
      }

      if (previewLettering) {
        previewLettering.textContent = this.config.nameText || 'BINT & BEADS';
        previewLettering.style.color = (this.config.letterFinish === 'silver') ? '#E4E4E7' :
                                      ((this.config.letterFinish === 'white') ? '#FFFFFF' :
                                      ((this.config.letterFinish === 'black') ? '#222222' : '#C6A15B'));
      }

      if (previewCharm) {
        const charmIcons = { none: '', heart: '&hearts;', crown: '&#9819;', star: '&#9733;', butterfly: '&#10048;', initial: '&bull;' };
        previewCharm.innerHTML = charmIcons[this.config.charm] || '';
      }

      if (previewSwatches) {
        previewSwatches.innerHTML = `
          <span class="swatch-dot" style="background-color: ${getColorHex(this.config.primaryColour)}; width: 14px; height: 14px;"></span>
          <span class="swatch-dot" style="background-color: ${getColorHex(this.config.secondaryColour)}; width: 14px; height: 14px;"></span>
          <span class="swatch-dot" style="background-color: ${getColorHex(this.config.accentColour)}; width: 14px; height: 14px;"></span>
        `;
      }

      const nextBtns = document.querySelectorAll('#studio-next-btn, #studio-next-btn-top');
      nextBtns.forEach(btn => {
        if (this.currentStep === this.totalSteps) {
          btn.innerHTML = `Add Custom Piece to Bag &bull; ${formatCurrency(price)}`;
        }
      });
    }

    bindBespokeModal() {
      const openBtn = document.getElementById('open-bespoke-modal-btn');
      const modalBackdrop = document.getElementById('bespoke-modal-backdrop');
      const closeBtn = document.getElementById('bespoke-modal-close');
      const form = document.getElementById('bespoke-inquiry-form');
      const successBox = document.getElementById('bespoke-success-box');
      const refCodeEl = document.getElementById('bespoke-ref-code');

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
            const ref = 'BB-CUS-' + Math.floor(1000 + Math.random() * 9000);
            if (refCodeEl) refCodeEl.textContent = ref;
            form.style.display = 'none';
            if (successBox) successBox.style.display = 'block';
            if (window.BINT && window.BINT.utils) {
              window.BINT.utils.showToast(`Bespoke inquiry submitted. Reference: ${ref}`, 'gold');
            }
          });
        }
      }
    }
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
  }

  function init() {
    window.customStudio = new CustomStudio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
