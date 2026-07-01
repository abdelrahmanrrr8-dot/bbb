import { useEffect, useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, CATEGORIES, Category } from '../lib/types';
import { useRouter } from '../lib/router';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export function ProductsPage() {
  const { route, navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const selectedCategory = route.params.category as Category | undefined;
  const searchQuery = route.params.q || '';
  const saleOnly = route.params.sale === 'true';

  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');
    if (selectedCategory) query = query.eq('category', selectedCategory);
    if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    if (saleOnly) query = query.not('old_price', 'is', null);
    query.order('created_at', { ascending: false }).then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery, saleOnly]);

  const sortedAndFiltered = useMemo(() => {
    let result = [...products];
    if (maxPrice !== null) result = result.filter((p) => p.price <= maxPrice);
    if (inStockOnly) result = result.filter((p) => p.stock > 0);
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, sort, maxPrice, inStockOnly]);

  const setCategory = (cat: Category | undefined) => {
    if (cat) navigate(`/products?category=${cat}`);
    else navigate('/products');
    setShowFilters(false);
  };

  const pageTitle = saleOnly ? 'العروض' : selectedCategory || (searchQuery ? 'نتائج البحث' : 'جميع المنتجات');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-jet font-display">{pageTitle}</h1>
        {searchQuery && (
          <p className="text-silver-500 mt-1 text-sm">
            نتائج البحث عن: <span className="font-semibold text-jet">"{searchQuery}"</span>
          </p>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-sm shadow-card p-5 sticky top-44">
            <h3 className="font-bold text-jet mb-4 flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-gold-500" />
              تصفية
            </h3>

            {/* Categories */}
            <div className="mb-5">
              <p className="text-xs font-bold text-silver-600 mb-2 uppercase">الأقسام</p>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory(undefined)}
                  className={`w-full text-right px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                    !selectedCategory ? 'bg-gold-400 text-jet' : 'text-silver-700 hover:bg-silver-100'
                  }`}
                >
                  جميع الأقسام
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`w-full text-right px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.key ? 'bg-gold-400 text-jet' : 'text-silver-700 hover:bg-silver-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="mb-5">
              <p className="text-xs font-bold text-silver-600 mb-2 uppercase">السعر الأقصى</p>
              <input
                type="range"
                min="0"
                max="6000"
                step="100"
                value={maxPrice || 6000}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-400"
              />
              <p className="text-xs text-silver-600 mt-1">
                {maxPrice !== null ? `حتى ${new Intl.NumberFormat('en-US').format(maxPrice)} L.E` : 'كل الأسعار'}
              </p>
              {maxPrice !== null && (
                <button onClick={() => setMaxPrice(null)} className="text-xs text-alert hover:underline mt-1">
                  إلغاء فلتر السعر
                </button>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-gold-400"
                />
                <span className="text-sm text-silver-700">المتوفر فقط</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setShowFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-sm border border-silver-300 text-jet font-medium text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              تصفية
            </button>
            <span className="text-sm text-silver-500">
              {loading ? '...' : `${sortedAndFiltered.length} منتج`}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-3 py-2 rounded-sm border border-silver-300 bg-white text-jet text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-card p-3 animate-pulse">
                  <div className="aspect-square bg-silver-100 rounded-sm mb-2" />
                  <div className="h-3 bg-silver-100 rounded mb-2" />
                  <div className="h-3 bg-silver-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : sortedAndFiltered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-silver-200 flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-silver-400" />
              </div>
              <h3 className="text-lg font-bold text-jet mb-1">لا توجد منتجات</h3>
              <p className="text-silver-500 text-sm">لم نعثر على منتجات مطابقة. جرب تغيير الفلاتر.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedAndFiltered.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute top-0 right-0 w-72 max-w-[85%] h-full bg-white p-5 animate-slide-left overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-jet">تصفية</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-sm hover:bg-silver-100">
                <X className="w-5 h-5 text-silver-600" />
              </button>
            </div>
            <div className="space-y-1 mb-5">
              <button onClick={() => setCategory(undefined)} className={`w-full text-right px-3 py-2 rounded-sm text-sm font-medium ${!selectedCategory ? 'bg-gold-400 text-jet' : 'text-silver-700 hover:bg-silver-100'}`}>
                جميع الأقسام
              </button>
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => setCategory(cat.key)} className={`w-full text-right px-3 py-2 rounded-sm text-sm font-medium flex items-center gap-2 ${selectedCategory === cat.key ? 'bg-gold-400 text-jet' : 'text-silver-700 hover:bg-silver-100'}`}>
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="mb-5">
              <p className="text-xs font-bold text-silver-600 mb-2 uppercase">السعر الأقصى</p>
              <input type="range" min="0" max="6000" step="100" value={maxPrice || 6000} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-gold-400" />
              <p className="text-xs text-silver-600 mt-1">{maxPrice !== null ? `حتى ${new Intl.NumberFormat('en-US').format(maxPrice)} L.E` : 'كل الأسعار'}</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-gold-400" />
              <span className="text-sm text-silver-700">المتوفر فقط</span>
            </label>
          </div>
        </div>
      )}

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
