import { useState, useMemo, FormEvent } from 'react';
import { 
  ArrowLeft, Download, ShieldCheck, HardDrive, FileType, Check, Calendar, 
  ExternalLink, Sparkles, AlertCircle, ShoppingCart 
} from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { recordOrder } from '../lib/firebase';
import { redirectToHostedCheckout } from '../lib/paymentConfig';

interface ProductDetailsProps {
  productId: string;
  allProducts: Product[];
  onNavigate: (route: string, params?: any) => void;
  onAddToCart: () => void;
}

export default function ProductDetails({ productId, allProducts, onNavigate, onAddToCart }: ProductDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseStep, setPurchaseStep] = useState<'details' | 'download_ready'>('details');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseToken, setPurchaseToken] = useState('');

  // Lookup the targeted product
  const product = useMemo(() => {
    return allProducts.find(p => p.id === productId) || null;
  }, [allProducts, productId]);

  // Determine relative products (same category, excluding active product)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const matched = allProducts.filter(p => p.category === product.category && p.id !== product.id);
    return matched.length > 0 ? matched.slice(0, 3) : allProducts.filter(p => p.id !== product.id).slice(0, 3);
  }, [allProducts, product]);

  if (!product) {
    return (
      <div className="bg-slate-50 text-center py-24 space-y-4 min-h-screen">
        <h2 className="text-xl font-bold text-slate-800">File Reference Not Found</h2>
        <p className="text-slate-500 text-xs text-center max-w-sm mx-auto">
          The requested product may have been relocated or removed by the catalog administrator.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-white border border-slate-200 text-xs px-5 py-2.5 rounded-xl text-blue-600 font-bold shadow-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleSimulatePurchase = async (e: FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !product) return;

    setPurchaseLoading(true);
    try {
      const order = await recordOrder({
        productId: product.id,
        productType: 'product',
        productTitle: product.title,
        buyerEmail: buyerEmail,
        pricePaid: 0, // trial shortcut is free
        paymentGateway: 'Snippe',
        paymentIntentId: 'snippe_trial_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'completed'
      });
      setPurchaseToken(order.downloadToken);
      setPurchaseStep('download_ready');
      onAddToCart(); // increase global cart counter for visual satisfaction
    } catch (err) {
      console.error("Failed to generate free Snippe download key", err);
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back navigational route */}
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          id="details-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grid Catalog</span>
        </button>

        {/* Core Product Layout: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* COLUMN A: PREVIEW CAROUSEL */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-sm">
              <img
                src={product.previewImages[activeImageIndex] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                id="details-primary-image"
              />
            </div>
            
            {/* Gallery Thumbnail Selector */}
            {product.previewImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.previewImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImageIndex === index ? 'border-blue-600' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Spec / Size Attributes Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold tracking-wider font-mono uppercase text-slate-500">
                Template Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-slate-400 text-[10px]">FILE FORMAT</span>
                  <span className="text-slate-800 font-bold block truncate">{product.fileFormat || 'Not specified'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-slate-400 text-[10px]">FILE SIZE</span>
                  <span className="text-slate-800 font-bold block">{product.fileSize || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-slate-400 text-[10px]">CATEGORY</span>
                  <span className="text-slate-200 font-bold block text-slate-700">{product.category}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-slate-400 text-[10px]">RELEASE DATE</span>
                  <span className="text-slate-800 font-bold block">
                    {new Date(product.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN B: DESCRIPTION & SIMULATED CHECKOUT */}
          <div className="space-y-8">
            
            {/* Heading Context */}
            <div className="space-y-4">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-mono font-bold tracking-wider px-3 py-1.5 rounded-full border border-blue-100 uppercase w-max block">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-mono font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-mono">One-time payment</span>
              </div>
            </div>

            {/* Description Segment */}
            <div className="border-t border-b border-slate-200 py-6">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Reusable premium features bullets */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Asset Highlights
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* DUAL CHECKOUT ENGINE BLOCK */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm" id="checkout-panel">
              {purchaseStep === 'details' ? (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-slate-900 font-bold text-sm tracking-tight flex items-center space-x-1.5 mt-0 mb-0">
                        <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span>Purchase Digital Materials</span>
                      </h3>
                      <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Snippe Checkout
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Unlock lifelong access immediately. Files are stored securely on high-speed servers with multiple redundant formats.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Primary DIRECT buy button */}
                    <button
                      onClick={() => {
                        // Redirect straight to the configurable Snippe hosted checkout page (using window.location.href)
                        // To restore future API session-based integration, revert this to use onNavigate('checkout-sandbox', ...)
                        redirectToHostedCheckout(product.checkoutUrl);
                      }}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:scale-101 hover:brightness-105 transition-all text-xs uppercase tracking-wider shadow-sm"
                      id="buy-now-btn"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy Now — ${product.price.toFixed(2)}</span>
                    </button>

                    <div className="flex items-center justify-center space-x-1 text-[9.5px] font-mono text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Security verified by Snippe Checkout. Lifetime updates included.</span>
                    </div>
                  </div>

                  {/* Free offline test shortcut for fast sandbox assessment */}
                  <div className="pt-4 border-t border-dashed border-slate-100 space-y-3">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block font-bold">Instant Simulator Shortcut</span>
                    <form onSubmit={handleSimulatePurchase} className="space-y-2.5">
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Or skip payment gateways completely to test the post-checkout secure download portal instantly with email registration:
                      </p>
                      <div className="flex gap-2">
                        <input
                          required
                          type="email"
                          placeholder="test@framsirona.com"
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="flex-grow bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2 px-3 text-xs font-mono text-slate-800 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={purchaseLoading}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                        >
                          {purchaseLoading ? '...' : 'Access Now'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 text-center py-2" id="download-ready-panel">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mx-auto border border-blue-100">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-base">Payment Complete!</h3>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Thank you for trusting Framsirona Store. Direct redirection tokens have been granted safely.
                    </p>
                  </div>

                  {/* Access Secure Download Page Link */}
                  <button
                    onClick={() => onNavigate('secure-download', { id: product.id, type: 'product', email: buyerEmail || 'demo-user@framsirona.org', token: purchaseToken })}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer hover:scale-101 hover:brightness-105 transition-all text-xs uppercase tracking-wider"
                  >
                    <Download className="w-4 h-4" />
                    <span>Retrieve Digital Materials</span>
                  </button>

                  <button
                    onClick={() => {
                      setPurchaseStep('details');
                      setBuyerEmail('');
                    }}
                    className="text-[10px] font-mono hover:text-blue-600 text-slate-400 block mx-auto underline mt-2 cursor-pointer"
                  >
                    Start a separate template transaction
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RELATED RECOMMENDATIONS ROW */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-slate-200 space-y-8" id="details-recommendations">
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">You might also favor</span>
              <h2 className="text-xl font-bold text-slate-900">Related Templates in {product.category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
