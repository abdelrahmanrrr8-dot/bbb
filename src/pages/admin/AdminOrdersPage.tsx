import { useEffect, useState } from 'react';
import { Eye, X, Phone, MapPin, Calendar, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order, OrderItem, OrderStatus, ORDER_STATUSES, formatPrice } from '../../lib/types';
import { AdminLayout } from './AdminLayout';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      if (viewOrder?.id === orderId) setViewOrder({ ...viewOrder, status });
    } catch (err) { console.error(err); } finally { setUpdating(false); }
  };

  const openOrderDetails = async (order: Order) => {
    setViewOrder(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    setOrderItems(data || []);
  };

  const statusStyles: Record<OrderStatus, string> = {
    'قيد التنفيذ': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'تم الشحن': 'bg-blue-50 text-blue-700 border-blue-200',
    'تم التوصيل': 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <AdminLayout activePage="orders">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jet">إدارة الطلبات</h1>
        <p className="text-silver-500 text-sm mt-1">{orders.length} طلب إجمالي</p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-sm font-medium text-sm whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-jet text-white' : 'bg-white text-silver-700 hover:bg-silver-100'}`}>الكل ({orders.length})</button>
        {ORDER_STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-sm font-medium text-sm whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-jet text-white' : 'bg-white text-silver-700 hover:bg-silver-100'}`}>{status} ({count})</button>
          );
        })}
      </div>

      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-silver-100 rounded-sm animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="text-silver-500 text-center py-12">لا توجد طلبات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-silver-50 text-sm text-silver-600">
                <tr>
                  <th className="p-4 font-medium">العميل</th>
                  <th className="p-4 font-medium">الهاتف</th>
                  <th className="p-4 font-medium">الإجمالي</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                  <th className="p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-t border-silver-50 hover:bg-silver-50 transition-colors">
                    <td className="p-4 font-medium text-jet text-sm">{order.customer_name}</td>
                    <td className="p-4 text-sm text-silver-600" dir="ltr">{order.customer_phone}</td>
                    <td className="p-4 text-sm font-semibold text-alert">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)} disabled={updating} className={`px-3 py-1.5 rounded-sm text-xs font-medium border cursor-pointer focus:outline-none ${statusStyles[order.status]}`}>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-silver-500 text-xs">{new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="p-4">
                      <button onClick={() => openOrderDetails(order)} className="p-2 rounded-sm bg-silver-50 text-silver-700 hover:bg-silver-100 transition-colors"><Eye className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewOrder(null)} />
          <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-zoom-in">
            <div className="flex items-center justify-between p-5 border-b border-silver-200 sticky top-0 bg-white">
              <h2 className="font-bold text-jet text-lg">تفاصيل الطلب</h2>
              <button onClick={() => setViewOrder(null)} className="p-2 rounded-sm hover:bg-silver-100"><X className="w-5 h-5 text-silver-600" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-silver-50 rounded-sm p-4 space-y-3">
                <div className="flex items-center gap-2 text-jet font-medium"><Package className="w-5 h-5 text-gold-500" />{viewOrder.customer_name}</div>
                <div className="flex items-center gap-2 text-sm text-silver-600"><Phone className="w-4 h-4 text-silver-400" /><span dir="ltr">{viewOrder.customer_phone}</span></div>
                <div className="flex items-start gap-2 text-sm text-silver-600"><MapPin className="w-4 h-4 text-silver-400 mt-0.5 flex-shrink-0" /><span>{viewOrder.customer_address}</span></div>
                <div className="flex items-center gap-2 text-sm text-silver-600"><Calendar className="w-4 h-4 text-silver-400" /><span>{new Date(viewOrder.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                {viewOrder.notes && <div className="text-sm text-silver-600 bg-white rounded-sm p-2"><span className="font-medium">ملاحظات: </span>{viewOrder.notes}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">حالة الطلب</label>
                <select value={viewOrder.status} onChange={(e) => updateStatus(viewOrder.id, e.target.value as OrderStatus)} disabled={updating} className={`input-field cursor-pointer ${statusStyles[viewOrder.status]}`}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <h3 className="font-bold text-jet mb-3">المنتجات</h3>
                <div className="space-y-2">
                  {orderItems.length === 0 ? <p className="text-silver-500 text-sm">لا توجد تفاصيل</p> : orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-silver-50 rounded-sm p-3 text-sm">
                      <div><p className="font-medium text-jet">{item.product_name}</p><p className="text-silver-500 text-xs">{item.quantity} × {formatPrice(item.price)}</p></div>
                      <span className="font-semibold text-jet">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-silver-200 pt-4 flex items-center justify-between">
                <span className="font-bold text-jet">الإجمالي</span>
                <span className="text-xl font-bold text-alert">{formatPrice(viewOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
