/** Approved marketing copy — source: Website Copy brief / master prompt */

export const SITE = {
  name: 'Amit Traders',
  legalName: 'Amit Traders India',
  city: 'Mumbai',
  moq: 50,
  yearsExperience: '15+',
  scaleUnits: '50 to 50,000+',
} as const

export const SEO = {
  home: {
    title: 'Amit Traders | Premium Leather Corporate Gifting & Manufacturing',
    description:
      'Elevate your brand with handcrafted leather goods and corporate gift sets. 15+ years manufacturing for enterprises across India. Custom embossing, bulk orders from 50 units.',
    keywords:
      'corporate gifting, leather gifts, bulk leather products, custom logo embossing, Mumbai leather manufacturer',
  },
  about: {
    title: 'About Amit Traders | Leather Manufacturing Excellence',
    description:
      'Crafting excellence for 15+ years. Amit Traders manufactures fine leather goods and customized corporate keepsakes for enterprises across India.',
  },
  whyChooseUs: {
    title: 'Why Choose Amit Traders | Corporate Leather Gifting Partner',
    description:
      'Why procurement and HR leaders trust Amit Traders for direct factory pricing, dedicated account management, quality assurance, and pre-production samples.',
  },
  products: {
    title: 'Products | Executive Leather Bags, Wallets & Corporate Combos',
    description:
      'Browse executive bags, leather accessories, and custom corporate gift combo sets. B2B bulk quotations — minimum order 50 units.',
  },
  contact: {
    title: 'Contact & Request a Quote | Amit Traders',
    description:
      "Let's create your custom corporate gifting solution. Request a catalog, physical samples, and personalized quotation.",
  },
} as const

/** Verified Unsplash URLs (commercial use) — single source for section imagery */
export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600&q=80',
  aboutStory: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1200&q=80',
  aboutHero: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80',
  whyChooseHero: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1600&q=80',
  corporateGift: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1200&q=80',
  festiveEvent: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=1200&q=80',
  laptopBag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1200&q=80',
  leatherTexture: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
  foilStamping: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
  laserEngraving: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
  manufacturing: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
  leatherette: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  nylonBag: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
} as const

export const HERO = {
  title: 'Elevate Your Brand Identity with Handcrafted Leather Goods & Corporate Gift Sets',
  subtitle:
    'Trusted by leading enterprises across India for over 15 years. Premium craftsmanship, custom logo embossing, and seamless bulk manufacturing for corporate events & festive occasions.',
  primaryCta: 'Request a Quote',
  secondaryCta: 'Explore Product Catalog',
} as const

export const TRUST_STRIP = [
  { value: '15+ Years', label: 'Manufacturing Excellence' },
  { value: 'Custom Branding', label: 'Embossing & Engraving' },
  { value: 'Flexible MOQ', label: 'Timely Bulk Delivery' },
  { value: 'Bespoke Solutions', label: 'Product & Material Customization' },
] as const

export const ABOUT_HOME = {
  title: '15+ Years of Manufacturing Fine Leather Goods & Corporate Keepsakes',
  body: `Amit Traders is a Mumbai-based manufacturer and supplier specializing in genuine leather goods, executive accessories, and customized bulk corporate gift solutions. For over 15 years we have partnered with corporate HR teams, procurement managers, event planners, and marketing executives who need reliable manufacturing, brand integration, and timely delivery at scale.`,
} as const

export const PRODUCT_CATEGORIES = [
  {
    number: '01',
    slug: 'executive-bags-travel',
    title: 'Executive Bags & Travel Gear',
    items: ['Laptop Bags', 'Laptop Trolley Bags', 'Sling Bags', 'Nylon Backpacks'],
    description:
      'Executive laptop bags, trolley cases, sling bags, and water-resistant nylon backpacks for business travel and corporate programs.',
    image: IMAGES.laptopBag,
  },
  {
    number: '02',
    slug: 'leather-accessories',
    title: 'Small Leather Accessories',
    items: ['Gents Wallets', 'Card Holders', 'Passport Holders', 'Keychains'],
    description:
      'Refined wallets, card holders, passport covers, and keychains crafted in genuine leather for corporate gifting and retail.',
    image: IMAGES.wallet,
  },
  {
    number: '03',
    slug: 'corporate-combos',
    title: 'Custom Gift Combo Sets',
    items: ['Keychain & Belt Combo', '3-in-1 Combo Set'],
    description:
      'Curated combo sets combining complementary leather accessories — ideal for employee onboarding and client appreciation.',
    image: IMAGES.corporateGift,
  },
  {
    number: '04',
    slug: 'festive-corporate-events',
    title: 'Festive & Corporate Event Solutions',
    items: ['AGMs', 'Client appreciation', 'Service awards', 'Festival celebrations'],
    description:
      'Tailored gifting programs for AGMs, client appreciation, service awards, and festival celebrations across India.',
    image: IMAGES.festiveEvent,
  },
] as const

export const CUSTOM_BRANDING = {
  title: 'Your Brand. Your Product. Your Identity.',
  intro:
    'Integrate your corporate identity across leather goods and gift packaging with professional branding methods suited to each material and product type.',
  methods: [
    {
      title: 'Blind Debossing',
      for: 'Genuine leather wallets, passport holders, bags',
      description: 'Subtle, sophisticated recessed logo finish.',
      image: IMAGES.leatherTexture,
    },
    {
      title: 'Metallic Foil Stamping',
      for: 'Gift boxes, diaries, card holders',
      description: 'Luxury gold or silver reflective finish.',
      image: IMAGES.foilStamping,
    },
    {
      title: 'Laser Engraving',
      for: 'Metal keychains, belt buckles, zippers',
      description: 'Sharp, precise and permanent detailing.',
      image: IMAGES.laserEngraving,
    },
    {
      title: 'Screen Printing',
      for: 'Nylon backpacks, fabric lining',
      description: 'Vibrant, color-matched corporate branding.',
      image: IMAGES.laptopBag,
    },
  ],
} as const

export const MATERIALS = [
  {
    title: 'Premium Genuine Leather',
    image: IMAGES.leatherTexture,
  },
  {
    title: 'Top-Grain Leather',
    image: IMAGES.leatherTexture,
  },
  {
    title: 'High-Durability Eco-Leatherette',
    image: IMAGES.leatherette,
  },
  {
    title: 'Water-Resistant Nylon',
    image: IMAGES.nylonBag,
  },
] as const

export const MANUFACTURING = {
  title: 'Scalable Manufacturing',
  stat: '50 to 50,000+ units',
  body: 'Dedicated production pipelines capable of handling bulk orders with disciplined quality checks, branding integration, and nationwide logistics support.',
} as const

export const WHY_CHOOSE_US = [
  {
    number: '01',
    title: 'Direct Factory Pricing',
    description:
      'Purchase directly from the manufacturer — transparent bulk pricing without unnecessary intermediaries.',
  },
  {
    number: '02',
    title: 'Dedicated Account Manager',
    description:
      'Single point of contact for design approvals, physical sample delivery, production updates, and logistics coordination.',
  },
  {
    number: '03',
    title: 'Multi-Stage Quality Assurance',
    description:
      'Inspection across seam strength, zip durability, logo alignment, and box packaging before dispatch.',
  },
  {
    number: '04',
    title: 'Pre-Production Physical Samples',
    description:
      'Physical samples prepared for corporate approval before full batch manufacturing begins.',
  },
] as const

export const BUYING_PROCESS = [
  { step: 1, title: 'Requirement', description: 'Share your brief, quantities, and event timeline.' },
  { step: 2, title: 'Design', description: 'Discuss product selection and customization options.' },
  { step: 3, title: 'Sample', description: 'Review physical samples for approval.' },
  { step: 4, title: 'Approval', description: 'Confirm branding, materials, and packaging.' },
  { step: 5, title: 'Production', description: 'Bulk manufacturing with quality checkpoints.' },
  { step: 6, title: 'Delivery', description: 'Nationwide dispatch of finished goods.' },
] as const

export const RFQ_PRODUCT_OPTIONS = [
  'Laptop Bags / Laptop Trolley Bags',
  'Gents Wallets & Card Holders',
  'Passport Holders & Sling Bags',
  'Nylon Backpacks',
  'Keychain & Belt Combo Sets',
  '3-in-1 Combo Sets (Wallet + Keychain + Belt)',
] as const
