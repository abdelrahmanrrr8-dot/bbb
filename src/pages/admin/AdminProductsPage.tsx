import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, AlertCircle } from 'lucide-react';
import { useProductStore } from '../../lib/productStore';
import { Product, CATEGORIES, Category, formatPrice } from '../../lib/types';
import { AdminLayout } from './AdminLayout';

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const blankForm = {
    name: '', description: '', price: '', old_price: '', brand: '',
    category: 'مفروشات' as Category, image_url: '',
    stock: '', featured: false, best_seller: false,
  };
  const [form, setForm] = useState(blankForm);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(blankForm);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price.toString(),
      old_price: p.old_price?.toString() || '', brand: p.brand || '', category: p.category,
      image_url: p.image_url || '', stock: p.stock.toString(),
      featured: p.featured, best_seller: p.best_seller,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.stock) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      brand: form.brand.trim() || null,
      category: form.category,
      image_url: form.image_url.trim() || null,
      stock: parseInt(form.stock),
      featured: form.featured,
      best_seller: form.best_seller,
    };

    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, payload);
      } else {
        addProduct(payload);
      }
      setShowModal(false);
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout activePage="products">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-jet">إدارة المنتجات</h1>
          <p className="text-silver-500 text-sm mt-1">{products.length} منتج في المتجر</p>
        </div>
        <button onClick={openAddModal} className="btn-gold"><Plus className="w-5 h-5" />إضافة منتج</button>
      </div>

      <div className="bg-white rounded-sm shadow-card p-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن منتج..." className="input-field pr-11" />
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-silver-500 text-center py-12">لا توجد منتجات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-silver-50 text-sm text-silver-600">
                <tr>
                  <th className="p-4 font-medium">المنتج</th>
                  <th className="p-4 font-medium">القسم</th>
                  <th className="p-4 font-medium">السعر</th>
                  <th className="p-4 font-medium">المخزون</th>
                  <th className="p-4 font-medium">مميز</th>
                  <th className="p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-silver-100 hover:bg-silver-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url || ''} alt={p.name} className="w-12 h-12 rounded-sm object-cover bg-silver-100 flex-shrink-0" />
                        <span className="font-medium text-jet text-sm">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-silver-600">{p.category}</td>
                    <td className="p-4 text-sm font-semibold text-alert">{formatPrice(p.price)}</td>
                    <td className="p-4 text-sm text-silver-600">{p.stock}</td>
                    <td className="p-4">{p.featured ? <span className="px-2 py-1 rounded-sm bg-gold-50 text-gold-600 text-xs font-medium">نعم</span> : <span className="text-silver-400 text-xs">لا</span>}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 rounded-sm bg-silver-50 text-silver-700 hover:bg-silver-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-sm bg-red-50 text-alert hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-zoom-in">
            <div className="flex items-center justify-between p-5 border-b border-silver-200 sticky top-0 bg-white">
              <h2 className="font-bold text-jet text-lg">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-sm hover:bg-silver-100"><X className="w-5 h-5 text-silver-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">اسم المنتج *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">السعر (L.E) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">السعر القديم (للعروض)</label>
                  <input type="number" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} className="input-field" min="0" step="0.01" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">المخزون *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">القسم *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="input-field">
                    {CATEGORIES.map((cat) => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">العلامة التجارية</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" placeholder="مثال: جودة هوم" />
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">رابط الصورة</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" dir="ltr" />
                {form.image_url && <img src={form.image_url} alt="معاينة" className="w-24 h-24 rounded-sm object-cover mt-2 bg-silver-100" />}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm font-medium text-silver-700">منتج مميز</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.best_seller} onChange={(e) => setForm({ ...form, best_seller: e.target.checked })} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm font-medium text-silver-700">الأكثر مبيعاً</span>
                </label>
              </div>
              {error && <p className="text-alert text-sm bg-red-50 p-3 rounded-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold flex-1">{saving ? 'جاري الحفظ...' : editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-black">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-sm p-6 text-center animate-zoom-in">
            <AlertCircle className="w-12 h-12 text-alert mx-auto mb-3" />
            <h3 className="font-bold text-jet text-lg mb-2">تأكيد الحذف</h3>
            <p className="text-silver-600 text-sm mb-6">هل أنت متأكد من حذف "{deleteTarget.name}"؟</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-sm bg-alert text-white font-bold hover:bg-red-600 transition-colors">نعم، احذف</button>
              <button onClick={() => setDeleteTarget(null)} className="btn-black flex-1">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
