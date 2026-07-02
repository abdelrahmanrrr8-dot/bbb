import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, ShoppingBag, Package, AlertTriangle, ArrowLeft, BarChart3, PieChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice, Order, CATEGORIES } from '../../lib/types';
import { useRouter } from '../../lib/router';
import { AdminLayout } from './AdminLayout';

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, outOfStock: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<{ month: string; sales: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; count: number; color: string }[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status, created_at'),
      supabase.from('products').select('id, category, stock'),
    ]).then(([ordersRes, productsRes]) => {
      const orders = ordersRes.data || [];
      const products = productsRes.data || [];

      setStats({
        totalSales: orders.reduce((sum, o) => sum + Number(o.total), 0),
        totalOrders: orders.length,
        totalProducts: products.length,
        outOfStock: products.filter((p) => p.stock === 0).length,
      });

      // Monthly sales chart (last 6 months)
      const now = new Date();
      const months: { month: string; sales: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('ar-EG', { month: 'short' });
        const monthSales = orders
          .filter((o) => {
            const od = new Date(o.created_at);
            return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
          })
          .reduce((sum, o) => sum + Number(o.total), 0);
        months.push({ month: monthName, sales: monthSales });
      }
      setMonthlyData(months);

      // Category distribution
      const colors = ['#D4AF37', '#C0C0C0', '#FF0000'];
      const catData = CATEGORIES.map((cat, i) => ({
        name: cat.key,
        count: products.filter((p) => p.category === cat.key).length,
        color: colors[i],
      }));
      setCategoryData(catData);

      setLoading(false);
    });

    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      .then(({ data }) => setRecentOrders(data || []));
  }, []);

  const maxSales = useMemo(() => Math.max(...monthlyData.map((d) => d.sales), 1), [monthlyData]);
  const totalCatCount = useMemo(() => categoryData.reduce((sum, c) => sum + c.count, 0) || 1, [categoryData]);

  const statCards = [
    { label: 'إجمالي المبيعات', value: formatPrice(stats.totalSales), icon: TrendingUp, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'عدد الطلبات', value: stats.totalOrders.toString(), icon: ShoppingBag, bg: 'bg-red-50', text: 'text-alert' },
    { label: 'عدد المنتجات', value: stats.totalProducts.toString(), icon: Package, bg: 'bg-gold-50', text: 'text-gold-600' },
    { label: 'نفذت الكمية', value: stats.outOfStock.toString(), icon: AlertTriangle, bg: 'bg-silver-100', text: 'text-silver-700' },
  ];

  return (
    <AdminLayout activePage="dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jet">لوحة الإحصائيات</h1>
        <p className="text-silver-500 text-sm mt-1">نظرة عامة على أداء المتجر</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-sm shadow-card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-sm ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
            </div>
            <p className="text-sm text-silver-500 mb-1">{card.label}</p>
            {loading ? <div className="h-7 bg-silver-100 rounded animate-pulse" /> : <p className="text-xl font-bold text-jet">{card.value}</p>}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Monthly sales bar chart */}
        <div className="lg:col-span-2 bg-white rounded-sm shadow-card p-5">
          <h2 className="font-bold text-jet mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-500" />
            أداء المبيعات الشهري
          </h2>
          <div className="flex items-end justify-between gap-2 h-48 pt-4">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-gold-600 to-gold-400 transition-all duration-500 hover:from-gold-500 hover:to-gold-300 relative group"
                    style={{ height: `${(data.sales / maxSales) * 100}%`, minHeight: data.sales > 0 ? '8px' : '2px' }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-jet opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.sales > 0 ? new Intl.NumberFormat('en-US').format(data.sales) : ''}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-silver-500 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category pie chart */}
        <div className="bg-white rounded-sm shadow-card p-5">
          <h2 className="font-bold text-jet mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gold-500" />
            توزيع الأقسام
          </h2>
          <div className="flex flex-col items-center gap-4">
            {/* SVG Donut chart */}
            <svg viewBox="0 0 200 200" className="w-40 h-40">
              {(() => {
                let offset = 0;
                return categoryData.map((cat, i) => {
                  const pct = cat.count / totalCatCount;
                  const dash = pct * 502;
                  const circle = (
                    <circle
                      key={i}
                      cx="100" cy="100" r="80" fill="none"
                      stroke={cat.color} strokeWidth="30"
                      strokeDasharray={`${dash} 502`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-500"
                    />
                  );
                  offset += dash;
                  return circle;
                });
              })()}
              <text x="100" y="95" textAnchor="middle" className="fill-jet text-2xl font-bold">{totalCatCount}</text>
              <text x="100" y="115" textAnchor="middle" className="fill-silver-500 text-xs">منتج</text>
            </svg>
            {/* Legend */}
            <div className="w-full space-y-2">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ background: cat.color }} />
                    <span className="text-silver-700">{cat.name}</span>
                  </div>
                  <span className="font-bold text-jet">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-sm shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-jet">أحدث الطلبات</h2>
          <button onClick={() => navigate('/admin/orders')} className="inline-flex items-center gap-1 text-sm text-gold-500 hover:gap-2 transition-all">
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
