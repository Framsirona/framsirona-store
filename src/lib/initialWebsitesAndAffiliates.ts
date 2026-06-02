import { WebsiteTemplate, AffiliateProduct } from '../types';

export const INITIAL_WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'wt_1',
    title: 'Nexus Enterprise Portal',
    description: 'A cutting-edge, ultra-high-performance business website landing page and corporate communication portal. Structured for maximum readability, fast load speed, and search engine optimization. Ideal for modern enterprises and software startups.',
    category: 'Business website',
    price: 49.00,
    previewImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/nexus',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/nexus-enterprise.zip',
    features: [
      'Fully responsive & cross-browser optimized layout',
      'Staging demo with dynamic contact form',
      'Extremely clean, modular code with React functional components',
      'Pre-configured SEO meta tags & robot schemas',
      '98+ Lighthouse Performance and SEO metric scores'
    ],
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'wt_2',
    title: 'Apex Global Logistics Dashboard & Site',
    description: 'A robust corporate portal designed specifically for modern shipping, freight, logistics, and warehousing operations. Comes loaded with interactive booking calculators, visual cargo trackers, and pristine layout schemes representing logistics prowess.',
    category: 'Logistics company website',
    price: 59.00,
    previewImages: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549194388-f61be84a6e9e?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/apex-logistics',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/apex-logistics.zip',
    features: [
      'Interactive cargo pricing & distance estimator framework',
      'Preregistered booking intake form module',
      'Fully styled interactive shipment tracking interface map panel',
      'High contrast color accents guaranteeing professional presence',
      '100% editable and layered web components'
    ],
    createdAt: '2026-05-12T11:00:00Z'
  },
  {
    id: 'wt_3',
    title: 'Grace Fellowship Community Portal',
    description: 'A warm, welcoming, and elegant church website template structured around streaming sermon video galleries, active local community program lists, direct donor options, and responsive prayer petition logs.',
    category: 'Church website',
    price: 39.00,
    previewImages: [
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/grace-fellowship',
    techStack: ['React', 'Tailwind CSS', 'HTML5 Video', 'Lucide Icons'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/grace-fellowship.zip',
    features: [
      'Curated clean layout designed for serene local integration',
      'Integrated prayer/message request and newsletter signup',
      'Event schedules framework with maps coordinates integration',
      'Optimized digital giving & donor checkout dialog structure',
      'Elegant, eye-safe typography combinations'
    ],
    createdAt: '2026-05-14T09:30:00Z'
  },
  {
    id: 'wt_4',
    title: 'Elysian Architect Portfolio Canvas',
    description: 'A luxury, minimalist portfolio showcase website designed for master visual designers, high-end photographers, and studio directors. Built with high-contrast structural cells, micro-transitions, and elegant negative space framework.',
    category: 'Portfolio website',
    price: 35.00,
    previewImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/elysian',
    techStack: ['Vite', 'React', 'Tailwind CSS', 'Framer Motion'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/elysian-portfolio.zip',
    features: [
      'Bespoke visual showcase galleries with fluid image lazy-loaded sliders',
      'Custom modern cursor micro-interaction details',
      'Contact forms & biography modular layouts',
      'Swiss brutalist typographic alignment details',
      'Included dark and light mode variable foundations'
    ],
    createdAt: '2026-05-15T15:00:00Z'
  },
  {
    id: 'wt_5',
    title: 'Veloce Digital Commerce Engine',
    description: 'A blazing-fast, high-converting digital product store layout tailored for direct e-commerce applications. Features client-side cart management, beautiful item details drawer modules, and seamless validation structures.',
    category: 'Ecommerce website',
    price: 65.00,
    previewImages: [
      'https://images.unsplash.com/photo-1472851294608-062f824d296e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/veloce',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Zustand State'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/veloce-commerce.zip',
    features: [
      'Fully complete client-side cart drawer state architecture',
      'Smooth checkout wizard forms validation mechanisms',
      'Modular product listing nodes with instant filters',
      'Highly polished product reviews panel card elements',
      'Optimized for rapid mobile conversions and swipe actions'
    ],
    createdAt: '2026-05-16T10:00:00Z'
  },
  {
    id: 'wt_6',
    title: 'Prestige Estate Showcase Framework',
    description: 'An elegant theme structured to advertise high-end real estate, luxury apartments, and corporate property lists. Features search metric parameters, dynamic building overview cards, and scheduler forms.',
    category: 'Real estate website',
    price: 55.00,
    previewImages: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/prestige-estate',
    techStack: ['React', 'TSX', 'Tailwind CSS', 'Framer Motion'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/prestige-estate.zip',
    features: [
      'Search filters by geolocation, price boundaries, and unit specifications',
      'Property details showcase map overlay mockup',
      'Lead collection modal with direct calendar hooks mockups',
      'High fidelity SVG layout schemes for floor plan displays',
      'Optimized media galleries for crisp video showcases'
    ],
    createdAt: '2026-05-18T16:00:00Z'
  },
  {
    id: 'wt_7',
    title: 'Echelon Wealth & Advisory Portal',
    description: 'A secure, highly professional corporate homepage framework for accounting firms, wealth advisors, and modern cryptocurrency entities. Features visual graphs, dynamic calculators, and timeline summaries.',
    category: 'Accounting firm website',
    price: 59.00,
    previewImages: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/echelon',
    techStack: ['React', 'Tailwind CSS', 'Recharts', 'TypeScript'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/echelon-finance.zip',
    features: [
      'Calculators for simple wealth compound and retirement estimates',
      'Dynamic charts mockups showing fiscal growth indexes',
      'Comprehensive security protocols statement layouts',
      'Team members biography slots & quote cards',
      'Meets direct Accessibility AAA contrast compliance principles'
    ],
    createdAt: '2026-05-19T14:00:00Z'
  },
  {
    id: 'wt_8',
    title: 'Aura Interactive Digital Agency Hub',
    description: 'A vibrant, bold showcase designed for modern design studios, branding collectives, and digital performance teams. Utilizing modern interactive sections and robust layout architectures.',
    category: 'Creative agency website',
    price: 45.00,
    previewImages: [
      'https://images.unsplash.com/photo-1542744173-8e08562744ad?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/aura-agency',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/aura-agency.zip',
    features: [
      'Bold color blocking design framework built to stun and convert clients',
      'Case study highlight sections with interactive data callouts',
      'Service catalog interactive accordion components',
      'Newsletter signups & dynamic FAQ blocks',
      'Pre-prepared copy writing drafts for direct implementation'
    ],
    createdAt: '2026-05-20T17:30:00Z'
  },
  {
    id: 'wt_9',
    title: 'DirectTalent Job Board Platform',
    description: 'A modern, high-conversion recruitment marketplace template. Designed with structured job cards, an interactive sidebar for role filters, clean salaries widgets, and user submission workflows.',
    category: 'Job board website',
    price: 49.00,
    previewImages: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/direct-talent',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/direct-talent.zip',
    features: [
      'Smooth responsive listing canvas with flexible filter sidebars',
      'State-persisted search bar indexing roles, cities, and stack terms',
      'Interactive resume upload module mockup styled in pure CSS',
      'Modern card designs highlighting salary bands, remote criteria, and company tags'
    ],
    createdAt: '2026-05-21T09:00:00Z'
  },
  {
    id: 'wt_10',
    title: 'The Maverick Barbers & Co. Site',
    description: 'An immersive, luxury grooming lifestyle showcase website. Highlights premium service rate menus, high-contrast stylist profile cards, automated reservation booking calendar mockups, and client reviews.',
    category: 'Barber shop website',
    price: 39.00,
    previewImages: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/maverick-barbers',
    techStack: ['React', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/maverick-barbers.zip',
    features: [
      'Immersive warm/dark styling focusing on tactile, high-contrast imagery',
      'Interactive treatment menu drawer showcasing services breakdown',
      'Mock appointment booking system with direct calendar dates layout',
      'Social integrations module and location business hours display'
    ],
    createdAt: '2026-05-22T08:00:00Z'
  },
  {
    id: 'wt_11',
    title: 'Trattoria Bella Gourmet Showcase',
    description: 'A gorgeous, gourmet culinary showcase template for modern dining rooms. Designed with tabbed menu browsers, active reservation modules, ingredient detail modals, and elegant serif typography.',
    category: 'Restaurant website',
    price: 45.00,
    previewImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://ais-pre-swhpewuag5dodkx6f3jsa6-818300543537.europe-west2.run.app/demo/trattoria-bella',
    techStack: ['Vite', 'React', 'Tailwind CSS', 'Lucide Icons'],
    downloadFile: 'https://framsirona.s3.amazonaws.com/templates/trattoria-bella.zip',
    features: [
      'Tabbed interactive menu displaying food items, descriptions, and dietary badges',
      'Interactive direct-table mock reservation booking form module',
      'Full-screen high-resolution imagery showcasing visual culinary assets',
      'Highly responsive mobile view architecture with floating reservation buttons'
    ],
    createdAt: '2026-05-22T09:12:00Z'
  }
];

export const INITIAL_AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  // Creator Essentials Section
  {
    id: 'ap_1',
    title: 'Focusrite Scarlett 2i2 USB Audio Interface',
    description: 'The golden standard interface for creators, remote podcasters, and digital planners. Delivers crystal clear vocals, low acoustic latency, and studio-grade guitar input capture directly into your workstation.',
    category: 'Creator Essentials',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B0C3DVE2Z7?tag=framsirona20-20',
    createdAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'ap_2',
    title: 'Logitech MX Master 3S Wireless Mouse',
    description: 'An ergonomic masterpiece designed to supercharge design and developer productivity. Features hyper-fast electromagnetic scrolling, high-precision tracking, and key reassignment layers.',
    category: 'Creator Essentials',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B0B2G6416T?tag=framsirona20-20',
    createdAt: '2026-05-11T12:00:00Z'
  },
  {
    id: 'ap_3',
    title: 'Elgato Stream Deck MK.2',
    description: 'With 15 customizable macro LCD buttons, instigate immediate workflow automation in Photoshop, Figma, VS Code, and stream applications. An absolute necessity for speed-focused visual professionals.',
    category: 'Creator Essentials',
    image: 'https://images.unsplash.com/photo-1585860341757-ad2d4c09d571?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B09738CV2G?tag=framsirona20-20',
    createdAt: '2026-05-12T12:00:00Z'
  },

  // Recommended Tools Page
  {
    id: 'ap_4',
    title: 'Caldigit TS4 Thunderbolt 4 Docking Station',
    description: 'A powerhouse workstation hub providing 18 ports of connectivity including dual monitor support, 98W laptop power charging, and high-speed data transfer rails. Perfect for single-cable office integration.',
    category: 'Recommended Tools',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B09GK6SFCK?tag=framsirona20-20',
    createdAt: '2026-05-13T12:00:00Z'
  },
  {
    id: 'ap_5',
    title: 'Keychron Q1 Pro QMK Custom Keyboard',
    description: 'An executive mechanical keyboard featuring an exquisite full aluminum body, hot-swappable tactile key switches, and gorgeous sound profiles. Elevate typing into a majestic high-productivity feedback loop.',
    category: 'Recommended Tools',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B0BYR4XG21?tag=framsirona20-20',
    createdAt: '2026-05-14T12:00:00Z'
  },

  // Office & Business Tools
  {
    id: 'ap_6',
    title: 'BenQ ScreenBar Halo Monitor Light Bar',
    description: 'An asynchronous eye-care desktop illumination system that prevents glare on office monitors while delivering adjustable warmth lighting to your creative desk environment.',
    category: 'Office & Business Tools',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B08C782YLL?tag=framsirona20-20',
    createdAt: '2026-05-15T12:00:00Z'
  },
  {
    id: 'ap_7',
    title: 'Olapix Premium Wooden Cable Management Board',
    description: 'An elegant solid walnut desk organizer with clean custom magnetic brackets to tuck away stray charging cords and retain a clean, minimal workspace profile.',
    category: 'Office & Business Tools',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    amazonLink: 'https://www.amazon.com/dp/B099KFR716?tag=framsirona20-20',
    createdAt: '2026-05-16T12:00:00Z'
  }
];
