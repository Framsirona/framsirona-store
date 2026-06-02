import { useState, FormEvent } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  CheckCircle, 
  Flame, 
  Layers, 
  Box, 
  Compass, 
  TrendingUp, 
  Send, 
  RefreshCw,
  Palette,
  Ticket,
  CreditCard,
  BookOpen,
  FileCode,
  Share2,
  Receipt
} from 'lucide-react';
import { Product, CategoryInfo } from '../types';
import { INITIAL_CATEGORIES, INITIAL_TESTIMONIALS } from '../lib/initialData';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  products: Product[];
  categories?: CategoryInfo[];
  onNavigate: (route: string, params?: any) => void;
}

export default function Home({ products, categories, onNavigate }: HomeProps) {
  // Grab top featured templates
  const featuredTemplates = products.slice(0, 3);
  
  // Grab latest templates
  const latestTemplates = products.slice().reverse().slice(0, 4);
  
  // Grab trending templates (slice items offset by 1 or fallback gracefully)
  const trendingTemplates = products.length > 4 ? products.slice(1, 5) : products.slice(0, 4);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'Poster templates': return <Palette className="w-5 h-5 text-blue-600" />;
      case 'Flyer templates': return <Ticket className="w-5 h-5 text-indigo-600" />;
      case 'Business card templates': return <CreditCard className="w-5 h-5 text-sky-600" />;
      case 'Canva templates': return <Layers className="w-5 h-5 text-blue-600" />;
      case 'Ebooks': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'PSD templates': return <FileCode className="w-5 h-5 text-sky-600" />;
      case 'Social media kits': return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'Invoice templates': return <Receipt className="w-5 h-5 text-blue-600" />;
      case 'Branding kits': return <Compass className="w-5 h-5 text-blue-500" />;
      default: return <Compass className="w-5 h-5 text-blue-600" />;
    }
  };

  const categoriesToRender = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;

  // Newsletter Lead-Capture States
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@') || newsletterEmail.length < 5) {
      setNewsletterError('Please input a valid publisher email address.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterError('');
    
    // Simulate API webhook registering subscription
    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }, 1250);
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-800">
      
      {/* 1. HERO SECTION WITH CREATIVE GLOW */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-200 bg-white" id="home-hero">
        {/* Soft background glow elements */}
        <div className="absolute top-1/4 left-1/3 -translate-y-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-xs text-blue-700 font-bold font-mono hover:border-blue-200 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>EXQUISITE ASSETS FOR CREATIVE AGENCIES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Ignite your designs with{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Framsirona Premium Templates
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Download instantly compatible, elite Canva layouts, layered PSD mockups, fully vectored poster designs, and business guides optimized for production scalability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-102 hover:contrast-110 transition-all duration-300 cursor-pointer"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-8 py-4 rounded-xl font-medium text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            >
              <span>Explore Categories</span>
            </button>
          </div>

          {/* Core USP Badges */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200 text-left">
            {[
              { title: 'Immediate Access', desc: 'Instant download delivery link' },
              { title: 'Highly Compatible', desc: 'PSD, Figma, Canva ready' },
              { title: 'Elite Typography', desc: 'Pre-linked gorgeous free fonts' },
              { title: 'Unlimited Utility', desc: 'Free lifetime revision updates' }
            ].map((usp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-800 text-sm font-sans">{usp.title}</span>
                </div>
                <p className="text-slate-500 text-xs ml-5">{usp.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC SLIDER / STATIC CATEGORIES LIST */}
      <section className="py-24 bg-slate-50" id="home-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">Curated Assortment</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                Specialized Resources
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('categories')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View details of all 9 categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesToRender.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => onNavigate('shop', { category: cat.id })}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden shadow-sm"
              >
                {/* 1. IMAGE CONTAINER WITH OVERLAYS */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600'}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating, glassmorphic icon badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-md border border-white/20 transition-transform duration-300 group-hover:scale-110">
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>

                {/* 2. SPECIFICATION TEXT CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 font-sans group-hover:text-blue-600 transition-colors text-base tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center text-xs text-slate-400 font-mono group-hover:text-blue-600 justify-between">
                    <span className="font-semibold tracking-wider uppercase text-[9px] text-slate-400 group-hover:text-blue-500 transition-colors">Explore templates</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 font-sans text-xs font-semibold opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">View Vault</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section className="py-24 bg-white border-t border-slate-200" id="home-featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-blue-600 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>CROWN SELECTIONS</span>
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Best Sellers
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Highly verified, premium digital kits chosen by master graphic planners. Built to immediate specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTemplates.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onNavigate={onNavigate} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3B. TRENDING PRODUCTS GRID */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200" id="home-trending">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full flex items-center w-max gap-1">
                <TrendingUp className="w-3 h-3 text-rose-500 animate-bounce" />
                <span>HOT TRENDING</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Trending Design Layouts
              </h2>
              <p className="text-slate-550 text-xs mt-1">
                The absolute highest demand publisher files and visual assets being downloaded right now.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="text-xs font-mono font-medium text-rose-600 hover:text-rose-800 flex items-center space-x-1 bg-rose-50/60 border border-rose-100 hover:bg-rose-100/60 px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              <span>Explore all trending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingTemplates.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute top-2.5 right-2.5 z-20 bg-rose-600 text-white font-mono text-[8.5px] font-bold uppercase px-2 py-0.5 rounded-md shadow-sm pointer-events-none">
                  Trending ★
                </div>
                <ProductCard 
                  product={product} 
                  onNavigate={onNavigate} 
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. LATEST PRODUCTS GRID */}
      <section className="py-24 bg-slate-50 border-t border-slate-200" id="home-latest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex items-end justify-between border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">NEW ENROLLMENTS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Latest Additions
              </h2>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="text-xs font-mono font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1 bg-blue-50 border border-blue-100 hover:bg-blue-100/60 px-3.5 py-1.5 rounded-lg shadow-sm"
            >
              <span>View core gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestTemplates.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onNavigate={onNavigate} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* 5. USER TESTIMONIALS */}
      <section className="py-24 bg-white border-t border-b border-slate-200" id="home-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">CREATOR ECOSYSTEM</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Loved by Top Producers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_TESTIMONIALS.map((test) => (
              <div 
                key={test.id}
                className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-6 shadow-sm"
              >
                {/* Visual stars rating */}
                <div className="flex space-x-1 text-blue-600">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                
                <p className="text-slate-600 text-sm italic leading-relaxed">
                  "{test.feedback}"
                </p>

                <div className="flex items-center space-x-3.5 pt-4 border-t border-slate-200">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{test.name}</h4>
                    <span className="block text-slate-400 text-[11px] font-mono">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5B. STATEFUL NEWSLETTER SUBSCRIPTION SECTION */}
      <section className="py-20 bg-slate-100 border-b border-slate-200 relative overflow-hidden" id="home-newsletter">
        {/* Abstract design elements to match Framsirona branding theme */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-100 space-y-8 text-center">
            
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto">
                <Send className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3.5xl font-extrabold text-slate-900 tracking-tight">
                Unlock 10% Off Your First Download
              </h2>
              <p className="text-slate-500 text-xs sm:text-xs font-sans max-w-md mx-auto leading-relaxed">
                Join 14,000+ top creative agencies, corporate publishers, and freelancers. Get immediate access to our weekly design releases, discount alerts, and Canva tutorial breakdowns.
              </p>
            </div>

            {newsletterSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl max-w-md mx-auto space-y-2 animate-fadeIn">
                <span className="text-2xl">🎉</span>
                <h4 className="font-bold text-emerald-800 text-sm">Welcome to Framsirona Inner Circle!</h4>
                <p className="text-slate-600 text-xs font-sans leading-relaxed">
                  We have dispatched your custom 10% coupon code and immediate Canva introductory templates checklist to your email folder.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        setNewsletterError('');
                      }}
                      placeholder="Enter your creator email..."
                      className="w-full bg-slate-50 border border-slate-250 py-3.5 pl-4 pr-4 rounded-xl text-xs font-sans outline-none focus:border-blue-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400 font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="bg-slate-900 text-white font-mono font-bold text-xs uppercase px-6 py-3.5 rounded-xl hover:bg-blue-600 active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5 transition-all whitespace-nowrap min-w-[130px]"
                  >
                    {newsletterLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
                
                {newsletterError && (
                  <p className="text-[11px] font-mono text-red-500 bg-red-50 border border-red-100 py-1.5 px-3 rounded-lg text-left inline-block">
                    ⚠️ {newsletterError}
                  </p>
                )}

                <p className="text-[10px] text-slate-400 font-mono">
                  Zero spam, unsubscribe in one-click. Protected by SSL encryption criteria.
                </p>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 6. IMMERSIVE OUTRO CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden text-center bg-white" id="home-cta">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stop starting your visual creation from scratch.
          </h2>
          <p className="text-slate-550 text-sm max-w-xl mx-auto leading-relaxed">
            Acquire immediate designer-tier canvas kits designed to elevate conversions, attract high-paying consulting inquiries, and streamline print outcomes beautifully.
          </p>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-103 transition-all cursor-pointer"
            >
              <span>Explore All Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
