import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { Product, CategoryInfo } from '../types';
import { INITIAL_CATEGORIES } from '../lib/initialData';
import ProductCard from '../components/ProductCard';

interface ShopProps {
  products: Product[];
  categories?: CategoryInfo[];
  onNavigate: (route: string, params?: any) => void;
  initialCategoryFilter?: string | null;
}

export default function Shop({ products, categories, onNavigate, initialCategoryFilter = null }: ShopProps) {
  const categoriesToRender = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'latest' | 'priceAsc' | 'priceDesc' | 'title'>('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync with homepage navigation requests
  useEffect(() => {
    if (initialCategoryFilter) {
      setSelectedCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Determine pricing bounds dynamically
  const absoluteMaxPrice = useMemo(() => {
    if (products.length === 0) return 100;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  useEffect(() => {
    if (absoluteMaxPrice > 0) {
      setMaxPrice(absoluteMaxPrice);
    }
  }, [absoluteMaxPrice]);

  // Combined Filters Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'priceAsc') {
          return a.price - b.price;
        }
        if (sortBy === 'priceDesc') {
          return b.price - a.price;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(absoluteMaxPrice);
    setSortBy('latest');
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Heading */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="text-[11px] font-mono text-slate-450 uppercase tracking-widest block">Explore and download</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            Digital Asset Catalog
          </h1>
          <p className="text-sm text-slate-500">
            Browse our comprehensive list of developer templates, Canva presentation designs, and premium digital items.
          </p>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="shop-layout-container">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block space-y-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm self-start">
            
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase">
                Search Shop
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-slate-800 transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase block">
                Categories
              </label>
              <div className="flex flex-col space-y-1.5 max-h-80 overflow-y-auto pr-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {categoriesToRender.map((cat) => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-60 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                <label className="font-bold tracking-wider uppercase">Max Price</label>
                <span className="text-blue-600 font-extrabold">${maxPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max={absoluteMaxPrice || 100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full select-none h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$0.00</span>
                <span>${absoluteMaxPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase block">
                Order By
              </label>
              <div className="relative">
                <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-55 border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-2.5 pl-4 pr-10 text-xs font-sans text-slate-700 cursor-pointer appearance-none transition-colors"
                >
                  <option value="latest">Latest Releases</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center space-x-2 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl py-2.5 text-xs text-slate-550 font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>

          </aside>

          {/* Mobile Filters Trigger */}
          <div className="lg:hidden flex gap-4 items-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-700 font-bold shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters & Sorting</span>
            </button>
            <span className="text-xs font-mono text-slate-500">{filteredProducts.length} Items Found</span>
          </div>

          {/* Main Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="shop-products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <span className="block text-4xl">🔍</span>
                <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  We couldn't find any resources that match your current search constraints. Try resetting the filters or broadening your search parameters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200 px-5 py-2.5 rounded-xl transition-all font-bold"
                  >
                    Clear Search Filters
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-bold text-slate-800">Filtering Options</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-slate-800">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase block">Search Catalog</label>
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-sans focus:border-blue-400 outline-none text-slate-800"
                />
              </div>

              {/* Mobile Categories list */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase block">Category Filter</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                      selectedCategory === 'All'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200/60'
                    }`}
                  >
                    All Items
                  </button>
                  {categoriesToRender.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${
                        selectedCategory === cat.id
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200/60'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label className="text-slate-550 font-bold">Max Price</label>
                  <span className="text-blue-600 font-extrabold">${maxPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={absoluteMaxPrice || 100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 appearance-none rounded-lg accent-blue-600"
                />
              </div>

              {/* Mobile sorting option */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 font-mono tracking-wider uppercase block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2.5 font-mono px-4 text-xs tracking-wider font-semibold outline-none text-slate-700"
                >
                  <option value="latest">Latest Releases</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <button
                onClick={handleResetFilters}
                className="w-full bg-slate-55 border border-slate-200 text-xs text-slate-550 py-3 rounded-xl font-bold flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs py-3 rounded-xl font-bold"
              >
                Apply Criteria
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
