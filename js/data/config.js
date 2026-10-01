/**
 * BINT & BEADS - Central Application Configuration
 * Centralized settings, placeholders, and pricing rules.
 */
export const BINT_CONFIG = {
  brandName: 'BINT & BEADS',
  brandTagline: 'Handcrafted Contemporary Luxury',
  currencySymbol: '₦',
  currencyCode: 'NGN',

  // Configurable contact placeholders
  contact: {
    whatsappNumber: '+234800000BINT', // Replaceable placeholder
    whatsappDisplay: '+234 (0) 800 000 2468',
    email: 'concierge@bintandbeads.com',
    instagram: '@bintandbeads',
    instagramUrl: 'https://instagram.com/bintandbeads',
    tiktok: '@bintandbeads',
    studioAddress: 'Studio 14, Victoria Island, Lagos, Nigeria', // Replaceable placeholder
    hours: 'Mon – Sat: 10:00 AM – 6:00 PM WAT'
  },

  // Packaging offerings and pricing
  packagingOptions: [
    {
      id: 'signature',
      name: 'Signature Velvet Pouch',
      tagline: 'Eco-conscious linen-lined velvet with gold debossed ribbon',
      price: 0,
      isDefault: true,
      description: 'Included complimentary with every order.'
    },
    {
      id: 'gift-box',
      name: 'Bint Keepsake Box',
      tagline: 'Hard-shell structured drawer box in rich onyx & warm gold foil',
      price: 4500,
      isDefault: false,
      description: 'Hand-tied ribbon, anti-tarnish foam, and blank gold-foiled note card.'
    },
    {
      id: 'luxury-set',
      name: 'Bespoke Luxury Gift Suite',
      tagline: 'Full luxury suite: presentation box, suede roll & wax-sealed calligraphy card',
      price: 8500,
      isDefault: false,
      description: 'The ultimate gifting statement, prepared by our studio artisans.'
    },
    {
      id: 'minimal',
      name: 'Minimalist Studio Pack',
      tagline: 'Recyclable unbleached protective pouch',
      price: 0,
      isDefault: false,
      description: 'Streamlined, plastic-free zero-waste presentation.'
    }
  ],

  // Delivery options and pricing
  deliveryMethods: [
    {
      id: 'bint_delivery',
      name: 'Bint Courier Delivery',
      tagline: 'Doorstep white-glove dispatch across Lagos & nationwide',
      rates: {
        'lagos-island': 3500,
        'lagos-mainland': 4500,
        'abuja': 6500,
        'port-harcourt': 6500,
        'interstate-other': 7500
      },
      estimatedDays: '1 – 3 Business Days'
    },
    {
      id: 'send_rider',
      name: 'Send My Rider (Pickup)',
      tagline: 'Arrange your personal dispatch or favourite motorcycle rider',
      price: 0,
      instructions: 'Your designated rider will be granted release upon presenting your verification code.'
    },
    {
      id: 'store_pickup',
      name: 'Studio Concierge Collection',
      tagline: 'Collect in person from our Victoria Island atelier',
      price: 0,
      locations: [
        'Studio Atelier — 14 Karimu Kotun, Victoria Island, Lagos',
        'Pop-up Lounge — Lekki Phase 1, Lagos'
      ],
      timeSlots: [
        '10:00 AM – 12:00 PM',
        '12:00 PM – 2:00 PM',
        '2:00 PM – 4:00 PM',
        '4:00 PM – 6:00 PM'
      ]
    }
  ],

  // Custom Studio pricing rules
  customPricing: {
    basePrices: {
      bracelet: 32000,
      necklace: 48000,
      'waist-beads': 28000,
      anklet: 26000,
      'beaded-bag': 85000,
      'phone-charm': 16000,
      keychain: 14000,
      'gift-set': 78000
    },
    styleMultiplier: {
      minimal: 1.0,
      classic: 1.05,
      statement: 1.25,
      traditional: 1.15,
      contemporary: 1.2,
      crystal: 1.3,
      pearl: 1.35,
      'mixed-bead': 1.22
    },
    letterFinishPrice: {
      gold: 3000,
      silver: 2500,
      black: 2000,
      white: 1500
    },
    charmPrice: {
      none: 0,
      heart: 3500,
      crown: 4000,
      star: 3500,
      butterfly: 4500,
      initial: 3000
    }
  },

  // Collections metadata
  collections: [
    {
      id: 'signature',
      slug: 'the-signature-collection',
      name: 'The Signature Collection',
      tagline: 'Iconic monochrome crystals paired with 18k gold-tone accents.',
      description: 'The defining expressions of Bint & Beads. Uncompromising balance between modern architectural silhouettes and heirloom bead mastery.',
      image: 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'noir',
      slug: 'the-noir-collection',
      name: 'The Noir Collection',
      tagline: 'Moody midnight obsidian, matte black onyx and metallic reflections.',
      description: 'For those who find power in deep shadows and stark contrast. Precision-faceted Czech glass beads and matte volcanic elements.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'bridal',
      slug: 'the-bridal-edit',
      name: 'The Bridal Edit',
      tagline: 'Lustrous freshwater baroque pearls, opalescent hues & ethereal radiance.',
      description: 'Created for wedding celebrations, traditional engagement ceremonies, and bridesmaids who appreciate lasting keepsake adornment.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'everyday',
      slug: 'everyday-bint',
      name: 'Everyday Bint',
      tagline: 'Effortless stackable bracelets, minimalist chokers & tactile charms.',
      description: 'Durable, lightweight adornments designed to accompany you through daily rituals, work meetings, and relaxed weekend evenings.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 'gifts',
      slug: 'the-gift-edit',
      name: 'The Gift Edit',
      tagline: 'Curated suites, engraved keepsakes and luxury packaged treasures.',
      description: 'Gifts with genuine gravitas. Ready-to-present boxes adorned with satin ribbons and personalized artisan calligraphy.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80'
    }
  ]
};
