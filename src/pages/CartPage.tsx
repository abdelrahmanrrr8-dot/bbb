import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatPrice } from '../lib/types';
import { useRouter } from '../lib/router';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { navigate } = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-silver-200 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-silver-400" />
        </div>
        <h2 className="text-2xl font-bold text-jet mb-2">سلتك فارغة</h2>
        <p className="text-silver-500 mb-6">لم تقم بإضافة أي منتجات بعد</p>
        <button onClick={() => navigate('/shop')} className="btn-gold">
          تصفح المنتجات
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-jet font-display">سلة المشتريات</h1>
        <button onClick={() => navigate('/shop')} className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-gold-500 transition-colors">
          <ArrowRight className="w-4 h-4" />
          متابعة التسوق
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-sm shadow-card p-4 flex gap-4 animate-slide-left">
              <img
                src={item.product.image_url || ''}
                alt={item.product.name}
                className="w-24 h-24 rounded-sm object-cover bg-silver-100 flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${item.product.id}`)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-jet cursor-pointer hover:text-gold-500 transition-colors"
                        onClick={() => navigate(`/product/${item.product.id}`)}>
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-silver-500 mt-0.5">{item.product.brand}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-alert hover:bg-red-50 rounded-sm transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-silver-300 rounded-sm">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-silver-100 transition-colors">
                      <Minus className="w-3.5 h-3.5 text-jet" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-jet">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-silver-100 transition-colors">
                      <Plus className="w-3.5 h-3.5 text-jet" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-silver-500">{formatPrice(item.product.price)} للقطعة</p>
                    <p className="text-lg font-bold text-alert">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-silver-500 hover:text-alert transition-colors flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" />
            تفريغ السلة
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-sm shadow-card p-5 sticky top-44">
            <h2 className="font-bold text-jet mb-4">ملخص الطلب</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-silver-600">
                <span>عدد المنتجات</span>
                <span>{totalItems} قطعة</span>
              </div>
              <div className="flex justify-between text-silver-600">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-silver-600">
                <span>الشحن</span>
                <span className="text-green-600 font-medium">يحدد لاحقاً</span>
              </div>
            </div>
            <div className="border-t border-silver-200 mt-4 pt-4 flex items-center justify-between">
              <span className="font-bold text-jet">الإجمالي</span>
              <span className="text-2xl font-bold text-alert">{formatPrice(totalPrice)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-gold w-full mt-4">
              إتمام الطلب
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/shop')} className="btn-black w-full mt-2">
              متابعة التسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
