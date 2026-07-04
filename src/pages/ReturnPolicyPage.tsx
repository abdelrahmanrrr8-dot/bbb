import { RotateCcw, Check, X, Clock, Truck } from 'lucide-react';

export function ReturnPolicyPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-jet py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-sm bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
            <RotateCcw className="w-8 h-8 text-jet" />
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-2">سياسة الاسترجاع والاستبدال</h1>
          <p className="text-silver-300">نضمن لك تجربة تسوق آمنة ومريحة</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {/* General terms */}
        <div className="bg-white rounded-sm shadow-card p-8">
          <h2 className="text-xl font-bold text-jet font-display mb-4">الشروط العامة</h2>
          <div className="space-y-3">
            {[
              'يمكنك استرجاع أو استبدال المنتج خلال 14 يوماً من تاريخ الاستلام.',
              'يجب أن يكون المنتج بحالته الأصلية مع جميع الملحقات والتغليف الأصلي.',
              'لا يشمل الاسترجاع المنتجات المخفضة (عروض التصفية) إلا في حالة وجود عيب مصنعي.',
              'يجب إرفاق فاتورة الشراء الأصلية عند طلب الاسترجاع أو الاستبدال.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-silver-600 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable */}
        <div className="bg-white rounded-sm shadow-card p-8">
          <h2 className="text-xl font-bold text-jet font-display mb-4">منتجات لا يمكن استرجاعها</h2>
          <div className="space-y-3">
            {[
              'المنتجات المخصصة حسب طلب العميل (مفروشات بمقاسات خاصة).',
              'المنتجات المستخدمة أو التالفة بسبب سوء الاستخدام.',
              'أدوات المطبخ المستعملة (لأسباب صحية).',
              'المنتجات المخفضة في عروض التصفية النهائية.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <X className="w-5 h-5 text-alert mt-0.5 flex-shrink-0" />
                <p className="text-silver-600 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-sm shadow-card p-8">
          <h2 className="text-xl font-bold text-jet font-display mb-6">خطوات الاسترجاع</h2>
          <div className="space-y-4">
            {[
              { icon: Clock, title: 'تواصل معنا', desc: 'اتصل بنا خلال 14 يوماً من الاستلام وأخبرنا برغبتك في الاسترجاع' },
              { icon: RotateCcw, title: 'ترتيب الاستلام', desc: 'سنرسل مندوبنا لاستلام المنتج في الموعد المناسب لك' },
              { icon: Check, title: 'الفحص والموافقة', desc: 'يتم فحص المنتج للتأكد من حالته الأصلية والموافقة على الطلب' },
              { icon: Truck, title: 'الاستبدال أو الاسترجاع', desc: 'يتم استبدال المنتج أو استرجاع المبلغ حسب رغبتك' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold-sm">
                  <step.icon className="w-5 h-5 text-jet" />
                </div>
                <div>
                  <h3 className="font-bold text-jet text-sm mb-1">{i + 1}. {step.title}</h3>
                  <p className="text-silver-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="bg-gold-50 border border-gold-200 rounded-sm p-6">
          <p className="text-sm text-gold-700 leading-relaxed">
            <strong>ملاحظة:</strong> في حالة وجود عيب مصنعي، يتم الاستبدال أو الإصلاح مجاناً خلال فترة الضمان. لا تشمل رسوم الشحن رسوم الاسترجاع في حالة العيب المصنعي.
          </p>
        </div>
      </section>
    </div>
  );
}
