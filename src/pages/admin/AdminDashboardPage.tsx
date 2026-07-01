import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Package, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice, Order } from '../../lib/types';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status'),
      supabase.from('products').select('id', { count: 'exact', head: true }),
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data || [];
      setStats({
        totalSales: orders.reduce((sum, o) => sum + Number(o.total), 0),
        totalOrders: orders.length,
        totalProducts: productsRes.count || 0,
        pendingOrders: orders.filter((o) => o.status === 'قيد التنفيذ').length,
      });
      setLoading(false);
    });
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentOrders(data || []));
  }, []);

  const statCards = [
    { label: 'إجمالي المبيعات', value: formatPrice(stats.totalSales), icon: TrendingUp, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'عدد الطلبات', value: stats.totalOrders.toString(), icon: ShoppingBag, bg: 'bg-red-50', text: 'text-alert' },
    { label: 'عدد المنتجات', value: stats.totalProducts.toString(), icon: Package, bg: 'bg-gold-50', text: 'text-gold-600' },
    { label: 'طلبات قيد التنفيذ', value: stats.pendingOrders.toString(), icon: Clock, bg: 'bg-silver-100', text: 'text-silver-700' },
  ];

  return (
    <AdminLayout activePage="dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jet">لوحة الإحصائيات</h1>
        <p className="text-silver-500 text-sm mt-1">نظرة عامة على أداء المتجر</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-sm shadow-card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`w-12 h-12 rounded-sm ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-6 h-6 ${card.text}`} />
            </div>
            <p className="text-sm text-silver-500 mb-1">{card.label}</p>
            {loading ? <div className="h-7 bg-silver-100 rounded animate-pulse" /> : <p className="text-xl font-bold text-jet">{card.value}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-jet">أحدث الطلبات</h2>
          <button onClick={() => navigate('/control-panel/orders')} className="inline-flex items-center gap-1 text-sm text-gold-500 hover:gap-2 transition-all">
            عرض الكل<ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-silver-500 text-center py-8">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-silver-100 text-sm text-silver-500">
                  <th className="pb-3 font-medium">العميل</th>
                  <th className="pb-3 font-medium">الهاتف</th>
                  <th className="pb-3 font-medium">الإجمالي</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-silver-50 text-sm">
                    <td className="py-3 font-medium text-jet">{order.customer_name}</td>
                    <td className="py-3 text-silver-600" dir="ltr">{order.customer_phone}</td>
                    <td className="py-3 font-semibold text-alert">{formatPrice(order.total)}</td>
                    <td className="py-3"><StatusBadge status={order.status} /></td>
                    <td className="py-3 text-silver-500 text-xs">{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'قيد التنفيذ': 'bg-yellow-50 text-yellow-700',
    'تم الشحن': 'bg-blue-50 text-blue-700',
    'تم التوصيل': 'bg-green-50 text-green-700',
  };
  return <span className={`px-3 py-1 rounded-sm text-xs font-medium ${styles[status] || ''}`}>{status}</span>;
}
