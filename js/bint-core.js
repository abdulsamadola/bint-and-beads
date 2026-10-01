/**
 * BINT & BEADS - Universal Core Script Bundle
 * Works 100% reliably over both HTTP(S) and local file:// protocols.
 * Contains configuration, 24 realistic products, state management, utilities,
 * and page controllers.
 */
(function() {
  'use strict';

  // 1. CONFIGURATION
  const BINT_CONFIG = {
    brandName: 'BINT & BEADS',
    brandTagline: 'Handcrafted Contemporary Luxury',
    currencySymbol: '₦',
    currencyCode: 'NGN',

    contact: {
      whatsappNumber: '+234800000BINT',
      whatsappDisplay: '+234 (0) 800 000 2468',
      email: 'concierge@bintandbeads.com',
      instagram: '@bintandbeads',
      instagramUrl: 'https://instagram.com/bintandbeads',
      studioAddress: 'Studio 14, Victoria Island, Lagos, Nigeria',
      hours: 'Mon – Sat: 10:00 AM – 6:00 PM WAT'
    },

    packagingOptions: [
      {
        id: 'signature',
        name: 'Signature Velvet Pouch',
        tagline: 'Eco-conscious linen-lined velvet with gold debossed ribbon',
        price: 0,
        isDefault: true
      },
      {
        id: 'gift-box',
        name: 'Bint Keepsake Box',
        tagline: 'Hard-shell structured drawer box in rich onyx & warm gold foil',
        price: 4500,
        isDefault: false
      },
      {
        id: 'luxury-set',
        name: 'Bespoke Luxury Gift Suite',
        tagline: 'Full luxury suite: presentation box, suede roll & wax-sealed calligraphy card',
        price: 8500,
        isDefault: false
      },
      {
        id: 'minimal',
        name: 'Minimalist Studio Pack',
        tagline: 'Recyclable unbleached protective pouch',
        price: 0,
        isDefault: false
      }
    ],

    deliveryMethods: [
      {
        id: 'bint_delivery',
        name: 'Bint Courier Delivery',
        rates: {
          'lagos-island': 3500,
          'lagos-mainland': 4500,
          'abuja': 6500,
          'port-harcourt': 6500,
          'interstate-other': 7500
        }
      },
      {
        id: 'send_rider',
        name: 'Send My Rider (Pickup)',
        price: 0
      },
      {
        id: 'store_pickup',
        name: 'Studio Concierge Collection',
        price: 0
      }
    ],

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
    }
  };

  // 2. COMPREHENSIVE PRODUCT CATALOGUE (24 Realistic Luxury Products)
  const PRODUCTS = [
    {
      id: 1,
      slug: 'zara-black-gold-bracelet',
      name: 'Zara Noir & Gold Bracelet',
      category: 'bracelets',
      collection: 'signature',
      price: 35000,
      oldPrice: null,
      shortDescription: 'Faceted obsidian crystal beads interlaced with 18k gold-tone spacers.',
      description: 'The iconic Zara Bracelet marries deep midnight light with warm gilded precision. Hand-strung on high-tensile silicone core with custom 18k gold-tone alloy hardware, designed to be worn solo or stacked.',
      materials: ['Faceted Austrian Crystal', '18K Gold PVD-plated spacers', 'High-tensile stretch filament'],
      colours: ['Black', 'Gold'],
      sizes: ['S (16cm)', 'M (17.5cm)', 'L (19cm)'],
      images: [
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 38,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 2,
      slug: 'amina-pearl-statement-necklace',
      name: 'Amina Baroque Pearl & Onyx Choker',
      category: 'necklaces',
      collection: 'bridal',
      price: 68000,
      oldPrice: 75000,
      shortDescription: 'Lustrous natural baroque freshwater pearls met with hand-cut jet beads.',
      description: 'An arresting juxtaposition of organic pearl contours and geometric dark beads. Finished with an artisan toggled clasp bathed in champagne gold, this statement piece rests gracefully along the collarbone.',
      materials: ['Natural Grade-A Freshwater Pearls', 'Onyx micro-beads', 'Champagne gold vermeil toggle'],
      colours: ['Cream', 'White', 'Black'],
      sizes: ['15-inch Choker', '16.5-inch Classic', '18-inch Princess'],
      images: [
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 22,
      featured: true,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: false,
      badge: 'NEW'
    },
    {
      id: 3,
      slug: 'leila-triple-strand-waist-beads',
      name: 'Leila Royal Amber & Gold Waist Beads',
      category: 'waist-beads',
      collection: 'signature',
      price: 32000,
      oldPrice: null,
      shortDescription: 'Traditional triple-tier tie-on glass waist beads celebrating bodily grace.',
      description: 'Rooted in heritage and reimagined with contemporary poise. Hand-strung with warm translucent amber seed beads, metallic 24k gold-lined glass cylinders, and soft cotton cord made for long-term wear.',
      materials: ['Czech Glass Seed Beads', '24K Gold-lined glass', 'Reinforced Nigerian organic cotton thread'],
      colours: ['Gold', 'Brown', 'Cream'],
      sizes: ['Standard Tie-On (Up to 45 inches)', 'Extended Tie-On (Up to 55 inches)'],
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 45,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 4,
      slug: 'safiya-structural-beaded-tote',
      name: 'Safiya Architectural Beaded Handbag',
      category: 'bags',
      collection: 'signature',
      price: 95000,
      oldPrice: 110000,
      shortDescription: 'Meticulously hand-woven pearlized acrylic tote with satin inner pouch.',
      description: 'Requiring over 34 hours of artisan hand-weaving, the Safiya Tote is a sculptural triumph. Structural crystal grid architecture holds its crisp form while refracting ambient evening light.',
      materials: ['High-density optical acrylic beads', 'Reinforced monofilament skeleton', 'Removable raw silk interior pouch'],
      colours: ['Cream', 'Gold', 'Black'],
      sizes: ['One Size (22cm x 16cm x 7cm)'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 16,
      featured: true,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: false,
      badge: 'ONE OF ONE'
    },
    {
      id: 5,
      slug: 'noor-emerald-crystal-anklet',
      name: 'Noor Emerald & Gold Anklet',
      category: 'anklets',
      collection: 'everyday',
      price: 24000,
      oldPrice: null,
      shortDescription: 'Delicate summer anklet featuring forest green crystals & dangling gold drop.',
      description: 'Subtle yet hypnotic, the Noor anklet gently catches movement around the ankle. Built with water-resistant components, anti-tarnish links, and a secure lobster lock extension.',
      materials: ['Micro-faceted emerald quartz', '14k gold-filled lobster clasp and extension'],
      colours: ['Emerald', 'Gold'],
      sizes: ['Petite (21cm + 4cm ext)', 'Standard (24cm + 4cm ext)', 'Generous (27cm + 4cm ext)'],
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.7,
      reviewCount: 19,
      featured: false,
      newArrival: false,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'READY TO SHIP'
    },
    {
      id: 6,
      slug: 'khalil-matte-onyx-bracelet',
      name: 'Khalil Matte Onyx & Brushed Brass Cuff',
      category: 'bracelets',
      collection: 'noir',
      price: 38000,
      oldPrice: null,
      shortDescription: 'Tactile volcanic lava stone and matte black onyx beads with brushed metal.',
      description: 'An understated unisex piece crafted for tactile weight and grounded aesthetic. Features dark volcanic stones that can also gently absorb subtle oud or essential fragrance.',
      materials: ['Natural Black Onyx', 'Porous Icelandic Lava Beads', 'Brushed Antique Brass Spacers'],
      colours: ['Black', 'Silver'],
      sizes: ['S (17cm)', 'M (18.5cm)', 'L (20cm)', 'XL (21.5cm)'],
      images: [
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 29,
      featured: false,
      newArrival: true,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 7,
      slug: 'zainab-monogram-phone-charm',
      name: 'Zainab Personalized Crystal Phone Strap',
      category: 'phone-charms',
      collection: 'everyday',
      price: 18000,
      oldPrice: null,
      shortDescription: 'Heavyweight wristlet phone charm with acrylic letter beads and freshwater pearl.',
      description: 'Infuse your everyday device with handmade luxury. Threaded with high-strength Kevlar cord to ensure your phone is safely gripped on wrist while maintaining editorial flair.',
      materials: ['Reinforced braided cord', 'Custom gold letter beads', 'Baroque pearl highlight'],
      colours: ['Black', 'White', 'Gold'],
      sizes: ['Wrist Length (22cm)'],
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 54,
      featured: false,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 8,
      slug: 'the-sovereign-gift-suite',
      name: 'The Sovereign Keepsake Gift Suite',
      category: 'gift-sets',
      collection: 'gifts',
      price: 88000,
      oldPrice: 105000,
      shortDescription: 'Curated bracelet, matching choker & signature packaging with personalized note.',
      description: 'The pinnacle of Bint & Beads gifting. Contains our bestselling Zara Noir Bracelet and matching Petite Pearl Choker, nestled in our keepsake presentation box with velvet dust cover and artisan wax seal.',
      materials: ['Baroque Pearl', 'Obsidian crystals', 'Keepsake drawer box', 'Silk velvet pouch'],
      colours: ['Gold', 'Black', 'Cream'],
      sizes: ['Standard Suite (M Bracelet + 16" Choker)'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 31,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 9,
      slug: 'mariam-garnet-royal-necklace',
      name: 'Mariam Deep Garnet & Pearl Rope',
      category: 'necklaces',
      collection: 'signature',
      price: 62000,
      oldPrice: null,
      shortDescription: 'Sumptuous crimson wine glass beads interspersed with irregular Keshi pearls.',
      description: 'Drawing inspiration from vintage West African royalty. A lush crimson strand layered with luminous flat Keshi pearls, evoking depth and subtle romance in equal measure.',
      materials: ['Wine garnet faceted crystal', 'Keshi organic pearls', '24k gold leaf beads'],
      colours: ['Burgundy', 'Red', 'Gold'],
      sizes: ['18-inch Princess', '22-inch Matinee'],
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 14,
      featured: false,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: false,
      badge: 'MADE TO ORDER'
    },
    {
      id: 10,
      slug: 'soraya-iridescent-mini-clutch',
      name: 'Soraya Gilded Mini Beaded Clutch',
      category: 'bags',
      collection: 'signature',
      price: 88000,
      oldPrice: null,
      shortDescription: 'Shimmering metallic gold bead weave bag with detachable cross-body chain.',
      description: 'An evening companion designed to capture celebration lights. Compact enough for sleek hands, yet roomy enough for phone, lip pigment, and car keys.',
      materials: ['Metallic coated faceted crystal beads', 'Gold brass curb chain', 'Magnetic closure'],
      colours: ['Gold', 'Cream'],
      sizes: ['One Size (19cm x 12cm x 5cm)'],
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 11,
      featured: true,
      newArrival: false,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'READY TO SHIP'
    },
    {
      id: 11,
      slug: 'yara-double-loop-anklet',
      name: 'Yara Double Strand Sand & Shell Anklet',
      category: 'anklets',
      collection: 'everyday',
      price: 22000,
      oldPrice: null,
      shortDescription: 'Double tiered warm ivory seed beads with genuine cowrie shell talisman.',
      description: 'Inspired by coastal retreats. Tiered ivory micro-beads complemented by polished African cowrie shells and tiny gold-brushed discs.',
      materials: ['Glass seed beads', 'Natural cowrie shell', 'Gold-plated lobster closure'],
      colours: ['Cream', 'White', 'Gold'],
      sizes: ['S/M (22cm + 3cm ext)', 'M/L (25cm + 3cm ext)'],
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.7,
      reviewCount: 26,
      featured: false,
      newArrival: false,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'READY TO SHIP'
    },
    {
      id: 12,
      slug: 'idris-heirloom-medallion-keychain',
      name: 'Idris Heavyweight Beaded Medallion Charm',
      category: 'keychains',
      collection: 'everyday',
      price: 16000,
      oldPrice: null,
      shortDescription: 'Tactile artisanal fob with solid brass ring and patterned cylinder beads.',
      description: 'Elevate your daily carry keys with a sturdy, tactile beaded loop. Built with solid marine-grade brass hardware and heavy-gauge nylon thread.',
      materials: ['Solid brass split ring & clip', 'African recycled glass beads', 'Natural bone spacer'],
      colours: ['Black', 'Brown', 'Gold'],
      sizes: ['Standard Loop (14cm total drop)'],
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 18,
      featured: false,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'NEW'
    },
    {
      id: 13,
      slug: 'fatima-celestial-royal-blue-beads',
      name: 'Fatima Lapis Lazuli & Royal Blue Waist Beads',
      category: 'waist-beads',
      collection: 'signature',
      price: 36000,
      oldPrice: 42000,
      shortDescription: 'Deep cobalt glass with genuine natural lapis chips and golden starlight spheres.',
      description: 'Vibrant celestial lapis tones designed to accentuate the waistline. Highly durable and non-irritating to skin during long continuous wear.',
      materials: ['Natural Lapis Lazuli fragments', 'Cobalt glass beads', 'Gold metallic seed accents'],
      colours: ['Royal Blue', 'Gold'],
      sizes: ['Standard (Up to 44 inches)', 'Custom Length (+10 inches)'],
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 39,
      featured: false,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 14,
      slug: 'aisha-stacked-tri-tone-bracelets',
      name: 'Aisha Tri-Tone Stack (Set of 3)',
      category: 'bracelets',
      collection: 'everyday',
      price: 48000,
      oldPrice: 56000,
      shortDescription: 'Complementary trio of jet, champagne and ivory micro-bead bracelets.',
      description: 'The definitive wrist stack. Curated to be worn together for rich textural drama or individually for pared-back office refinement.',
      materials: ['Japanese Miyuki Delica beads', '14k gold-filled details', 'Elastic silicone core'],
      colours: ['Black', 'Gold', 'Cream'],
      sizes: ['S (16cm)', 'M (17.5cm)', 'L (19cm)'],
      images: [
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 41,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 15,
      slug: 'halima-minimalist-choker',
      name: 'Halima Delicate Golden Seed Choker',
      category: 'necklaces',
      collection: 'everyday',
      price: 29000,
      oldPrice: null,
      shortDescription: 'Featherlight minimalist choker with micro-faceted gold beads.',
      description: 'Designed as a warm metallic halo around the neck. So lightweight you will forget you are wearing it, yet catches the sun with every subtle breath.',
      materials: ['Gold-filled micro beads', 'Silk cord core', 'Spring ring clasp'],
      colours: ['Gold'],
      sizes: ['14-inch + 2-inch ext', '16-inch + 2-inch ext'],
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 23,
      featured: false,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'NEW'
    },
    {
      id: 16,
      slug: 'the-bridal-party-curated-set',
      name: 'The Bridal Party Keepsake Suite (Set of 4)',
      category: 'gift-sets',
      collection: 'bridal',
      price: 135000,
      oldPrice: 150000,
      shortDescription: 'Custom personalized pearl bracelets for bridesmaids with engraved initials.',
      description: 'Cherish the women standing beside you on your wedding day. Four individually personalized pearl and gold bracelets, each housed in separate ivory boxes with handwritten name tags.',
      materials: ['Freshwater pearls', 'Gold letter accents', 'Luxury presentation drawer boxes'],
      colours: ['White', 'Gold', 'Cream'],
      sizes: ['Mixed Assorted (S & M sizes)'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 17,
      featured: true,
      newArrival: false,
      bestSeller: false,
      customizable: true,
      readyToShip: false,
      badge: 'MADE TO ORDER'
    },
    {
      id: 17,
      slug: 'omari-silver-volcanic-cuff',
      name: 'Omari Silver Obsidian Wristlet',
      category: 'bracelets',
      collection: 'noir',
      price: 34000,
      oldPrice: null,
      shortDescription: 'Pure sterling silver discs paired with dark smoky glass and matte onyx.',
      description: 'A crisp modern counterpoint to warm gold. Sterling silver findings anchor intense matte black beads for a clean, sculptural silhouette.',
      materials: ['Sterling Silver 925 spacer beads', 'Matte black onyx', 'Smoky quartz crystals'],
      colours: ['Black', 'Silver'],
      sizes: ['S (16.5cm)', 'M (18cm)', 'L (19.5cm)'],
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 19,
      featured: false,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'NEW'
    },
    {
      id: 18,
      slug: 'zahra-emerald-keyring-talisman',
      name: 'Zahra Emerald Crystal Key Charm',
      category: 'keychains',
      collection: 'signature',
      price: 17500,
      oldPrice: null,
      shortDescription: 'Compact pocket charm featuring forest green crystal barrel beads.',
      description: 'A pocket-sized statement of tactile luxury. Polished emerald crystal beads accented by gold wire-wrap and solid clasp for handbag or key ring.',
      materials: ['Faceted emerald crystal', '18k gold wire wrap', 'Stainless steel gold carabiner'],
      colours: ['Emerald', 'Gold'],
      sizes: ['Standard (11cm drop)'],
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 15,
      featured: false,
      newArrival: false,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'READY TO SHIP'
    },
    // Additional Mock Products (Items 19 - 24)
    {
      id: 19,
      slug: 'zuri-african-jade-waist-beads',
      name: 'Zuri Moss Jade & Gilded Brass Waist Beads',
      category: 'waist-beads',
      collection: 'signature',
      price: 34000,
      oldPrice: 38000,
      shortDescription: 'Soothing olive jade gemstone beads flanked by hand-turned Ghanaian brass bells.',
      description: 'Earthy, grounding tones that celebrate personal balance. Threaded with genuine moss green jade chips and micro-bells that emit a barely-audible soft whisper of movement.',
      materials: ['Natural African Moss Jade', 'Recycled Ghanaian Brass beads', 'Waterproof cotton core'],
      colours: ['Emerald', 'Gold', 'Brown'],
      sizes: ['Standard (Up to 45 inches)', 'Extended (Up to 55 inches)'],
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 27,
      featured: true,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'NEW'
    },
    {
      id: 20,
      slug: 'khadija-noir-beaded-evening-pouch',
      name: 'Khadija Obsidian Evening Handbag',
      category: 'bags',
      collection: 'noir',
      price: 92000,
      oldPrice: null,
      shortDescription: 'Midnight black woven bead lattice with golden kissing-lock frame.',
      description: 'Architectural refinement for candlelit dinners and red-carpet galas. Features over 1,800 hand-threaded jet crystals forming an intricate, light-catching geometric weave.',
      materials: ['Jet-black faceted crystal beads', 'Solid gold-toned alloy frame', 'Raw silk lining'],
      colours: ['Black', 'Gold'],
      sizes: ['One Size (20cm x 14cm x 6cm)'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 19,
      featured: true,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: false,
      badge: 'ONE OF ONE'
    },
    {
      id: 21,
      slug: 'imani-pearl-disc-anklet',
      name: 'Imani Keshi Pearl & Gilded Disc Anklet',
      category: 'anklets',
      collection: 'bridal',
      price: 25000,
      oldPrice: null,
      shortDescription: 'Delicate freshwater seed pearls interspersed with shimmering gold coin discs.',
      description: 'Graceful coastal elegance. Flat Keshi pearls catch the afternoon warmth, while 14k gold-filled discs glimmer against skin with every step.',
      materials: ['Freshwater Keshi pearls', '14k gold-filled hammered discs', 'Anti-tarnish clasp'],
      colours: ['White', 'Gold', 'Cream'],
      sizes: ['Petite (21cm + 3cm)', 'Standard (24cm + 3cm)', 'Generous (27cm + 3cm)'],
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.8,
      reviewCount: 33,
      featured: false,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 22,
      slug: 'tariq-tiger-eye-mens-bracelet',
      name: 'Tariq Golden Tiger Eye & Onyx Wristlet',
      category: 'bracelets',
      collection: 'noir',
      price: 36000,
      oldPrice: null,
      shortDescription: 'Silky golden chatoyancy of natural tiger eye paired with matte black onyx.',
      description: 'An authoritative masculine or unisex piece. Natural A-grade tiger eye gemstones display mesmerizing bands of golden amber light beneath a polished surface.',
      materials: ['Grade-A South African Tiger Eye', 'Matte black onyx', 'Stainless steel gold bead'],
      colours: ['Brown', 'Gold', 'Black'],
      sizes: ['S (17cm)', 'M (18.5cm)', 'L (20cm)', 'XL (21.5cm)'],
      images: [
        'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 42,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: true,
      badge: 'BESTSELLER'
    },
    {
      id: 23,
      slug: 'nia-carnelian-drop-choker',
      name: 'Nia Fiery Carnelian & Gold Drop Choker',
      category: 'necklaces',
      collection: 'signature',
      price: 54000,
      oldPrice: 60000,
      shortDescription: 'Translucent warm sunset carnelian beads centered with a teardrop crystal drop.',
      description: 'Radiating warmth and confidence. Deep orange and terracotta carnelian stones strung with precision micro-spacers, finished with a custom teardrop accent that nestles gently in the hollow of the throat.',
      materials: ['Natural Madagascar Carnelian', '18k gold PVD components', 'Silk-coated steel core'],
      colours: ['Red', 'Brown', 'Gold'],
      sizes: ['15-inch Choker', '17-inch Princess'],
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 4.9,
      reviewCount: 21,
      featured: false,
      newArrival: true,
      bestSeller: false,
      customizable: true,
      readyToShip: true,
      badge: 'NEW'
    },
    {
      id: 24,
      slug: 'the-royal-bride-keepsake-chest',
      name: 'The Royal Bride Heirloom Presentation Chest',
      category: 'gift-sets',
      collection: 'bridal',
      price: 115000,
      oldPrice: 130000,
      shortDescription: 'Full bridal suite: baroque pearl choker, matching drop earrings & waist strand.',
      description: 'The crowning bridal adornment. Packaged inside a custom hand-bound black velvet keepsake chest featuring brass clasp hardware, silk ribbon ties, and gold-foiled blessing note.',
      materials: ['Baroque pearls', 'Austrian crystals', 'Velvet presentation chest', 'Calligraphy note'],
      colours: ['White', 'Cream', 'Gold'],
      sizes: ['Bridal Standard (Custom length on request)'],
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
      ],
      rating: 5.0,
      reviewCount: 28,
      featured: true,
      newArrival: false,
      bestSeller: true,
      customizable: true,
      readyToShip: false,
      badge: 'ONE OF ONE'
    }
  ];

  // 3. UTILITIES
  function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) amount = 0;
    const formatted = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(amount);
    return `₦${formatted}`;
  }

  function getProductById(id) {
    const numId = parseInt(id, 10);
    return PRODUCTS.find(p => p.id === numId) || null;
  }

  function getProductBySlug(slug) {
    return PRODUCTS.find(p => p.slug === slug) || null;
  }

  function getCategoryLabel(cat) {
    const map = {
      'bracelets': 'Bracelets',
      'necklaces': 'Necklaces',
      'waist-beads': 'Waist Beads',
      'anklets': 'Anklets',
      'bags': 'Beaded Bags',
      'phone-charms': 'Phone Charms',
      'keychains': 'Keychains',
      'gift-sets': 'Gift Sets'
    };
    return map[cat] || cat;
  }

  function getColorHex(name) {
    const map = {
      'Black': '#111111',
      'Gold': '#C6A15B',
      'Silver': '#D4D4D8',
      'White': '#FFFFFF',
      'Cream': '#F5EFEB',
      'Brown': '#784D2B',
      'Emerald': '#1E5838',
      'Royal Blue': '#1E3A8A',
      'Burgundy': '#6B1D2F',
      'Red': '#A92323',
      'Pink': '#E8B4B8',
      'Purple': '#582C66'
    };
    return map[name] || '#C6A15B';
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match]));
  }

  function getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function showToast(message, type = 'gold') {
    let container = document.getElementById('bint-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'bint-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 3500);
  }

  function getFallbackImage(title = 'BINT & BEADS') {
    return 'assets/images/emblem.svg';
  }

  function renderProductCard(product, options = {}) {
    const isWishlisted = options.isWishlisted || isProductWishlisted(product.id);
    const primaryImg = product.images[0] || 'assets/images/emblem.svg';
    const secondaryImg = product.images[1] || null;

    const badgeClassMap = {
      'NEW': 'badge-new',
      'BESTSELLER': 'badge-bestseller',
      'ONE OF ONE': 'badge-oneofone',
      'READY TO SHIP': 'badge-ready',
      'MADE TO ORDER': 'badge-custom'
    };

    const badgeHtml = product.badge ? `
      <div class="product-card-badges">
        <span class="badge ${badgeClassMap[product.badge] || 'badge-new'}">${product.badge}</span>
      </div>` : '';

    const secondaryImgHtml = secondaryImg ? `
      <img class="product-card-image secondary-img" src="${secondaryImg}" alt="${escapeHtml(product.name)} view 2" loading="lazy" onerror="this.src='${primaryImg}'">` : '';

    const oldPriceHtml = product.oldPrice ? `
      <span class="price-old">${formatCurrency(product.oldPrice)}</span>` : '';

    const swatchesHtml = product.colours && product.colours.length > 1 ? `
      <div class="product-card-swatches">
        ${product.colours.map(c => `
          <span class="swatch-dot" style="background-color: ${getColorHex(c)}" title="${escapeHtml(c)}"></span>
        `).join('')}
      </div>` : '';

    return `
      <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
        <div class="product-card-image-wrap">
          ${badgeHtml}
          <button type="button" class="product-card-wishlist ${isWishlisted ? 'active' : ''}" 
                  data-wishlist-id="${product.id}" 
                  aria-label="Save ${escapeHtml(product.name)} to wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <a href="product.html?id=${product.id}" class="product-card-link-wrap">
            <img class="product-card-image primary-img" src="${primaryImg}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.src='assets/images/emblem.svg'">
            ${secondaryImgHtml}
          </a>
          <button type="button" class="product-card-quick-add" data-quick-add="${product.id}">
            Quick Add &bull; ${formatCurrency(product.price)}
          </button>
        </div>

        <div class="product-card-info">
          <span class="product-card-category">${getCategoryLabel(product.category)}</span>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${escapeHtml(product.name)}</a>
          </h3>
          <div class="product-card-price-row">
            <span class="price-current">${formatCurrency(product.price)}</span>
            ${oldPriceHtml}
          </div>
          ${swatchesHtml}
        </div>
      </article>
    `;
  }

  // 4. STATE MANAGEMENT
  const STORAGE_KEYS = {
    CART: 'bint_cart',
    WISHLIST: 'bint_wishlist',
    ORDERS: 'bint_orders',
    CUSTOM_DESIGN: 'bint_custom_design',
    REVIEWS: 'bint_reviews'
  };

  function getCart() {
    return getStorage(STORAGE_KEYS.CART, []);
  }

  function saveCart(cart) {
    setStorage(STORAGE_KEYS.CART, cart);
    window.dispatchEvent(new CustomEvent('bint:cart-updated', { detail: { cart } }));
  }

  function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex(c => {
      if (c.productId !== item.productId) return false;
      if (c.colour !== item.colour) return false;
      if (c.size !== item.size) return false;
      if (item.isCustom || c.isCustom) {
        return JSON.stringify(item.customConfig) === JSON.stringify(c.customConfig);
      }
      return true;
    });

    if (existingIndex > -1) {
      cart[existingIndex].quantity += (item.quantity || 1);
    } else {
      cart.push({
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        colour: item.colour || 'Default',
        size: item.size || 'Standard',
        quantity: item.quantity || 1,
        isCustom: Boolean(item.isCustom),
        customConfig: item.customConfig || null
      });
    }

    saveCart(cart);
    showToast(`Added "${item.name}" to your bag`, 'gold');
  }

  function updateQuantity(cartItemId, delta) {
    const cart = getCart();
    const index = cart.findIndex(i => i.id === cartItemId);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        showToast('Item removed from your bag', 'info');
      }
      saveCart(cart);
    }
  }

  function removeFromCart(cartItemId) {
    let cart = getCart();
    const item = cart.find(i => i.id === cartItemId);
    cart = cart.filter(i => i.id !== cartItemId);
    saveCart(cart);
    if (item) showToast(`Removed "${item.name}" from your bag`, 'info');
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function getCartSubtotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  function getWishlist() {
    return getStorage(STORAGE_KEYS.WISHLIST, []);
  }

  function isProductWishlisted(productId) {
    const list = getWishlist();
    const id = parseInt(productId, 10);
    return list.includes(id);
  }

  function toggleWishlist(productId) {
    const id = parseInt(productId, 10);
    let list = getWishlist();
    const product = getProductById(id);
    const name = product ? product.name : 'Item';

    if (list.includes(id)) {
      list = list.filter(item => item !== id);
      setStorage(STORAGE_KEYS.WISHLIST, list);
      window.dispatchEvent(new CustomEvent('bint:wishlist-updated', { detail: { wishlist: list } }));
      showToast(`Removed from your wishlist`, 'info');
      return false;
    } else {
      list.push(id);
      setStorage(STORAGE_KEYS.WISHLIST, list);
      window.dispatchEvent(new CustomEvent('bint:wishlist-updated', { detail: { wishlist: list } }));
      showToast(`Saved "${name}" to your wishlist`, 'gold');
      return true;
    }
  }

  function getOrders() {
    return getStorage(STORAGE_KEYS.ORDERS, []);
  }

  function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    setStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  function getOrderByReference(reference) {
    const orders = getOrders();
    const cleanRef = (reference || '').trim().toUpperCase();
    return orders.find(o => o.orderRef.toUpperCase() === cleanRef) || null;
  }

  // Expose global namespace
  window.BINT = {
    CONFIG: BINT_CONFIG,
    PRODUCTS: PRODUCTS,
    utils: {
      formatCurrency,
      getProductById,
      getProductBySlug,
      getCategoryLabel,
      getColorHex,
      escapeHtml,
      showToast,
      renderProductCard,
      getStorage,
      setStorage
    },
    state: {
      getCart,
      saveCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartCount,
      getCartSubtotal,
      getWishlist,
      isProductWishlisted,
      toggleWishlist,
      getOrders,
      saveOrder,
      getOrderByReference
    }
  };

  // Seed demo orders if none exist
  (function seedDemoOrders() {
    const existing = getOrders();
    if (!existing || existing.length === 0) {
      const demo1 = {
        orderRef: 'BB-2026-0184',
        createdAt: '2026-09-28T14:30:00.000Z',
        customer: { firstName: 'Amina', lastName: 'Bello', email: 'amina.bello@example.com', phone: '+2348031234567' },
        items: [
          { id: 'demo-1', productId: 1, name: 'Zara Noir & Gold Bracelet', price: 35000, quantity: 1, colour: 'Black', size: 'M (17.5cm)', image: 'https://images.unsplash.com/photo-1611591475103-4fa1b7765a7f?auto=format&fit=crop&w=600&q=80' },
          { id: 'demo-2', productId: 3, name: 'Leila Royal Amber & Gold Waist Beads', price: 32000, quantity: 1, colour: 'Gold', size: 'Standard Tie-On', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' }
        ],
        packaging: { id: 'gift-box', name: 'Bint Keepsake Box', price: 4500 },
        delivery: { id: 'bint_delivery', methodName: 'Bint Courier Delivery', price: 3500, address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos' },
        subtotal: 67000,
        packagingPrice: 4500,
        deliveryPrice: 3500,
        total: 75000,
        statusStep: 3
      };
      const demo2 = {
        orderRef: 'BB-2026-0092',
        createdAt: '2026-09-15T11:15:00.000Z',
        customer: { firstName: 'Zainab', lastName: 'Yusuf', email: 'zainab.y@example.com', phone: '+2348098765432' },
        items: [
          { id: 'demo-3', productId: 4, name: 'Safiya Architectural Beaded Handbag', price: 95000, quantity: 1, colour: 'Cream', size: 'One Size', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' }
        ],
        packaging: { id: 'luxury-set', name: 'Bespoke Luxury Gift Suite', price: 8500 },
        delivery: { id: 'store_pickup', methodName: 'Studio Concierge Collection', price: 0, pickupLocation: 'Studio Atelier — 14 Karimu Kotun, Victoria Island, Lagos' },
        subtotal: 95000,
        packagingPrice: 8500,
        deliveryPrice: 0,
        total: 103500,
        statusStep: 7
      };
      saveOrder(demo2);
      saveOrder(demo1);
    }
  })();

  // 5. GLOBAL UI CONTROLLER (Header, Navigation, Logo, Search, Cart Drawer)
  function initGlobalUI() {
    // 1. Render Header with Luxury Logo
    const headerContainer = document.getElementById('bint-header');
    if (headerContainer) {
      headerContainer.className = 'site-header';
      headerContainer.innerHTML = `
        <div class="container header-inner">
          <button type="button" class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Open mobile navigation menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="index.html" class="header-brand-logo-link" aria-label="Bint and Beads Home">
            <svg class="brand-logo-svg" viewBox="0 0 320 64" width="220" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="headerLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F5E8C7" />
                  <stop offset="50%" stop-color="#C6A15B" />
                  <stop offset="100%" stop-color="#8C6527" />
                </linearGradient>
              </defs>
              <!-- Left Monogram Icon -->
              <g transform="translate(4, 4) scale(0.56)">
                <circle cx="50" cy="50" r="44" stroke="url(#headerLogoGold)" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="39" stroke="url(#headerLogoGold)" stroke-width="1" opacity="0.6"/>
                <circle cx="50" cy="6" r="3.5" fill="url(#headerLogoGold)"/>
                <circle cx="94" cy="50" r="3.5" fill="url(#headerLogoGold)"/>
                <circle cx="50" cy="94" r="3.5" fill="url(#headerLogoGold)"/>
                <circle cx="6" cy="50" r="3.5" fill="url(#headerLogoGold)"/>
                <text x="22" y="62" font-family="'Cormorant Garamond', Georgia, serif" font-size="40" font-weight="400" fill="url(#headerLogoGold)">B</text>
                <text x="44" y="64" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-style="italic" font-weight="300" fill="currentColor" stroke="url(#headerLogoGold)" stroke-width="0.8">B</text>
                <circle cx="48" cy="48" r="2.5" fill="url(#headerLogoGold)"/>
              </g>
              <!-- Brand Typography -->
              <g transform="translate(74, 34)">
                <text x="0" y="0" font-family="'Cormorant Garamond', Georgia, serif" font-size="24" font-weight="400" letter-spacing="4" fill="currentColor">BINT <tspan fill="url(#headerLogoGold)" font-style="italic" font-weight="300">&amp;</tspan> BEADS</text>
                <text x="2" y="15" font-family="'Manrope', -apple-system, sans-serif" font-size="7.5" font-weight="600" letter-spacing="3.5" fill="#C6A15B">LAGOS &bull; HANDCRAFTED LUXURY</text>
              </g>
            </svg>
          </a>

          <nav class="header-nav" aria-label="Main Navigation">
            <a href="index.html" class="nav-link" data-nav="home">Home</a>
            <a href="shop.html" class="nav-link" data-nav="shop">Shop</a>
            <a href="collections.html" class="nav-link" data-nav="collections">Collections</a>
            <a href="customize.html" class="nav-link nav-link-highlight" data-nav="customize">Customise</a>
            <a href="about.html" class="nav-link" data-nav="about">Our Story</a>
            <a href="reviews.html" class="nav-link" data-nav="reviews">Reviews</a>
          </nav>

          <div class="header-actions">
            <button type="button" class="header-action-btn" id="search-toggle-btn" aria-label="Open search catalogue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <a href="wishlist.html" class="header-action-btn" id="wishlist-link-btn" aria-label="View saved wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="header-action-badge" id="wishlist-badge-count">0</span>
            </a>

            <button type="button" class="header-action-btn" id="cart-drawer-toggle" aria-label="Open shopping bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="header-action-badge" id="cart-badge-count">0</span>
            </button>
          </div>
        </div>
      `;

      // Active nav link highlight
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      headerContainer.querySelectorAll('.header-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }

    // 2. Render Announcement Bar
    const announcementContainer = document.getElementById('bint-announcement-bar');
    if (announcementContainer && !announcementContainer.innerHTML.trim()) {
      announcementContainer.className = 'announcement-bar';
      announcementContainer.innerHTML = `
        <div class="announcement-text" id="announcement-ticker">
          Complimentary signature packaging on all orders &bull; Handcrafted in Lagos, Dispatched Worldwide
        </div>
      `;
    }

    // 3. Render Footer with Luxury Logo
    const footerContainer = document.getElementById('bint-footer');
    if (footerContainer && !footerContainer.innerHTML.trim()) {
      footerContainer.className = 'site-footer';
      footerContainer.innerHTML = `
        <div class="container">
          <div class="footer-newsletter-box">
            <div class="newsletter-text">
              <h3>ENTER THE WORLD OF BINT &amp; BEADS</h3>
              <p>Receive preview access to limited bead capsules, private bespoke slots, and studio essays.</p>
            </div>
            <form class="newsletter-form" id="newsletter-form">
              <input type="email" class="newsletter-input" placeholder="Enter your email address" required aria-label="Email address for newsletter">
              <button type="submit" class="btn btn-gold btn-sm">Subscribe</button>
            </form>
          </div>

          <div class="footer-top-grid">
            <div class="footer-brand-col">
              <svg class="brand-logo-svg" viewBox="0 0 320 64" width="220" height="44" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 16px;">
                <defs>
                  <linearGradient id="footerLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F5E8C7" />
                    <stop offset="50%" stop-color="#C6A15B" />
                    <stop offset="100%" stop-color="#8C6527" />
                  </linearGradient>
                </defs>
                <g transform="translate(4, 4) scale(0.56)">
                  <circle cx="50" cy="50" r="44" stroke="url(#footerLogoGold)" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="39" stroke="url(#footerLogoGold)" stroke-width="1" opacity="0.6"/>
                  <circle cx="50" cy="6" r="3.5" fill="url(#footerLogoGold)"/>
                  <circle cx="94" cy="50" r="3.5" fill="url(#footerLogoGold)"/>
                  <circle cx="50" cy="94" r="3.5" fill="url(#footerLogoGold)"/>
                  <circle cx="6" cy="50" r="3.5" fill="url(#footerLogoGold)"/>
                  <text x="22" y="62" font-family="'Cormorant Garamond', Georgia, serif" font-size="40" font-weight="400" fill="url(#footerLogoGold)">B</text>
                  <text x="44" y="64" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-style="italic" font-weight="300" fill="#FFFFFF" stroke="url(#footerLogoGold)" stroke-width="0.8">B</text>
                  <circle cx="48" cy="48" r="2.5" fill="url(#footerLogoGold)"/>
                </g>
                <g transform="translate(74, 34)">
                  <text x="0" y="0" font-family="'Cormorant Garamond', Georgia, serif" font-size="24" font-weight="400" letter-spacing="4" fill="#FFFFFF">BINT <tspan fill="url(#footerLogoGold)" font-style="italic" font-weight="300">&amp;</tspan> BEADS</text>
                  <text x="2" y="15" font-family="'Manrope', -apple-system, sans-serif" font-size="7.5" font-weight="600" letter-spacing="3.5" fill="#C6A15B">LAGOS &bull; HANDCRAFTED LUXURY</text>
                </g>
              </svg>
              <p>Dedicated to elevating the sacred tradition of African bead craftsmanship. Each piece is thoughtfully composed by hand in our Lagos atelier to reflect individuality, poise, and personal heritage.</p>
              <div class="text-meta" style="color: var(--color-gold);">LAGOS &bull; LONDON &bull; ACCRA</div>
            </div>

            <div class="footer-col">
              <h4>SHOP</h4>
              <ul>
                <li><a href="shop.html?filter=newArrival">New Arrivals</a></li>
                <li><a href="shop.html?filter=bestSeller">Most Loved</a></li>
                <li><a href="collections.html">Collections</a></li>
                <li><a href="customize.html">Custom Studio</a></li>
                <li><a href="shop.html?category=gift-sets">The Gift Edit</a></li>
                <li><a href="shop.html?readyToShip=true">Ready to Ship</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>ABOUT</h4>
              <ul>
                <li><a href="about.html">Our Story</a></li>
                <li><a href="about.html#craftsmanship">Artisan Craftsmanship</a></li>
                <li><a href="reviews.html">Client Stories &amp; Reviews</a></li>
                <li><a href="customize.html#bespoke">Bespoke Inquiries</a></li>
                <li><a href="track-order.html">Track Your Order</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>HELP &amp; CONCIERGE</h4>
              <ul>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="faq.html">FAQ &amp; Sizing Guide</a></li>
                <li><a href="faq.html#delivery">Delivery &amp; Courier</a></li>
                <li><a href="faq.html#care">Bead Care &amp; Longevity</a></li>
                <li><a href="https://wa.me/2348000002468" target="_blank" rel="noopener">WhatsApp Concierge</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>&copy; ${new Date().getFullYear()} BINT &amp; BEADS. All rights reserved. Handcrafted with intention.</div>
            <div class="footer-bottom-links">
              <a href="faq.html#terms">Terms of Service</a>
              <a href="faq.html#privacy">Privacy Policy</a>
              <a href="track-order.html">Order Status</a>
            </div>
          </div>
        </div>
      `;
    }

    // 4. Inject Drawers and Modals
    let drawerContainer = document.getElementById('bint-global-drawers');
    if (!drawerContainer) {
      drawerContainer = document.createElement('div');
      drawerContainer.id = 'bint-global-drawers';
      document.body.appendChild(drawerContainer);
    }

    drawerContainer.innerHTML = `
      <!-- Mobile Drawer -->
      <div class="mobile-drawer-overlay" id="mobile-drawer-overlay" aria-hidden="true">
        <div class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div class="mobile-drawer-header">
            <img src="assets/images/logo.svg" alt="BINT &amp; BEADS" style="height: 38px;">
            <button type="button" class="modal-close-btn" id="mobile-drawer-close" aria-label="Close navigation menu">&times;</button>
          </div>
          <nav class="mobile-drawer-nav">
            <a href="index.html" class="mobile-drawer-link">Home</a>
            <a href="shop.html" class="mobile-drawer-link">Shop Collection</a>
            <a href="collections.html" class="mobile-drawer-link">Collections</a>
            <a href="customize.html" class="mobile-drawer-link" style="color: var(--color-deep-gold);">Bint Custom Studio</a>
            <a href="about.html" class="mobile-drawer-link">Our Story</a>
            <a href="reviews.html" class="mobile-drawer-link">Customer Reviews</a>
          </nav>
          <div class="mobile-drawer-secondary">
            <a href="wishlist.html" class="mobile-secondary-link">&hearts; Saved Wishlist</a>
            <a href="track-order.html" class="mobile-secondary-link">&boxbox; Track An Order</a>
            <a href="contact.html" class="mobile-secondary-link">&phone; Concierge / WhatsApp</a>
            <a href="faq.html" class="mobile-secondary-link">&#9432; FAQ &amp; Sizing</a>
          </div>
        </div>
      </div>

      <!-- Cart Drawer -->
      <div class="cart-drawer-overlay" id="cart-drawer-overlay" aria-hidden="true">
        <div class="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          <div class="cart-drawer-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="assets/images/emblem.svg" alt="Emblem" style="width: 28px; height: 28px;">
              <h2 class="cart-drawer-title" style="margin: 0; font-size: 1.35rem;">YOUR BAG (<span id="cart-drawer-count">0</span>)</h2>
            </div>
            <button type="button" class="modal-close-btn" id="cart-drawer-close" aria-label="Close shopping bag">&times;</button>
          </div>
          <div class="cart-drawer-body" id="cart-drawer-items"></div>
          <div class="cart-drawer-footer" id="cart-drawer-footer-sec">
            <div class="cart-subtotal-row">
              <span class="cart-subtotal-label">Subtotal</span>
              <span class="cart-subtotal-val" id="cart-drawer-subtotal">₦0</span>
            </div>
            <p class="cart-shipping-note">Taxes &amp; simulated shipping calculated at checkout.</p>
            <div class="cart-drawer-btns">
              <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
              <a href="cart.html" class="btn btn-secondary btn-block">View Full Bag</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Overlay -->
      <div class="search-modal-overlay" id="search-modal-overlay" aria-hidden="true">
        <div class="search-modal-container">
          <div class="container">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
              <button type="button" class="modal-close-btn" id="search-modal-close" aria-label="Close search">&times;</button>
            </div>
            <div class="search-input-wrap">
              <input type="text" class="search-main-input" id="search-live-input" placeholder="Search bracelets, waist beads, pearls..." autofocus aria-label="Search products">
            </div>
            <div class="search-quick-tags">
              <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-grey); margin-right: 4px;">Popular:</span>
              <button type="button" class="search-tag" data-tag="Noir">Noir</button>
              <button type="button" class="search-tag" data-tag="Pearl">Baroque Pearl</button>
              <button type="button" class="search-tag" data-tag="Gold">Gold Spacers</button>
              <button type="button" class="search-tag" data-tag="Waist">Waist Beads</button>
              <button type="button" class="search-tag" data-tag="Bag">Beaded Bag</button>
            </div>
            <div id="search-live-results" class="search-results-grid"></div>
          </div>
        </div>
      </div>
    `;

    bindGlobalUIEvents();
    updateBadges();
  }

  function updateBadges() {
    const cartCount = getCartCount();
    const wishlist = getWishlist();
    const cartBadge = document.getElementById('cart-badge-count');
    const wishlistBadge = document.getElementById('wishlist-badge-count');

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
      wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  function bindGlobalUIEvents() {
    // Header scroll
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }, { passive: true });
    }

    // Mobile Drawer
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const mobileClose = document.getElementById('mobile-drawer-close');
    const mobileOverlay = document.getElementById('mobile-drawer-overlay');

    if (mobileBtn && mobileOverlay) {
      mobileBtn.addEventListener('click', () => {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
      if (mobileClose) {
        mobileClose.addEventListener('click', () => {
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
      mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Cart Drawer
    const cartToggle = document.getElementById('cart-drawer-toggle');
    const cartClose = document.getElementById('cart-drawer-close');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    window.openCartDrawer = function() {
      if (cartOverlay) {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartDrawerItems();
      }
    };

    window.closeCartDrawer = function() {
      if (cartOverlay) {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    if (cartToggle) cartToggle.addEventListener('click', window.openCartDrawer);
    if (cartClose) cartClose.addEventListener('click', window.closeCartDrawer);
    if (cartOverlay) {
      cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) window.closeCartDrawer();
      });
    }

    // Search Modal
    const searchToggle = document.getElementById('search-toggle-btn');
    const searchClose = document.getElementById('search-modal-close');
    const searchOverlay = document.getElementById('search-modal-overlay');
    const searchInput = document.getElementById('search-live-input');

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 150);
          handleSearch(searchInput.value || '');
        }
      });

      const closeSearch = () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      };

      if (searchClose) searchClose.addEventListener('click', closeSearch);
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
      });

      if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
      }

      document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = tag.getAttribute('data-tag');
            handleSearch(searchInput.value);
            searchInput.focus();
          }
        });
      });
    }

    // Delegated Global Clicks
    document.addEventListener('click', (e) => {
      // Quick Add Button
      const quickAddBtn = e.target.closest('[data-quick-add]');
      if (quickAddBtn) {
        e.preventDefault();
        const pid = quickAddBtn.getAttribute('data-quick-add');
        const product = getProductById(pid);
        if (product) {
          addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            colour: product.colours ? product.colours[0] : 'Default',
            size: product.sizes ? product.sizes[0] : 'Standard',
            quantity: 1
          });
          window.openCartDrawer();
        }
      }

      // Wishlist Heart Toggle Button
      const wishlistBtn = e.target.closest('[data-wishlist-id]');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = wishlistBtn.getAttribute('data-wishlist-id');
        const isSaved = toggleWishlist(pid);
        wishlistBtn.classList.toggle('active', isSaved);
        const svg = wishlistBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isSaved ? 'currentColor' : 'none');
      }
    });

    // Global Escape Key Listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeCartDrawer();
        if (searchOverlay) searchOverlay.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('bint:cart-updated', () => {
      updateBadges();
      renderCartDrawerItems();
    });

    window.addEventListener('bint:wishlist-updated', () => {
      updateBadges();
    });
  }

  function renderCartDrawerItems() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const countEl = document.getElementById('cart-drawer-count');
    const footerSec = document.getElementById('cart-drawer-footer-sec');
    if (!container) return;

    const cart = getCart();
    const count = getCartCount();
    const subtotal = getCartSubtotal();

    if (countEl) countEl.textContent = count;
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 40px 10px;">
          <div class="empty-state-icon">
            <img src="assets/images/emblem.svg" alt="Bag" style="width: 44px; height: 44px; opacity: 0.6; margin: 0 auto;">
          </div>
          <h3 class="empty-state-title" style="font-size: 1.35rem;">Your bag is empty</h3>
          <p class="empty-state-desc" style="font-size: 0.85rem;">Discover our handcrafted collection or compose a personalized creation in our studio.</p>
          <a href="shop.html" class="btn btn-secondary btn-sm" onclick="window.closeCartDrawer();">Explore The Collection</a>
        </div>
      `;
      if (footerSec) footerSec.style.display = 'none';
      return;
    }

    if (footerSec) footerSec.style.display = 'flex';

    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-cart-id="${item.id}">
        <img class="cart-item-img" src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='assets/images/emblem.svg'">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
          <div class="cart-item-meta">${escapeHtml(item.colour)} / ${escapeHtml(item.size)}</div>
          <div class="cart-item-price">${formatCurrency(item.price)}</div>
          <div class="qty-control" style="height: 32px; margin-top: 6px;">
            <button type="button" class="qty-btn" onclick="window.BINT.state.updateQuantity('${item.id}', -1)" style="width: 28px; font-size: 0.9rem;">&minus;</button>
            <span style="width: 32px; text-align: center; font-size: 0.85rem; font-weight: 600;">${item.quantity}</span>
            <button type="button" class="qty-btn" onclick="window.BINT.state.updateQuantity('${item.id}', 1)" style="width: 28px; font-size: 0.9rem;">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <button type="button" class="cart-item-remove" onclick="window.BINT.state.removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `).join('');
  }

  function handleSearch(term) {
    const resultsContainer = document.getElementById('search-live-results');
    if (!resultsContainer) return;
    const query = (term || '').trim().toLowerCase();

    let matches = [];
    if (!query) {
      matches = PRODUCTS.slice(0, 4);
    } else {
      matches = PRODUCTS.filter(p => {
        return p.name.toLowerCase().includes(query) ||
               p.category.toLowerCase().includes(query) ||
               p.collection.toLowerCase().includes(query) ||
               p.description.toLowerCase().includes(query);
      }).slice(0, 8);
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 32px 0;">
          <p style="font-family: var(--font-serif); font-size: 1.25rem;">No pieces found for "${escapeHtml(term)}"</p>
          <p style="font-size: 0.85rem; color: var(--color-grey); margin-top: 6px;">Try searching for "Gold", "Baroque", "Obsidian", or "Bag".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <a href="product.html?id=${p.id}" class="search-result-item">
        <img class="search-result-img" src="${p.images[0]}" alt="${escapeHtml(p.name)}" onerror="this.src='assets/images/emblem.svg'">
        <div class="search-result-details">
          <h4>${escapeHtml(p.name)}</h4>
          <span>${formatCurrency(p.price)}</span>
        </div>
      </a>
    `).join('');
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalUI);
  } else {
    initGlobalUI();
  }

})();
