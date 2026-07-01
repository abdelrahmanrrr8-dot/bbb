import { ShoppingCart, Eye } from 'lucide-react';
import { Product, formatPrice, isOnSale, isNew } from '../lib/types';
import { useCart } from '../lib/cart';
import { useRouter } from '../lib/router';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { navigate } = useRouter();

  const sale = isOnSale(product);
  const fresh = isNew(product);

  return (
    <div className="product-card group">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-silver-100 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="product-img"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-silver-400">
            <ShoppingCart className="w-16 h-16" />
          </div>
        )}

        {/* Tags */}
        {sale && <span className="tag-sale">SALE</span>}
        {!sale && fresh && <span className="tag-new">NEW</span>}

        {/* Quick view overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-4 py-2 rounded-sm bg-white/95 text-jet text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-gold-400 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              عرض سريع
            </button>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-sm bg-white text-alert text-xs font-bold">
              نفذت الكمية
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <span className="text-[10px] text-gold-500 font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        <h3
          className="text-sm font-semibold text-jet mt-1 line-clamp-2 cursor-pointer hover:text-gold-500 transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-alert">
            {formatPrice(product.price)}
          </span>
          {sale && product.old_price && (
            <span className="text-xs line-through text-silver-500">
              {formatPrice(product.old_price)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="w-full mt-3 py-2 rounded-sm bg-jet text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gold-400 hover:text-jet transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
