import { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../lib/cart';
import { formatPrice } from '../lib/types';
import { useRouter } from '../lib/router';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { navigate } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-jet mb-2">سلتك فارغة</h2>
        <p className="text-silver-500 mb-6">أضف منتجات قبل إتمام الطلب</p>
        <button onClick={() => navigate('/shop')} className="btn-gold">تصفح المنتجات</button>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    else if (!/^01[0-9]{9}$/.test(form.phone.trim())) e.phone = 'رقم هاتف غير صحيح';
    if (!form.address.trim()) e.address = 'العنوان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name, customer_phone: form.phone,
          customer_address: form.address, total: totalPrice,
          notes: form.notes || null, status: 'قيد التنفيذ',
        })
        .select().single();
      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id, product_id: item.product.id,
        product_name: item.product.name, price: item.product.price, quantity: item.quantity,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrors({ submit: 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-jet mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-silver-600 mb-6">سنتواصل معك قريباً لتأكيد الطلب وتفاصيل التوصيل. شكراً لثقتك في معرض محمد جودة.</p>
        <button onClick={() => navigate('/')} className="btn-gold">العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-jet font-display mb-6">إتمام الطلب</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-card p-6 space-y-4">
            <h2 className="font-bold text-jet mb-2">بيانات التوصيل</h2>
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">الاسم الكامل *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="أدخل اسمك" />
              {errors.name && <p className="text-alert text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">رقم الهاتف *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="01xxxxxxxxx" dir="ltr" />
              {errors.phone && <p className="text-alert text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">عنوان التوصيل *</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field min-h-[80px]" placeholder="المدينة، الحي، الشارع، رقم المبنى" />
              {errors.address && <p className="text-alert text-sm mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-700 mb-1.5">ملاحظات (اختياري)</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field min-h-[60px]" placeholder="أي ملاحظات إضافية" />
            </div>
            {errors.submit && <p className="text-alert text-sm bg-red-50 p-3 rounded-sm">{errors.submit}</p>}
            <button type="submit" disabled={submitting} className="btn-gold w-full">
              {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-sm shadow-card p-5 sticky top-44">
            <h2 className="font-bold text-jet mb-4">ملخص الطلب</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-sm">
                  <img src={item.product.image_url || ''} alt={item.product.name} className="w-14 h-14 rounded-sm object-cover bg-silver-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-jet truncate">{item.product.name}</p>
                    <p className="text-silver-500 text-xs">{item.quantity} × {formatPrice(item.product.price)}</p>
                  </div>
                  <span className="font-semibold text-jet text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-silver-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-silver-600"><span>المجموع</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between text-sm text-silver-600"><span>التوصيل</span><span className="text-green-600 font-medium">يحدد لاحقاً</span></div>
              <div className="flex justify-between font-bold text-lg text-jet pt-2 border-t border-silver-200">
                <span>الإجمالي</span><span className="text-alert">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/shop')} className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-gold-500 mt-4 transition-colors">
              <ArrowRight className="w-4 h-4" /> متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
