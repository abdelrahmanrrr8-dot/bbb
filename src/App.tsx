import { CartProvider } from './lib/cart';
import { AdminProvider, useAdmin } from './lib/admin';
import { useRouter } from './lib/router';
import { StoreHeader } from './components/StoreHeader';
import { StoreFooter } from './components/StoreFooter';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

function AdminRoute({ page }: { page: 'dashboard' | 'products' | 'orders' }) {
  const { isAuthenticated } = useAdmin();
  const { navigate } = useRouter();

  if (!isAuthenticated) {
    setTimeout(() => navigate('/control-panel'), 0);
    return <AdminLoginPage />;
  }

  if (page === 'dashboard') return <AdminDashboardPage />;
  if (page === 'products') return <AdminProductsPage />;
  return <AdminOrdersPage />;
}

function AppContent() {
  const { route, navigate } = useRouter();

  // Admin routes
  if (route.path === '/control-panel') return <AdminLoginPage />;
  if (route.path.startsWith('/control-panel/')) {
    const page = route.path.split('/')[2];
    if (page === 'dashboard') return <AdminRoute page="dashboard" />;
    if (page === 'products') return <AdminRoute page="products" />;
    if (page === 'orders') return <AdminRoute page="orders" />;
    return <AdminRoute page="dashboard" />;
  }

  // Storefront routes
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader onCartClick={() => navigate('/checkout')} />
      <main className="flex-1">
        {route.path === '/' && <HomePage />}
        {route.path === '/products' && <ProductsPage />}
        {route.path.startsWith('/product/') && <ProductDetailPage id={route.path.split('/')[2]} />}
        {route.path === '/checkout' && <CheckoutPage />}
        {!['/', '/products', '/checkout'].includes(route.path) && !route.path.startsWith('/product/') && (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold text-jet mb-2">404</h2>
            <p className="text-silver-500 mb-6">الصفحة غير موجودة</p>
            <button onClick={() => navigate('/')} className="btn-gold">العودة للرئيسية</button>
          </div>
        )}
      </main>
      <StoreFooter />
      <CartDrawer onCheckout={() => navigate('/checkout')} />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminProvider>
  );
}
