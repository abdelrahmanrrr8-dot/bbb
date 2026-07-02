import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Truck, ShieldCheck, Headphones, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../lib/types';
import { useRouter } from '../lib/router';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export function HomePage() {
  const { navigate } = useRouter();
  const [latest, setLatest] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const slides = [
    {
      title: 'مفروشات تحول حلمك إلى حقيقة',
      subtitle: 'تشكيلة فاخرة من الأرائك والسرر والسجاد بأرقى التصاميم',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
      cta: 'تسوق الآن',
      link: '/shop?category=مفروشات',
    },
    {
      title: 'أدوات منزلية بأناقة لا مثيل لها',
      subtitle: 'أواني طبخ وأطقم عشاء بجودة عالية وتصاميم عصرية',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1200',
      cta: 'اكتشف المجموعة',
      link: '/shop?category=أدوات منزلية',
    },
    {
      title: 'أجهزة كهربائية بأحدث التقنيات',
      subtitle: 'ثلاجات وغسالات ومكيفات من أفضل العلامات التجارية',
      image: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=1200',
      cta: 'تصفح الأجهزة',
      link: '/shop?category=أجهزة كهربائية',
    },
  ];

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('products').select('*').eq('best_seller', true).limit(10),
    ]).then(([latestRes, bestRes]) => {
      setLatest(latestRes.data || []);
      setBestSellers(bestRes.data || []);
      setLoading(false);
    });
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const latestRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    if (ref.current) {
      const amount = 300;
      ref.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const categoryCards: { key: Category; desc: string; image: string }[] = [
    { key: 'مفروشات', desc: 'أرائك، سرر، سجاد وستائر', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600' },
    { key: 'أدوات منزلية', desc: 'أواني طبخ، أطباق وأدوات المطبخ', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600' },
    { key: 'أجهزة كهربائية', desc: 'ثلاجات، غسالات ومكيفات', image: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=600' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Main banner: two-column layout */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: slider (2/3 width) */}
          <div className="lg:col-span-2 relative h-[300px] md:h-[400px] rounded-sm overflow-hidden shadow-card group">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-700 ${i === slideIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center pr-8 md:pr-16 text-right">
                  <h2 className="text-2xl md:text-4xl font-bold text-white font-display mb-2 md:mb-3 max-w-md"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {slide.title}
                  </h2>
                  <p className="text-sm md:text-base text-silver-200 mb-4 md:mb-6 max-w-md"
                     style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => navigate(slide.link)}
                    className="btn-gold self-start mr-auto"
                  >
                    {slide.cta}
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Slider arrows */}
            <button
              onClick={() => setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 backdrop-blur text-white flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSlideIdx((prev) => (prev + 1) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 backdrop-blur text-white flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? 'bg-gold-400 w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* Right: latest products sidebar */}
          <div className="bg-white rounded-sm shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-jet font-display flex items-center gap-2">
                <span className="w-1 h-5 bg-gold-400 rounded-full" />
                أحدث المنتجات
              </h3>
              <button onClick={() => navigate('/shop')} className="text-xs text-gold-500 hover:text-gold-600 font-medium">
                عرض الكل
              </button>
            </div>
            <div className="space-y-3 max-h-[340px] overflow-y-auto">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-16 bg-silver-100 rounded-sm" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-silver-100 rounded w-3/4" />
                      <div className="h-3 bg-silver-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                latest.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 group cursor-pointer hover:bg-silver-50 p-1.5 rounded-sm transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image_url || ''}
                      alt={product.name}
                      className="w-16 h-16 rounded-sm object-cover bg-silver-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-jet line-clamp-2 group-hover:text-gold-500 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm font-bold text-alert mt-1">
                        {new Intl.NumberFormat('en-US').format(product.price)} L.E
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-jet py-3 my-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Truck, title: 'توصيل سريع', desc: 'لكل المحافظات' },
              { icon: ShieldCheck, title: 'ضمان أصلي', desc: 'على جميع المنتجات' },
              { icon: Headphones, title: 'دعم 24/7', desc: 'خدمة عملاء متميزة' },
              { icon: Sparkles, title: 'جودة عالية', desc: 'منتجات مختارة بعناية' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-sm bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">{f.title}</h3>
                  <p className="text-[10px] text-silver-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="section-heading">تسوق حسب القسم</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {categoryCards.map((cat) => (
            <button
              key={cat.key}
              onClick={() => navigate(`/shop?category=${cat.key}`)}
              className="group relative overflow-hidden rounded-sm shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 h-48"
            >
              <img
                src={cat.image}
                alt={cat.key}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5 text-right">
                <h3 className="text-xl font-bold text-white font-display mb-1"
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  {cat.key}
                </h3>
                <p className="text-sm text-silver-200 mb-2">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-gold-400 text-sm font-bold group-hover:gap-2 transition-all">
                  تصفح المنتجات
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Latest products carousel */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">أحدث المنتجات</h2>
          <div className="flex gap-1">
            <button onClick={() => scrollCarousel(latestRef, 'right')} className="w-9 h-9 rounded-sm bg-white border border-silver-300 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollCarousel(latestRef, 'left')} className="w-9 h-9 rounded-sm bg-white border border-silver-300 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-48 flex-shrink-0 product-card p-3 animate-pulse">
                <div className="aspect-square bg-silver-100 rounded-sm mb-2" />
                <div className="h-3 bg-silver-100 rounded mb-2" />
                <div className="h-3 bg-silver-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div ref={latestRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
            {latest.map((product) => (
              <div key={product.id} className="w-44 md:w-52 flex-shrink-0">
                <ProductCard product={product} onQuickView={setQuickView} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Best sellers carousel */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading">الأكثر مبيعاً</h2>
          <div className="flex gap-1">
            <button onClick={() => scrollCarousel(bestRef, 'right')} className="w-9 h-9 rounded-sm bg-white border border-silver-300 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollCarousel(bestRef, 'left')} className="w-9 h-9 rounded-sm bg-white border border-silver-300 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-48 flex-shrink-0 product-card p-3 animate-pulse">
                <div className="aspect-square bg-silver-100 rounded-sm mb-2" />
                <div className="h-3 bg-silver-100 rounded mb-2" />
                <div className="h-3 bg-silver-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div ref={bestRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
            {bestSellers.map((product) => (
              <div key={product.id} className="w-44 md:w-52 flex-shrink-0">
                <ProductCard product={product} onQuickView={setQuickView} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick view modal */}
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
