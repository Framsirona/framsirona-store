import { useMemo } from 'react';
import { ShieldAlert, ArrowLeft, ShoppingBag, Info, PhoneCall } from 'lucide-react';
import { Product } from '../types';

interface PaymentCancelProps {
  productId: string;
  productType: 'product' | 'website';
  allProducts: Product[];
  onNavigate: (route: string, params?: any) => void;
}

export default function PaymentCancel({ productId, productType, allProducts, onNavigate }: PaymentCancelProps) {
  
  const product = useMemo(() => {
    return allProducts.find(p => p.id === productId) || null;
  }, [allProducts, productId]);

  return (
    <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-7 text-center shadow-2xl">
        
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="w-7 h-7" />
        </div>

        {/* Canceled header */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">Transaction Aborted</span>
          <h1 className="text-xl sm:text-2xl font-black text-white m-0 tracking-tight">Checkout Canceled</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The payment transaction process was suspended by the user or gateway agent. Card authorizations have not been processed.
          </p>
        </div>

        {/* Product specs card */}
        {product && (
          <div className="bg-slate-950 p-4 rounded-2xl flex items-center space-x-3.5 text-left border border-slate-850">
            <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-800">
              <img 
                src={product.previewImages[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-grow">
              <span className="text-[9px] font-mono text-slate-500 leading-none inline-block">{product.category}</span>
              <h3 className="text-xs font-bold text-slate-200 block truncate m-0 leading-tight">{product.title}</h3>
              <span className="text-[11px] font-mono text-blue-400 block font-bold">${product.price.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Direct instructions info bullet */}
        <div className="text-[10.5px] font-mono leading-relaxed text-slate-500 py-1 flex items-start space-x-2 text-left bg-slate-950/40 p-3 rounded-xl border border-dotted border-slate-800">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>If this cancelation occurred due to credit card authorization errors, please double-check card credentials or get in touch with Framsirona customer support.</span>
        </div>

        {/* CTA triggers */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span>View Catalog</span>
          </button>

          <button
            onClick={() => onNavigate(productType === 'website' ? 'website-templates' : 'product-details', { id: productId })}
            className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-101 shadow-lg text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retry Purchase</span>
          </button>
        </div>

      </div>
    </div>
  );
}
