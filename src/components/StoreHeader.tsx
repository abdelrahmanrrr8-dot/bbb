import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, X, Facebook, Instagram } from 'lucide-react';
import { useCart } from '../lib/cart';
import { useRouter } from '../lib/router';
import { STORE_INFO } from '../lib/storeInfo';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}

interface StoreHeaderProps {
  onCartClick: () => void;
}

export function StoreHeader({ onCartClick }: StoreHeaderProps) {
  const { totalItems } = useCart();
  const { route, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (route.path === '/shop' && route.params.q) {
      setSearchQuery(route.params.q);
    }
  }, [route]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'الرئيسية', path: '/' },
    { label: 'مفروشات', path: '/shop?category=مفروشات' },
    { label: 'أدوات منزلية', path: '/shop?category=أدوات منزلية' },
    { label: 'أجهزة كهربائية', path: '/shop?category=أجهزة كهربائية' },
    { label: 'عروض', path: '/shop?sale=true' },
    { label: 'عنا', path: '/about' },
    { label: 'اتصل بنا', path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return route.path === '/';
    if (path.includes('category=')) return route.params.category === path.split('category=')[1];
    if (path.includes('sale=true')) return route.params.sale === 'true';
    if (path === '/shop') return route.path === '/shop';
    if (path === '/about') return route.path === '/about';
    return false;
  };

  return (
    <header className="sticky top-0 z-30">
      {/* Gold top bar */}
      <div className="gold-header-bg relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: utility icons */}
            <div className="flex items-center gap-2 md:gap-3 order-1">
              <button onClick={onCartClick} className="relative p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="السلة">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-jet" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-alert text-white text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
                )}
              </button>
              <button onClick={() => navigate('/cart')} className="hidden sm:block p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="حسابي">
                <User className="w-5 h-5 md:w-6 md:h-6 text-jet" />
              </button>
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="بحث">
                <Search className="w-5 h-5 md:w-6 md:h-6 text-jet" />
              </button>
            </div>

            {/* Center: brand name */}
            <button onClick={() => navigate('/')} className="order-2 flex flex-col items-center">
              <h1 className="text-2xl md:text-4xl font-bold text-jet font-display tracking-tight" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5), -1px -1px 1px rgba(100,70,0,0.3)' }}>محمد جودة</h1>
              <p className="text-[10px] md:text-xs text-jet/70 font-medium tracking-widest">MAFROUSHAT & HOME APPLIANCES</p>
            </button>

            {/* Right: social media */}
            <div className="flex items-center gap-1 md:gap-2 order-3">
              <a href={STORE_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4 md:w-5 md:h-5 text-jet" />
              </a>
              <a href={STORE_INFO.social.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="TikTok">
                <TikTokIcon className="w-4 h-4 md:w-5 md:h-5 text-jet" />
              </a>
              <a href="#" className="p-2 rounded-sm hover:bg-black/10 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4 md:w-5 md:h-5 text-jet" />
              </a>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-sm hover:bg-black/10 transition-colors mr-1" aria-label="القائمة">
                {mobileMenuOpen ? <X className="w-5 h-5 text-jet" /> : <Menu className="w-5 h-5 text-jet" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="bg-jet border-t border-jet-50 animate-slide-up">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن منتج..." autoFocus className="w-full pr-4 pl-12 py-3 rounded-sm bg-white text-jet placeholder-silver-500 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <button type="submit" className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-gold-400 flex items-center justify-center hover:bg-gold-300 transition-colors">
                  <Search className="w-5 h-5 text-jet" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Black navigation bar */}
      <nav className="bg-jet hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)} className={isActive(item.path) ? 'nav-link-active' : 'nav-link'}>{item.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-jet animate-slide-up">
          <div className="px-4 py-2">
            {navItems.map((item) => (
              <button key={item.label} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }} className={`block w-full text-right py-3 text-sm font-semibold border-b border-jet-50 ${isActive(item.path) ? 'text-gold-400' : 'text-silver-200'}`}>{item.label}</button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
