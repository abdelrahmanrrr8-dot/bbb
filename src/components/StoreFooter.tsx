import { Phone, MapPin, Clock, Mail, Facebook, Youtube, Twitter, Instagram } from 'lucide-react';
import { useRouter } from '../lib/router';

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
              معرض محمد جودة - وجهتك الأولى للمفروشات الفاخرة والأدوات المنزلية والأجهزة الكهربائية.
              جودة عالية وأسعار تنافسية وخدمة عملاء متميزة.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {[Facebook, Youtube, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-sm bg-jet-50 flex items-center justify-center hover:bg-gold-400 hover:text-jet transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
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
                  <button onClick={() => navigate(link.path)} className="text-silver-400 hover:text-gold-400 transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gold-400 mb-4 text-sm uppercase tracking-wide">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-silver-400">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span dir="ltr">010 0000 0000</span>
              </li>
              <li className="flex items-center gap-2 text-silver-400">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>info@mhjoda.com</span>
              </li>
              <li className="flex items-center gap-2 text-silver-400">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>الشارع الرئيسي، مدينتك</span>
              </li>
              <li className="flex items-center gap-2 text-silver-400">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>يومياً 9 ص - 11 م</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-jet-50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-silver-500 text-sm text-center md:text-right">
              © 2026 معرض محمد جودة. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-silver-500 ml-2">طرق الدفع:</span>
              {['VISA', 'MasterCard', 'PayPal', 'كاش'].map((method) => (
                <div key={method} className="px-3 py-1.5 rounded-sm bg-white text-jet text-xs font-bold border border-silver-300">
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
