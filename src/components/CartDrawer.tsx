import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatPrice } from '../lib/types';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-metallic z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="gold-header-bg flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-jet" />
            <h2 className="text-lg font-bold text-jet font-display">
              سلة المشتريات
              {totalItems > 0 && (
                <span className="mr-2 text-sm font-normal text-jet/70">({totalItems})</span>
              )}
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-sm hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 text-jet" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-silver-200 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-silver-400" />
              </div>
              <p className="text-silver-600 font-medium">سلتك فارغة</p>
              <p className="text-sm text-silver-400">أضف منتجات لبدء التسوق</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 bg-white rounded-sm p-3 shadow-card animate-slide-left">
                  <img
                    src={item.product.image_url || ''}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-sm object-cover bg-silver-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-jet truncate">{item.product.name}</h3>
                    <p className="text-alert font-bold text-sm mt-0.5">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-sm bg-silver-100 flex items-center justify-center hover:bg-silver-200 transition-colors">
                        <Minus className="w-3 h-3 text-jet" />
                      </button>
                      <span className="font-bold text-jet w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-sm bg-silver-100 flex items-center justify-center hover:bg-silver-200 transition-colors">
                        <Plus className="w-3 h-3 text-jet" />
                      </button>
                      <button onClick={() => removeFromCart(item.product.id)} className="mr-auto p-1 text-alert hover:bg-alert/10 rounded-sm transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white border-t-2 border-gold-400 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-silver-600 font-medium">الإجمالي</span>
              <span className="text-2xl font-bold text-alert">{formatPrice(totalPrice)}</span>
            </div>
            <button onClick={() => { setIsOpen(false); onCheckout(); }} className="btn-gold w-full">
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </>
  );
}
