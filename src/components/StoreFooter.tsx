import { Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { useRouter } from '../lib/router';
import { STORE_INFO } from '../lib/storeInfo';

// TikTok icon (not in lucide-react by default)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}

export function StoreFooter() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-jet text-silver-200 mt-20" id="contact">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-sm bg-gold-gradient flex items-center justify-center shadow-gold-sm">
                <span className="text-2xl font-bold text-jet font-display">م</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">محمد جودة</h3>
                <p className="text-xs text-gold-400 tracking-widest">PREMIUM HOME STORE</p>
              </div>
            </div>
            <p className="text-silver-400 text-sm leading-relaxed max-w-md mb-4">
              معرض محمد جودة - وجهتك الأولى للمفروشات الفاخرة والأدوات المنزلية والأجهزة الكهربائية في زفتى والغربية. جودة عالية وأسعار تنافسية وخدمة عملاء متميزة.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              <a href={STORE_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-sm bg-jet-50 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={STORE_INFO.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-sm bg-jet-50 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors" aria-label="TikTok">
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-sm bg-jet-50 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-gold-400 mb-4 text-sm uppercase tracking-wide">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'الرئيسية', path: '/' },
                { label: 'مفروشات', path: '/shop?category=مفروشات' },
                { label: 'أدوات منزلية', path: '/shop?category=أدوات منزلية' },
                { label: 'أجهزة كهربائية', path: '/shop?category=أجهزة كهربائية' },
                { label: 'عروض', path: '/shop?sale=true' },
              ].map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="text-silver-400 hover:text-gold-400 transition-colors">{link.label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 className="font-bold text-gold-400 mb-4 text-sm uppercase tracking-wide">معلومات</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'عنا', path: '/about' },
                { label: 'سياسة الاسترجاع', path: '/return-policy' },
                { label: 'الأسئلة الشائعة', path: '/#faq' },
              ].map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="text-silver-400 hover:text-gold-400 transition-colors">{link.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-jet-50 mt-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-silver-400">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{STORE_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-silver-400">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span dir="ltr">{STORE_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-silver-400">
              <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{STORE_INFO.hours}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-jet-50 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-silver-500 text-sm text-center md:text-right">© 2026 معرض محمد جودة. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-silver-500 ml-2">طرق الدفع:</span>
              {['VISA', 'MasterCard', 'كاش'].map((method) => (
                <div key={method} className="px-3 py-1.5 rounded-sm bg-white text-jet text-xs font-bold border border-silver-300">{method}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
