import { Product, CategoryInfo } from '../types';
import { SNIPPE_PAYMENT_LINKS } from './paymentConfig';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Poster templates',
    name: 'Poster templates',
    description: 'High-resolution, print-ready minimalist and abstract poster layouts.',
    icon: 'Palette',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Flyer templates',
    name: 'Flyer templates',
    description: 'Professional promotional and event flyers to boost your local marketing.',
    icon: 'Ticket',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Business card templates',
    name: 'Business card templates',
    description: 'Sleek, eye-catching corporate and freelance contact cards.',
    icon: 'CreditCard',
    imageUrl: 'https://images.unsplash.com/photo-1616628188506-4bd8d62c908d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Canva templates',
    name: 'Canva templates',
    description: 'Easily customizable browser-based designs for instant editing.',
    icon: 'Layers',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Ebooks',
    name: 'Ebooks',
    description: 'In-depth digital growth blueprints, design strategies, and coding manuals.',
    icon: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'PSD templates',
    name: 'PSD templates',
    description: 'Layered Photoshop source files with editable smart objects.',
    icon: 'FileCode',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Social media kits',
    name: 'Social media kits',
    description: 'Cohesive Instagram grids, stories, and Pinterest pin layouts.',
    icon: 'Share2',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Invoice templates',
    name: 'Invoice templates',
    description: 'Clean, client-friendly payment requests and freelance receipts.',
    icon: 'Receipt',
    imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'Branding kits',
    name: 'Branding kits',
    description: 'All-in-one corporate identity packs covering logos, colors, and typography.',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80'
  }
];

const RAW_INITIAL_PRODUCTS = [
  {
    id: 'p1',
    title: 'Minimalist Abstract Poster Pack',
    description: 'A collection of 3 beautiful Swiss-design inspired interior art posters. High-resolution vector files compatible with standard frame sizes. Fully layered and editable for custom color schemes.',
    category: 'Poster templates',
    price: 19.00,
    previewImages: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
    createdAt: '2026-05-10T12:00:00Z',
    fileSize: '142 MB',
    fileFormat: 'Adobe Illustrator (AI)',
    features: [
      '3 Distinct Swiss-Style Artworks',
      'Ultra High Resolution (300 DPI)',
      'Vector Format - Scales infinitely without quality loss',
      'CMYK Print-Ready color mode',
      'Free commercial-use fonts included'
    ]
  },
  {
    id: 'p2',
    title: 'Modern Architecture Exhibition Poster',
    description: 'An elegant editorial exhibition poster template featuring a bold typography layout and modular minimalist framing. Perfect for showcases, galleries, or home office decorations.',
    category: 'Poster templates',
    price: 12.00,
    previewImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    createdAt: '2026-05-18T14:30:00Z',
    fileSize: '45 MB',
    fileFormat: 'Photoshop PSD',
    features: [
      'Layered custom smart objects',
      'A1 Poster dimensions (594 x 841 mm)',
      'Organized layout hierarchy',
      'Easily swap out background headers',
      'Custom grid guidelines pre-mapped'
    ]
  },
  {
    id: 'p3',
    title: 'Futuristic Electro Beats Music Flyer',
    description: 'A neon-infused club concert and festival flyer template designed to promote electronic, techno, or cyberpunk music nights. Features custom 3D abstract textures.',
    category: 'Flyer templates',
    price: 15.00,
    previewImages: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    createdAt: '2026-05-12T09:15:00Z',
    fileSize: '89 MB',
    fileFormat: 'Photoshop PSD',
    features: [
      'Fully editable neon glow styles',
      '4x6 inches with 0.25" bleed limits',
      'High contrast design optimized for social sharing',
      'Editable 3D neon wireframe component',
      '100% free typography fonts link'
    ]
  },
  {
    id: 'p4',
    title: 'Creative Agency Corporate Flyer',
    description: 'A professional business flyer for creative studios, tech consultancy startups, and agencies. Ideal for presenting key corporate services, timelines, and expert biographies.',
    category: 'Flyer templates',
    price: 14.00,
    previewImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    createdAt: '2026-05-15T10:00:00Z',
    fileSize: '18 MB',
    fileFormat: 'Adobe InDesign (INDD)',
    features: [
      'Standard Letter size (8.5" x 11")',
      'Clean professional structural spacing',
      'Includes custom business graphs graphics',
      'Automatic page numbering / styles',
      'Rich paragraph styles for fast copying'
    ]
  },
  {
    id: 'p5',
    title: 'Minimalist Premium Business Cards',
    description: 'A double-sided minimal business card design tailored for photographers, architects, designers, and high-end freelancers. Exudes luxury and clean sophistication.',
    category: 'Business card templates',
    price: 9.00,
    previewImages: [
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800',
    createdAt: '2026-05-16T15:20:00Z',
    fileSize: '12 MB',
    fileFormat: 'Figma Component (.fig)',
    features: [
      'Double-sided typography design',
      'Standard 3.5” x 2” layout dimensions',
      'Fully customizable layers with auto-layout in Figma',
      'Includes premium minimal vector logos',
      'Pre-prepared print cutting bounds'
    ]
  },
  {
    id: 'p6',
    title: 'Ultra-Black Dark Business Cards',
    description: 'An commanding, tactile dark-theme business card design using deep black tones, copper texturing effects, and striking modern typography. Made for executive presence.',
    category: 'Business card templates',
    price: 11.00,
    previewImages: [
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800',
    createdAt: '2026-05-14T11:45:00Z',
    fileSize: '28 MB',
    fileFormat: 'Photoshop PSD',
    features: [
      'High-contrast copper hot-foil simulator',
      'Standard 90x55mm specs',
      'Layered smart object logo placement',
      'Deep charcoal textures included',
      '300 DPI CMYK ready for press'
    ]
  },
  {
    id: 'p7',
    title: 'Instagram Aesthetic Post Templates',
    description: '30 stunning Pinterest and Instagram square templates to revamp your aesthetic. Perfect for bloggers, coaches, fashion houses, and design influencers.',
    category: 'Canva templates',
    price: 24.00,
    previewImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611162616305-c49b3efa7c14?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://canva.com/design/play-template-mock-link',
    createdAt: '2026-05-19T08:00:00Z',
    fileSize: 'Canva Link',
    fileFormat: 'Canva Template Link',
    features: [
      '30 Curated cohesive Instagram templates',
      'Works in free and pro Canva accounts',
      'Easily drag-and-drop photos directly',
      'Editable headline elements & custom colors',
      'Clean modern layout architecture'
    ]
  },
  {
    id: 'p8',
    title: 'Ultimate Creator Ebook PDF Guide',
    description: 'A 140-page blueprint detailing marketing strategies, graphic principles, and passive income generation models for professional creators. Learn to self-publish visual assets successfully.',
    category: 'Ebooks',
    price: 29.00,
    previewImages: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    createdAt: '2026-05-11T13:00:00Z',
    fileSize: '34 MB',
    fileFormat: 'PDF Ebook',
    features: [
      'Comprehensive 140-page interactive guide',
      'Topics: Launch Strategy, Pricing Models, Asset Creation',
      'Includes practical checklists and timeline sheets',
      'Includes editable excel financial simulator link',
      'Universal screen-optimized format'
    ]
  },
  {
    id: 'p9',
    title: 'MacBook & iPhone Device Mockup Kit',
    description: 'An incredible set of hyper-realistic digital mockups in customizable environments. Instantly demonstrate your web apps, client branding, or graphic portfolio in real life.',
    category: 'PSD templates',
    price: 18.00,
    previewImages: [
      'https://images.unsplash.com/photo-1496181130204-755241524eab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1496181130204-755241524eab?w=800',
    createdAt: '2026-05-17T17:10:00Z',
    fileSize: '210 MB',
    fileFormat: 'Photoshop PSD',
    features: [
      '5 High-resolution perspective scenes',
      'Smart Object insertion (double click to paste design)',
      'Adjustable dynamic lighting & shadow sliders',
      'Interchangeable concrete/wooden backgrounds included',
      'Includes realistic screen glare simulator'
    ]
  },
  {
    id: 'p10',
    title: 'Sleek Corporate Invoice Template',
    description: 'A clean, well-spaced modern invoice template. Establishes a highly professional transaction feeling between a design business and its premium corporate clients.',
    category: 'Invoice templates',
    price: 8.00,
    previewImages: [
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800',
    createdAt: '2026-05-13T10:15:00Z',
    fileSize: '4 MB',
    fileFormat: 'MS Word & PDF Pack',
    features: [
      'Clean structural alignment for rapid checks',
      'Automatic calculation tables for formulas',
      'Includes bank wire receipt info column',
      'Easily insert custom studio logos',
      'A4 & US Letter format files included'
    ]
  },
  {
    id: 'p11',
    title: 'Unified Corporate Identity Branding Kit',
    description: 'A massive comprehensive branding kit package for startup companies. Houses fully crafted modern logos, standard color style schemes, typography scales, business letterheads, and brand guidelines.',
    category: 'Branding kits',
    price: 49.00,
    previewImages: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&auto=format&fit=crop&q=80'
    ],
    downloadFile: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    createdAt: '2026-05-20T16:00:00Z',
    fileSize: '320 MB',
    fileFormat: 'Vectored Illustrator & INDD',
    features: [
      '3 Completes alternative minimal logos',
      '30-Page Brand Guidelines presentation',
      'Fully matched typography hierarchy specifications',
      'Includes vector stamp and signature icons',
      'Custom patterns for packaging wrapping paper'
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = RAW_INITIAL_PRODUCTS.map(p => ({
  ...p,
  checkoutUrl: SNIPPE_PAYMENT_LINKS[p.id] || (p as any).paymentLink || 'https://snippe.me/pay/framsirona-store'
}));

export const INITIAL_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Eleanor Vance',
    role: 'Creative Director at Studio 9',
    feedback: 'The templates from Framsirona Store changed how we structure client presentations. The layered PSD mockups are exceptionally clean and easy to customize within minutes.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 't2',
    name: 'Marcus Brody',
    role: 'Freelance UI/UX Specialist',
    feedback: 'I bought the MBP mockups and minimal poster pack. I save hours on presentations, and the layout quality is far better than generic mockups elsewhere. 10/10 recommendation!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 't3',
    name: 'Sienna Ross',
    role: 'Co-Director, Aura Branding Agency',
    feedback: 'The corporate identity branding kit saved us literally weeks of work mapping out presentation books for a startup client. It represents absolute top-tier design craft.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
];
