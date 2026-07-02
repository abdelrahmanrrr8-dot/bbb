import { ReactNode, useState } from 'react';
import { LayoutDashboard, Package, ClipboardList, LogOut, Menu, X, Store } from 'lucide-react';
import { useAdmin } from '../../lib/admin';
import { useRouter } from '../../lib/router';

interface AdminLayoutProps {
  children: ReactNode;
  activePage: 'dashboard' | 'products' | 'orders';
}

export function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const { logout } = useAdmin();
  const { navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { key: 'dashboard', label: 'لوحة الإحصائيات', icon: LayoutDashboard, path: '/admin/dashboard' },
    { key: 'products', label: 'إدارة المنتجات', icon: Package, path: '/admin/products' },
    { key: 'orders', label: 'إدارة الطلبات', icon: ClipboardList, path: '/admin/orders' },
  ] as const;

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-silver-100 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-jet text-silver-200 fixed h-screen">
        <div className="p-5 border-b border-jet-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm bg-gold-gradient flex items-center justify-center">
              <span className="text-xl font-bold text-jet font-display">م</span>
            </div>
            <div>
              <h2 className="font-bold text-sm font-display text-white">محمد جودة</h2>
              <p className="text-xs text-gold-400">لوحة التحكم</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button key={item.key} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-all ${
                activePage === item.key ? 'bg-gold-400 text-jet' : 'text-silver-200 hover:bg-jet-50'
              }`}>
              <item.icon className="w-5 h-5" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-jet-50 space-y-1">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-silver-200 hover:bg-jet-50 transition-colors">
            <Store className="w-5 h-5" />عرض المتجر
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-alert hover:bg-red-900/20 transition-colors">
            <LogOut className="w-5 h-5" />تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute top-0 right-0 w-64 h-full bg-jet text-silver-200 flex flex-col animate-slide-left">
            <div className="p-5 border-b border-jet-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-gold-gradient flex items-center justify-center">
                  <span className="text-lg font-bold text-jet font-display">م</span>
                </div>
                <h2 className="font-bold text-sm font-display text-white">لوحة التحكم</h2>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-sm hover:bg-jet-50"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {menuItems.map((item) => (
                <button key={item.key} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-medium transition-all ${
                    activePage === item.key ? 'bg-gold-400 text-jet' : 'text-silver-200 hover:bg-jet-50'
                  }`}>
                  <item.icon className="w-5 h-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-jet-50 space-y-1">
              <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-silver-200 hover:bg-jet-50"><Store className="w-5 h-5" />عرض المتجر</button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-alert hover:bg-red-900/20"><LogOut className="w-5 h-5" />تسجيل الخروج</button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:mr-64">
        <header className="md:hidden bg-white border-b border-silver-200 px-4 h-16 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-sm hover:bg-silver-100"><Menu className="w-6 h-6 text-jet" /></button>
          <h1 className="font-bold text-jet">{menuItems.find((m) => m.key === activePage)?.label}</h1>
          <div className="w-10" />
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
