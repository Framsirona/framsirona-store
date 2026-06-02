import { useState, useEffect } from 'react';
import { 
  ShoppingBag, ExternalLink, Sparkles, Monitor, AppWindow, Cpu, Lightbulb, 
  Wrench, CheckCircle, Flame, Layers2
} from 'lucide-react';
import { AffiliateProduct } from '../types';
import { fetchAffiliateProductsFromDB } from '../lib/firebase';

interface AffiliatesProps {
  onNavigate: (route: string) => void;
  initialCategory?: 'Recommended Tools' | 'Creator Essentials' | 'Office & Business Tools' | null;
}

export default function Affiliates({ onNavigate, initialCategory }: AffiliatesProps) {
  const [affiliates, setAffiliates] = useState<AffiliateProduct[]>([]);
  const [activeTab, setActiveTab] = useState<'Recommended Tools' | 'Creator Essentials' | 'Office & Business Tools'>(
    initialCategory || 'Creator Essentials'
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAffiliatesData();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setActiveTab(initialCategory);
    }
  }, [initialCategory]);

  const loadAffiliatesData = async () => {
    setLoading(true);
    try {
      const data = await fetchAffiliateProductsFromDB();
      setAffiliates(data);
    } catch (err) {
      console.error("Failed to fetch affiliate products", err);
    }
    setLoading(false);
  };

  // SEO optimization
  useEffect(() => {
    document.title = `${activeTab} - Curated Creator & Business Gear List | Framsirona`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content', 
        `Browse our meticulously selected ${activeTab}. High-performance products, gadgets, and assets built to enhance office productivity and creative output.`
      );
    }
  }, [activeTab]);

  const filteredAffiliates = affiliates.filter(item => item.category === activeTab);

  // Tab banners styling definitions
  const bannerSettings = {
    'Creator Essentials': {
      title: 'Creator Essentials Desk Gear',
      detail: 'Meticulously engineered gear designed for designers, videographers, podcasters, and developers who seek top-tier acoustic fidelity and tactile hardware precision.',
      badgeClr: 'bg-teal-50 text-teal-700 border-teal-100',
      icon: <Flame className="w-5 h-5 text-teal-600 animate-pulse" />
    },
    'Recommended Tools': {
      title: 'High-Performance Workstation Tools',
      detail: 'Core professional accessories, multi-port docking stations, and custom mechanical layouts ensuring single-cable desk automation and pristine layouts.',
      badgeClr: 'bg-amber-50 text-amber-700 border-amber-100',
      icon: <Wrench className="w-5 h-5 text-amber-600" />
    },
    'Office & Business Tools': {
      title: 'Office & Business Productivity Tools',
      detail: 'Ambient asynchronous eye-care screenbars, cable organizers, and clean workspace mounts curated to reduce visual fatigue and maintain aesthetic minimalism.',
      badgeClr: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      icon: <Monitor className="w-5 h-5 text-indigo-600" />
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans" id="affiliates-section">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Visually Separated Intro Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/20 uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>METICULOUS HARDWARE BLUEPRINTS</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
            Recommended{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Office Gear & Tools
            </span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            We review and curate the highest quality hardware peripherals on the market. Purchase via our manual partner affiliate blocks to support ongoing workspace development and software releases.
          </p>
        </div>

        {/* 3 designated pages/tabs toggle deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto border border-slate-800 p-2.5 rounded-2xl bg-slate-950/60 shadow-inner">
          {(['Creator Essentials', 'Recommended Tools', 'Office & Business Tools'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer duration-200 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/15 scale-[1.01]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Active Tab Informational Panel Banner */}
        <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-3xl shadow-md max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 blur-3xl rounded-full"></div>
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              {bannerSettings[activeTab].icon}
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {bannerSettings[activeTab].title}
              </h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {bannerSettings[activeTab].detail}
            </p>
          </div>
          <div className="flex-shrink-0 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-2 flex-grow-0">
            <span className="block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider">SECURE AMAZON GATEWAYS ACTIVE</span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 min-h-[300px]">
            <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-emerald-400 animate-spin"></div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">Consulting partner catalog...</p>
          </div>
        ) : (
          <>
            {/* Products grid display */}
            {filteredAffiliates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" id="affiliates-grid">
                {filteredAffiliates.map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    
                    {/* Visual product photo */}
                    <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative border-b border-slate-800">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1542754173-8e08562744ad?w=800'} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[9px] font-mono tracking-wider font-extrabold border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Metadata contents */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* View Button Row */}
                      <div className="pt-4 border-t border-slate-800 mt-4">
                        <a
                          href={item.amazonLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 text-white font-bold py-3 px-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all text-xs uppercase tracking-wider"
                        >
                          <ShoppingBag className="w-4 h-4 text-emerald-400" />
                          <span>View on Amazon</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </a>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* Empty state display */
              <div className="text-center py-20 bg-slate-950 border border-dashed border-slate-850 rounded-3xl max-w-3xl mx-auto space-y-4 shadow-inner">
                <span className="block text-4xl">📦</span>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">Affiliate section empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                  No partners items currently deployed in "{activeTab}". Please configure materials inside the admin dashboard catalog tracker.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
