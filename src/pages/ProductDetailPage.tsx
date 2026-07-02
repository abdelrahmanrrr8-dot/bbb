import { useEffect, useState } from 'react';
import { ShoppingCart, Minus, Plus, ArrowRight, Check, Truck, ShieldCheck, RotateCcw, Star, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, formatPrice, isOnSale } from '../lib/types';
import { useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export function ProductDetailPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      setProduct(data);
      setLoading(false);
      if (data) {
        supabase.from('products').select('*').eq('category', data.category).neq('id', id).limit(4)
          .then(({ data: rel }) => setRelated(rel || []));
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-silver-100 rounded-sm" />
          <div className="space-y-4"><div className="h-8 bg-silver-100 rounded w-3/4" /><div className="h-6 bg-silver-100 rounded w-1/4" /><div className="h-24 bg-silver-100 rounded" /></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-jet mb-2">المنتج غير موجود</h2>
        <button onClick={() => navigate('/shop')} className="btn-gold mt-4">العودة للمنتجات</button>
      </div>
    );
  }

  const sale = isOnSale(product);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-silver-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-gold-500 transition-colors">الرئيسية</button>
        <ArrowRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate(`/shop?category=${product.category}`)} className="hover:text-gold-500 transition-colors">{product.category}</button>
        <ArrowRight className="w-3.5 h-3.5" />
        <span className="text-jet font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-sm shadow-card overflow-hidden relative">
          {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" /> : <div className="w-full aspect-square bg-silver-100 flex items-center justify-center"><ShoppingCart className="w-24 h-24 text-silver-400" /></div>}
          {sale && <span className="tag-sale">SALE</span>}
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gold-500 font-semibold uppercase tracking-wide mb-1">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-jet mb-2">{product.name}</h1>

          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
            <span className="text-xs text-silver-500 mr-2">(4.9 / 5)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-alert">{formatPrice(product.price)}</span>
            {sale && product.old_price && <span className="text-lg line-through text-silver-500">{formatPrice(product.old_price)}</span>}
          </div>

          {product.description && <p className="text-silver-600 leading-relaxed mb-6">{product.description}</p>}

          {/* Specifications */}
          <div className="bg-silver-50 rounded-sm p-4 mb-6 space-y-2">
            <h3 className="text-sm font-bold text-jet mb-2">المواصفات</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-silver-600"><Package className="w-4 h-4 text-gold-500" /><span>العلامة: {product.brand || 'محمد جودة'}</span></div>
              <div className="flex items-center gap-2 text-silver-600"><Check className="w-4 h-4 text-gold-500" /><span>القسم: {product.category}</span></div>
              <div className="flex items-center gap-2 text-silver-600"><Check className="w-4 h-4 text-gold-500" /><span>المخزون: {product.stock} قطعة</span></div>
              <div className="flex items-center gap-2 text-silver-600"><Check className="w-4 h-4 text-gold-500" /><span>الضمان: سنة كاملة</span></div>
            </div>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-green-50 text-green-700 text-sm font-medium"><Check className="w-4 h-4" /> متوفر في المخزون ({product.stock} قطعة)</span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-red-50 text-alert text-sm font-medium">نفذت الكمية</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-silver-300 rounded-sm overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-silver-100 transition-colors"><Minus className="w-4 h-4 text-jet" /></button>
              <span className="w-12 text-center font-bold text-jet">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-silver-100 transition-colors"><Plus className="w-4 h-4 text-jet" /></button>
            </div>
            <button onClick={() => { addToCart(product, quantity); setAdded(true); setTimeout(() => setAdded(false), 2000); }} disabled={product.stock === 0} className="btn-gold flex-1">
              {added ? <><Check className="w-5 h-5" /> تمت الإضافة</> : <><ShoppingCart className="w-5 h-5" /> أضف للسلة</>}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-silver-200">
            {[
              { icon: Truck, label: 'توصيل سريع' },
              { icon: ShieldCheck, label: 'ضمان أصلي' },
              { icon: RotateCcw, label: 'استبدال سهل' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1">
                <b.icon className="w-6 h-6 text-gold-500" />
                <span className="text-xs text-silver-600 font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-heading">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {related.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickView} />)}
          </div>
        </section>
      )}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
