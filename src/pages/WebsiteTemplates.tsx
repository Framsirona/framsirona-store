import React, { useState, useEffect } from 'react';
import { 
  Globe, ExternalLink, Cpu, ChevronLeft, Check, Download, ShoppingBag, 
  CreditCard, ShieldCheck, Mail, Sparkles, Layers, Layers2, Terminal
} from 'lucide-react';
import { WebsiteTemplate } from '../types';
import { fetchWebsiteTemplates } from '../lib/firebase';
import { redirectToHostedCheckout } from '../lib/paymentConfig';

interface WebsiteTemplatesProps {
  onNavigate: (route: string, params?: any) => void;
  onAddToCart?: () => void;
}

export default function WebsiteTemplates({ onNavigate, onAddToCart }: WebsiteTemplatesProps) {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Buy checkout state
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [purchaseComplete, setPurchaseComplete] = useState<boolean>(false);

  // Detail preview slider image state
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  const categories = [
    'All',
    'Logistics company website',
    'Accounting firm website',
    'Job board website',
    'Church website',
    'Real estate website',
    'Creative agency website',
    'Portfolio website',
    'Barber shop website',
    'Restaurant website',
    'Business website',
    'Ecommerce website'
  ];

  useEffect(() => {
    loadTemplatesData();
  }, []);

  const loadTemplatesData = async () => {
    setLoading(true);
    try {
      const data = await fetchWebsiteTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to load website templates", err);
    }
    setLoading(false);
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  // SEO dynamic indexing
  useEffect(() => {
    if (selectedTemplate) {
      document.title = `${selectedTemplate.title} - Pre-built Responsive Website Template | Framsirona`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', `Download the ${selectedTemplate.title} coded website template. Structured with ${selectedTemplate.techStack.join(', ')} tech stack. Preview live demo instantly.`);
      }
    } else {
      document.title = `Premium Website Templates Marketplace | Framsirona`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', `Deploy responsive webs with professional, pre-built high-converting website templates. Codebases designed for startup businesses, portfolios, agencies, and e-commerce.`);
      }
    }
  }, [selectedTemplate]);

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPurchaseComplete(true);
      if (onAddToCart) onAddToCart();
    }, 1500);
  };

  const filteredTemplates = categoryFilter === 'All' 
    ? templates
    : templates.filter(t => t.category === categoryFilter);

  // Return Detail view screen
  if (selectedTemplate) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans" id="template-detail-view">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Breadcrumb row & Back */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setSelectedTemplateId(null);
                setActiveImageIdx(0);
                setPurchaseComplete(false);
                setShowCheckout(false);
                setEmailInput('');
              }}
              className="group flex items-center space-x-2 text-xs font-mono font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>RETURN TO WEBSITE TEMPLATES</span>
            </button>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
              <span>WEBSITES</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-600 font-bold uppercase">{selectedTemplate.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: VISUAL GALLERIES & HIGH QUALITY DETAILS */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-8">
              
              {/* Image Carousel Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-4">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl relative bg-slate-100 border border-slate-100">
                  <img 
                    src={selectedTemplate.previewImages[activeImageIdx] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'} 
                    alt={selectedTemplate.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/10 tracking-wider">
                    VIEWING PREVIEW {activeImageIdx + 1} OF {selectedTemplate.previewImages.length}
                  </span>
                </div>

                {/* Thumbnail list selector */}
                {selectedTemplate.previewImages.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto pb-1">
                    {selectedTemplate.previewImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-28 aspect-[16/10] rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImageIdx === idx 
                            ? 'border-blue-600 scale-[1.02] shadow-sm' 
                            : 'border-transparent opacity-65 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        <img src={img} alt="preview thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specification layout description detailed metrics */}
              <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-snug">Product Context & Architecture</h3>
                  <div className="h-0.5 w-12 bg-blue-600 mt-2 rounded"></div>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                  {selectedTemplate.description}
                </p>

                {/* Dynamic Features Specs checklists */}
                <div className="pt-4 border-t border-slate-100 space-y-3.5">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">Key Specifications & Features Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedTemplate.features.map((feat, index) => (
                      <div key={index} className="flex items-start space-x-2.5 text-xs text-slate-600">
                        <div className="p-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mt-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ACTION AND TRANSACTION FLOWS */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-6">
              
              {/* Product Pricing Card Box */}
              <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-600 font-bold tracking-widest uppercase bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 inline-block">
                    {selectedTemplate.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
                    {selectedTemplate.title}
                  </h1>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">SPECIFIED VALUE</span>
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    ${selectedTemplate.price ? selectedTemplate.price.toFixed(2) : '39.00'}
                  </span>
                </div>

                {/* Tech Stack blueprint listing */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4 text-blue-500" />
                    <span>Technology Stack Blueprint</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary layout actions buttons */}
                {!purchaseComplete ? (
                  <div className="pt-4 space-y-3">
                    
                    {/* Live Demo Trigger */}
                    <a
                      href={selectedTemplate.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3.5 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider text-center"
                    >
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>Live Preview Template</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    {/* Buy template trigger */}
                    <button
                      onClick={() => {
                        // Redirect straight to the configurable Snippe hosted checkout page (using window.location.href)
                        // To restore future API session-based integration, revert this to use onNavigate('checkout-sandbox', ...)
                        redirectToHostedCheckout(selectedTemplate.paymentLink || '');
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:shadow-lg hover:shadow-blue-500/15 text-white font-bold py-4 rounded-xl cursor-pointer hover:scale-[1.01] transition-all text-xs uppercase tracking-wider animate-pulse hover:animate-none"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy Now — ${selectedTemplate.price.toFixed(2)}</span>
                    </button>

                  </div>
                ) : (
                  /* Download component ready panel */
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 mx-auto rounded-full border border-emerald-100 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-sm">Purchase Accomplished!</h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Your secure ZIP bundle has been cooked. Direct download link valid for next 24 hours.
                      </p>
                    </div>
                    <a
                      href={selectedTemplate.downloadFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Template ZIP</span>
                    </a>
                  </div>
                )}

              </div>

              {/* Checkout simulation overlay modal */}
              {showCheckout && !purchaseComplete && (
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-md space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono text-xs font-bold text-slate-500 inline-block uppercase tracking-wider">SECURE DIGI-PORT TRANSACTION</span>
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">INBOUND BUYER EMAIL ADDRESS</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. frank@example.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-slate-800 transition-colors"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block pt-1">Backup links will instantly route to this address.</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-150">
                      <div className="flex justify-between text-xs font-mono text-slate-500">
                        <span>Cart Total:</span>
                        <span>${selectedTemplate.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono text-slate-500">
                        <span>Platform fee:</span>
                        <span className="text-emerald-600 font-bold uppercase text-[9px]">Waived</span>
                      </div>
                      <div className="border-t border-slate-200 my-1 pt-1 flex justify-between text-xs font-mono font-bold text-slate-800">
                        <span>Due Amount:</span>
                        <span>${selectedTemplate.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPaying}
                      className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl cursor-pointer hover:bg-black transition-colors text-xs uppercase tracking-wider"
                    >
                      {isPaying ? (
                        <span className="block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Simulate Secure Payment</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Trust statement metrics */}
              <div className="bg-white border border-slate-205 p-6 rounded-3xl space-y-4 text-xs text-slate-500">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-[11px] leading-tight">Instant Deployment Guarantee</h4>
                    <span className="block text-[10px] text-slate-400 font-mono">100% verified, clean source files</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // PRIMARY WEBSITE LIST GRID VIEW
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans" id="websites-section">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Introduction Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-blue-600 font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            <span>EXCLUSIVE SITE BUNDLES</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-905 tracking-tight leading-none text-slate-900">
            Professional Website{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Coded Templates
            </span>
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Deploy production-grade, highly structured web experiences in seconds. Each template is pre-crafted with robust mobile responsiveness, optimal modern tech stacks, and modular layout structures.
          </p>
        </div>

        {/* Interactive Premium System Pricing Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4 pb-4" id="template-pricing-tiers">
          {/* Tier 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold bg-slate-100/80 px-2.5 py-1 rounded-md">
                  Entry Level
                </span>
                <span className="text-slate-400 font-mono text-[10px]">Tier 1</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Basic Website Template</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Ideal for personal portfolios, landing pages, and single-page startup launches.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">$39–$59</span>
                <span className="text-slate-400 text-[10px] font-mono block mt-1">One-time flat license</span>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100">
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Polished Mobile layout</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Static content grids</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Pure React/Tailwind base</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-6 bg-blue-600 text-white font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-b-xl">
              Most Popular
            </div>
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold bg-blue-50 px-2.5 py-1 rounded-md">
                  Business Growth
                </span>
                <span className="text-blue-500 font-mono text-[10px] font-bold">Tier 2</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Professional Business Website</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Great for corporate platforms, consulting agencies, and localized directories.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-2xl font-black text-blue-600 tracking-tight">$79–$149</span>
                <span className="text-slate-400 text-[10px] font-mono block mt-1">Priority updates included</span>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100">
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Dynamic CMS database logic</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Interactive state management</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Advanced newsletter & forms integration</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-bold bg-indigo-50 px-2.5 py-1 rounded-md">
                  Enterprise Power
                </span>
                <span className="text-indigo-400 font-mono text-[10px]">Tier 3</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Full Premium Systems</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Robust templates for high-trust logistics, cloud accounting, and e-commerce apps with dashboard layouts.
                </p>
              </div>
              <div className="pt-2">
                <span className="text-2xl font-black text-indigo-700 tracking-tight">$199–$499</span>
                <span className="text-slate-400 text-[10px] font-mono block mt-1">Full source architecture</span>
              </div>
              <ul className="space-y-2 pt-4 border-t border-slate-100">
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Premium dashboards & analytic cards</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-650 font-bold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-900">Logistics, accounting, ecommerce systems</span>
                </li>
                <li className="flex items-center space-x-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Snippe checkout integration ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Categories selector filter pill deck */}
        <div className="space-y-3">
          <label className="block text-center text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
            Filter templates by category
          </label>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const isSelected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 scale-[1.02] shadow-sm shadow-blue-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-blue-600 hover:border-blue-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading cover spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24 min-h-[300px]">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Syncing website catalog...</p>
          </div>
        ) : (
          <>
            {/* Templates listed card grids */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="websites-grid">
                {filteredTemplates.map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-101 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    
                    {/* Visual preview slot */}
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                      <img 
                        src={item.previewImages[0] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full border border-white/10">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Meta & details content */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-blue-600 uppercase font-bold tracking-wider">
                          {item.category}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Stack and details list row */}
                      <div className="border-t border-slate-100 pt-4 space-y-3 mt-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.techStack.slice(0, 3).map((stack, idx) => (
                            <span key={idx} className="text-[9px] font-mono font-bold bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-1 rounded">
                              {stack}
                            </span>
                          ))}
                          {item.techStack.length > 3 && (
                            <span className="text-[9px] font-mono bg-slate-50 text-slate-400 px-2.5 py-1 rounded">
                              +{item.techStack.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Direct action triggers */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={item.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center space-x-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[10px] font-bold text-slate-700 uppercase py-2.5 rounded-xl cursor-pointer transition-colors text-center"
                          >
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            <span>Demo Preview</span>
                          </a>

                          <button
                            onClick={() => setSelectedTemplateId(item.id)}
                            className="bg-slate-900 hover:bg-black text-[10px] font-bold text-white uppercase py-2.5 rounded-xl tracking-wider cursor-pointer hover:shadow-md transition-all text-center"
                          >
                            <span>Buy & specs</span>
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* No item found state */
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl max-w-3xl mx-auto space-y-4">
                <span className="block text-4xl">🔍</span>
                <h3 className="text-base font-bold text-slate-800">No templates found in category</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
                  We currently do not have deployed website blueprints listed under "{categoryFilter}". Check back soon or request custom templates via contact inquiry channels.
                </p>
                <button 
                  onClick={() => setCategoryFilter('All')}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-colors text-slate-700"
                >
                  Reset Active Filters
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
