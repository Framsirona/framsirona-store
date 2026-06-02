import { Sparkles, Mail, Github, Heart, Shield, CheckCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string, params?: any) => void;
  isAdminUnlocked?: boolean;
}

export default function Footer({ onNavigate, isAdminUnlocked }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Credential statement */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-wider">
                FRAMSIRONA
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Curated marketplace for premium graphics, Canva kits, coding books, and digital branding assets designed to scale creative projects effortlessly.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg w-max">
              <Shield className="w-3.5 h-3.5 animate-pulse" />
              <span>Verified Secure Delivery</span>
            </div>
          </div>

          {/* Useful Quick Links */}
          <div>
            <h4 className="text-slate-800 font-bold text-sm tracking-wider uppercase mb-5 font-mono">
              Explore Store
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate('shop')} className="text-left hover:text-blue-600 transition-colors">
                  All Digital Templates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('website-templates')} className="text-left hover:text-blue-600 transition-colors font-semibold text-blue-600">
                  Website Templates ★
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliates')} className="text-left hover:text-blue-600 transition-colors">
                  Recommended Gear & Tools
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="text-left hover:text-blue-600 transition-colors">
                  Curated Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-left hover:text-blue-600 transition-colors">
                  Creator Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-left hover:text-rose-600 font-semibold transition-colors">
                  💡 FAQ Helpdesk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-left hover:text-blue-600 transition-colors">
                  Contact Support
                </button>
              </li>
              <li className="flex items-center space-x-2 pt-1.5 border-t border-slate-200/60 mt-1.5">
                <a href="/sitemap.xml" target="_blank" className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-mono">
                  Sitemap
                </a>
                <span className="text-slate-300 font-mono text-[9px]">|</span>
                <a href="/robots.txt" target="_blank" className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-mono">
                  Robots
                </a>
              </li>
            </ul>
          </div>

          {/* Template Specialties */}
          <div>
            <h4 className="text-slate-800 font-bold text-sm tracking-wider uppercase mb-5 font-mono">
              Market Specialties
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-blue-600" />
                <span>Modern Social Media Kits</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-blue-600" />
                <span>Vector Typography Posters</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-blue-600" />
                <span>Layered Corporate PSD Files</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle className="w-3 h-3 text-blue-600" />
                <span>Sleek Freelance Invoices</span>
              </li>
            </ul>
          </div>

          {/* Security & Regulations Policy */}
          <div>
            <h4 className="text-slate-800 font-bold text-sm tracking-wider uppercase mb-5 font-mono">
              Compliance & Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onNavigate('disclaimer')} className="hover:text-blue-600 transition-colors">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </button>
              </li>
              {isAdminUnlocked && (
                <li>
                  <button onClick={() => onNavigate('admin')} className="text-blue-600 hover:text-blue-800 transition-colors font-mono text-xs flex items-center space-x-1">
                    <span>🔒 Secure Admin Login</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Outer credit bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {currentYear} Framsirona Store. All rights reserved. Built using highly secure modular standards.</p>
          <p className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>for elite template developers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
