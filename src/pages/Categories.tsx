import { Compass, BookOpen, Layers, CreditCard, Sparkles, FileCode, Palette, Ticket, Receipt } from 'lucide-react';
import { Product, CategoryInfo } from '../types';
import { INITIAL_CATEGORIES } from '../lib/initialData';

interface CategoriesProps {
  products: Product[];
  categories?: CategoryInfo[];
  onNavigate: (route: string, params?: any) => void;
}

export default function Categories({ products, categories, onNavigate }: CategoriesProps) {
  
  // Dynamic Map of icons corresponding to string IDs
  const getIcon = (id: string) => {
    switch (id) {
      case 'Poster templates': return <Palette className="w-8 h-8 text-blue-600" />;
      case 'Flyer templates': return <Ticket className="w-8 h-8 text-indigo-600" />;
      case 'Business card templates': return <CreditCard className="w-8 h-8 text-sky-600" />;
      case 'Canva templates': return <Layers className="w-8 h-8 text-blue-600" />;
      case 'Ebooks': return <BookOpen className="w-8 h-8 text-indigo-500" />;
      case 'PSD templates': return <FileCode className="w-8 h-8 text-sky-600" />;
      case 'Social media kits': return <Sparkles className="w-8 h-8 text-indigo-600" />;
      case 'Invoice templates': return <Receipt className="w-8 h-8 text-blue-600" />;
      case 'Branding kits': return <Compass className="w-8 h-8 text-blue-500" />;
      default: return <Compass className="w-8 h-8 text-blue-600" />;
    }
  };

  const categoriesToRender = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Headings */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-blue-600 font-mono text-xs uppercase tracking-widest block font-bold">Specialized Marketplace</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Curated Categories
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            We divide our template vault into specialized domains to save you searching time. Each product is crafted explicitly to meet standard professional requirements.
          </p>
        </div>

        {/* Categories Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesToRender.map((cat) => {
            const listForCat = products.filter((p) => p.category === cat.id);
            const count = listForCat.length;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('shop', { category: cat.id })}
                className="group bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 rounded-2xl cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm"
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
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-md border border-white/20 transition-transform duration-300 group-hover:scale-110">
                    {getIcon(cat.id)}
                  </div>
                </div>

                {/* 2. SPECIFICATION TEXT CONTENT */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-slate-900 font-sans group-hover:text-blue-600 transition-colors text-lg tracking-tight animate-fade-in">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  {/* Tracking metadata statistics */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="text-slate-400 uppercase tracking-widest text-[9px] font-semibold">Vault Contents</span>
                    <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {count} {count === 1 ? 'Template' : 'Templates'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
