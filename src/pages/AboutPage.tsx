import { Award, Heart, Users, Store, Truck, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../lib/storeInfo';

export function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-jet py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-sm bg-gold-gradient flex items-center justify-center mx-auto mb-6 shadow-gold">
            <span className="text-4xl font-bold text-jet font-display">م</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display mb-3">عن معرض محمد جودة</h1>
          <p className="text-silver-300 text-lg leading-relaxed max-w-2xl mx-auto">
            رحلة من الإتقان والثقة في عالم المفروشات والأجهزة المنزلية
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-card p-8 md:p-12">
          <h2 className="text-2xl font-bold text-jet font-display mb-4">قصتنا</h2>
          <p className="text-silver-600 leading-relaxed mb-4">
            معرض محمد جودة هو اسم راسخ في تقديم أفضل المفروشات والأجهزة المنزلية والأجهزة الكهربائية. بدأت رحلتنا من قلب الغربية في زفتى، حيث أسسنا معرضاً يجمع بين الأصالة والحداثة في خدمة العائلة المصرية.
          </p>
          <p className="text-silver-600 leading-relaxed mb-4">
            نؤمن بأن المنزل هو مملكة أسرتك، لذلك نحرص على توفير منتجات مختارة بعناية من أفضل العلامات التجارية العالمية والمحلية. من الأرائك الفاخرة والسرر المريحة، إلى أطقم المطبخ والأجهزة الكهربائية الحديثة، نقدم كل ما يحتاجه منزلك تحت سقف واحد.
          </p>
          <p className="text-silver-600 leading-relaxed">
            على مر السنوات، بنينا سمعة طيبة قائمة على الثقة والجودة والأسعار التنافسية. هدفنا الأول هو رضا عملائنا، ونسعى دائماً لتقديم تجربة تسوق متميزة تليق بهم.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-silver-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-jet font-display text-center mb-8">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Award, title: 'الجودة أولاً', desc: 'نختار منتجاتنا بعناية فائقة لضمان أعلى معايير الجودة والمتانة' },
              { icon: Heart, title: 'ثقة العملاء', desc: 'رضا عملائنا هو مقياس نجاحنا، ونبني علاقات طويلة الأمد' },
              { icon: Users, title: 'خدمة متميزة', desc: 'فريق متخصص جاهز لمساعدتك في اختيار ما يناسب احتياجاتك' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-sm shadow-card p-6 text-center hover:shadow-card-hover transition-all">
                <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold-sm">
                  <v.icon className="w-7 h-7 text-jet" />
                </div>
                <h3 className="font-bold text-jet mb-2">{v.title}</h3>
                <p className="text-sm text-silver-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-card p-8">
          <h2 className="text-2xl font-bold text-jet font-display mb-6 flex items-center gap-2">
            <Store className="w-6 h-6 text-gold-500" />
            زورونا في المعرض
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-jet text-sm mb-1">العنوان</h3>
                  <p className="text-silver-600 text-sm">{STORE_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-jet text-sm mb-1">التوصيل</h3>
                  <p className="text-silver-600 text-sm">نوصل لجميع المحافظات</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-jet text-sm mb-1">ساعات العمل</h3>
                  <p className="text-silver-600 text-sm">{STORE_INFO.hours}</p>
                </div>
              </div>
            </div>
            <div className="bg-silver-50 rounded-sm p-6 flex items-center justify-center">
              <div className="text-center">
                <Store className="w-16 h-16 text-gold-400 mx-auto mb-3" />
                <p className="font-bold text-jet">معرض محمد جودة</p>
                <p className="text-sm text-silver-500 mt-1">{STORE_INFO.address}</p>
                <p className="text-sm text-gold-500 font-bold mt-2" dir="ltr">{STORE_INFO.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
