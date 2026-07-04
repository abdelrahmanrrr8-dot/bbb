import { CartProvider } from './lib/cart';
import { AdminProvider, useAdmin } from './lib/admin';
import { useRouter } from './lib/router';
import { StoreHeader } from './components/StoreHeader';
import { StoreFooter } from './components/StoreFooter';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminSliderPage } from './pages/admin/AdminSliderPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

function AdminRoute({ page }: { page: 'dashboard' | 'products' | 'orders' | 'slider' }) {
  const { isAuthenticated } = useAdmin();
  const { navigate } = useRouter();

  if (!isAuthenticated) {
    setTimeout(() => navigate('/admin/login'), 0);
    return <AdminLoginPage />;
  }

  if (page === 'dashboard') return <AdminDashboardPage />;
  if (page === 'products') return <AdminProductsPage />;
  if (page === 'slider') return <AdminSliderPage />;
  return <AdminOrdersPage />;
}

function AppContent() {
  const { route, navigate } = useRouter();

  // Admin routes
  if (route.path === '/admin' || route.path === '/admin/login') return <AdminLoginPage />;
  if (route.path.startsWith('/admin/')) {
    const page = route.path.split('/')[2];
    if (page === 'dashboard') return <AdminRoute page="dashboard" />;
    if (page === 'products') return <AdminRoute page="products" />;
    if (page === 'slider') return <AdminRoute page="slider" />;
    if (page === 'orders') return <AdminRoute page="orders" />;
    return <AdminRoute page="dashboard" />;
  }

  // Storefront routes
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader onCartClick={() => navigate('/cart')} />
      <main className="flex-1">
        {route.path === '/' && <HomePage />}
        {route.path === '/shop' && <ShopPage />}
        {route.path === '/cart' && <CartPage />}
        {route.path === '/checkout' && <CheckoutPage />}
        {route.path === '/about' && <AboutPage />}
        {route.path === '/return-policy' && <ReturnPolicyPage />}
        {route.path.startsWith('/product/') && <ProductDetailPage id={route.path.split('/')[2]} />}
        {!['/', '/shop', '/cart', '/checkout', '/about', '/return-policy'].includes(route.path) && !route.path.startsWith('/product/') && (
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
