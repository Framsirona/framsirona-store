import { ExternalLink, Tag, FileText, Download } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onNavigate: (route: string, params?: any) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  // Gracefully handle images array safely
  const cardImage = product.previewImages && product.previewImages.length > 0 
    ? product.previewImages[0] 
    : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800';

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onNavigate('product-details', { id: product.id })}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Hover image zoom and category label info */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
          <img 
            src={cardImage} 
            alt={product.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex space-x-1.5 z-10">
            <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border border-slate-200">
              {product.category}
            </span>
          </div>
          
          {/* Metadata Overlay Badge */}
          {(product.fileSize || product.fileFormat) && (
            <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-slate-900/85 backdrop-blur-sm text-white text-[9px] font-mono px-2 py-1 rounded border border-slate-800">
              <span>{product.fileFormat || 'Resource'}</span>
              {product.fileSize && <span>| {product.fileSize}</span>}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-2.5">
          <h3 className="font-sans font-bold text-slate-800 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & CTA trigger Section */}
      <div className="p-5 pt-0 border-t border-slate-200 flex items-center justify-between mt-auto">
        <div className="pt-2">
          <span className="block text-[9px] font-mono uppercase text-slate-400 tracking-wider">
            Price (USD)
          </span>
          <span className="font-mono text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('product-details', { id: product.id });
          }}
          className="flex items-center space-x-1.5 bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 px-4 py-2 rounded-xl text-xs text-slate-700 group-hover:text-white font-medium hover:scale-102 transition-all duration-300"
        >
          <span>Get Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
