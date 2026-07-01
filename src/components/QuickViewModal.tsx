import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, Star } from 'lucide-react';
import { Product, formatPrice, isOnSale } from '../lib/types';
import { useCart } from '../lib/cart';
import { useRouter } from '../lib/router';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { navigate } = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-zoom-in overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-silver-100 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-silver-400">
                <ShoppingCart className="w-16 h-16" />
              </div>
            )}
            {isOnSale(product) && (
              <span className="tag-sale">SALE</span>
            )}
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col">
            <span className="text-xs text-gold-500 font-semibold tracking-wide uppercase mb-1">
              {product.category}
            </span>
            <h2 className="text-lg font-bold text-jet mb-2">{product.name}</h2>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-xl font-bold text-alert">{formatPrice(product.price)}</span>
              {isOnSale(product) && product.old_price && (
                <span className="text-sm line-through text-silver-500">
                  {formatPrice(product.old_price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-xs text-silver-600 leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <p className={`text-xs mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-alert'}`}>
              {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'نفذت الكمية'}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-silver-300">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-silver-100 transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-silver-100 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 mt-auto">
              <button onClick={handleAdd} disabled={product.stock === 0} className="btn-gold w-full">
                {added ? <><Check className="w-4 h-4" /> تمت الإضافة</> : <><ShoppingCart className="w-4 h-4" /> أضف للسلة</>}
              </button>
              <button
                onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
                className="btn-outline-gold w-full"
              >
                عرض التفاصيل الكاملة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
