import { useState } from 'react';
import { 
  Menu, X, Sparkles, ShoppingCart, LayoutGrid, Heart, BookOpen, User, Lock
} from 'lucide-react';
import { CategoryType } from '../types';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, params?: any) => void;
  cartCount: number;
  isAdminUnlocked?: boolean;
  onToggleAdminUnlock?: () => void;
}

export default function Header({ currentRoute, onNavigate, cartCount, isAdminUnlocked, onToggleAdminUnlock }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    if (onToggleAdminUnlock) {
      const nextClicks = logoClicks + 1;
      if (nextClicks >= 5) {
        onToggleAdminUnlock();
        setLogoClicks(0);
      } else {
        setLogoClicks(nextClicks);
      }
    } else {
      onNavigate('home');
    }
  };

  const navLinks = [
    { name: 'Home', route: 'home' },
    { name: 'Shop Templates', route: 'shop' },
    { name: 'Website Templates', route: 'website-templates' },
    { name: 'Affiliate Tools', route: 'affiliates' },
    { name: 'Categories', route: 'categories' },
    { name: 'FAQ', route: 'faq' },
    { name: 'About', route: 'about' },
    { name: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Accent */}
          <div 
            onClick={handleLogoClick} 
            className="flex items-center space-x-2 cursor-pointer group select-none"
            id="header-brand-logo"
            title="Double-tap Logo 5 times to reveal admin mode"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-lg sm:text-xl tracking-wider text-slate-900 bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                FRAMSIRONA
              </span>
              <span className="block text-slate-400 font-mono text-[9px] tracking-widest uppercase">
                Digital Store
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-px lg:space-x-1 items-center" id="desktop-nav-menu">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`md:px-2 lg:px-4 py-2 rounded-lg font-sans md:text-xs lg:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action Utilities Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Elegant direct portal to admin dashboard */}
            {isAdminUnlocked && (
              <button
                onClick={() => onNavigate('admin')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentRoute === 'admin' 
                    ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                    : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50 border border-transparent'
                }`}
                title="Admin Portal"
                id="header-admin-gateway"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

            {/* Simulated Marketplace Dashboard */}
            <div className="relative group cursor-pointer" onClick={() => onNavigate('shop')}>
              <div className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-xs text-slate-700 font-semibold">{cartCount} items</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Action Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            {isAdminUnlocked && (
              <button
                onClick={() => onNavigate('admin')}
                className="p-2 text-slate-500 hover:text-blue-600"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onNavigate('shop')}
              className="p-2 text-slate-500 hover:text-blue-600 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center text-white font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
