import { useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useSliderStore, Slide } from '../../lib/sliderStore';
import { AdminLayout } from './AdminLayout';

export function AdminSliderPage() {
  const { slides, addSlide, updateSlide, deleteSlide } = useSliderStore();
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Slide | null>(null);
  const [error, setError] = useState('');

  const blankForm = { title: '', subtitle: '', image: '', cta: 'تسوق الآن', link: '/shop' };
  const [form, setForm] = useState(blankForm);

  const openAddModal = () => {
    setEditingSlide(null);
    setForm(blankForm);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (s: Slide) => {
    setEditingSlide(s);
    setForm({ title: s.title, subtitle: s.subtitle, image: s.image, cta: s.cta, link: s.link });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) { setError('يرجى إدخال العنوان ورابط الصورة'); return; }
    try {
      if (editingSlide) {
        updateSlide(editingSlide.id, form);
      } else {
        addSlide(form);
      }
      setShowModal(false);
    } catch (err) {
      setError('حدث خطأ أثناء الحفظ.');
      console.error(err);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSlide(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <AdminLayout activePage="slider">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-jet">إدارة السلايدر</h1>
          <p className="text-silver-500 text-sm mt-1">{slides.length} شرائح في الصفحة الرئيسية</p>
        </div>
        <button onClick={openAddModal} className="btn-gold"><Plus className="w-5 h-5" />إضافة شريحة</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-sm shadow-card overflow-hidden">
            <div className="relative h-40 bg-silver-100">
              {slide.image ? <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-12 h-12 text-silver-400" /></div>}
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-center pr-4">
                <div className="text-right">
                  <h3 className="font-bold text-white text-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{slide.title}</h3>
                  <p className="text-silver-200 text-xs mt-1">{slide.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-silver-500">
                <span className="font-medium text-jet">{slide.cta}</span>
                <span className="mx-2">←</span>
                <span dir="ltr">{slide.link}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(slide)} className="p-2 rounded-sm bg-silver-50 text-silver-700 hover:bg-silver-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(slide)} className="p-2 rounded-sm bg-red-50 text-alert hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-zoom-in">
            <div className="flex items-center justify-between p-5 border-b border-silver-200 sticky top-0 bg-white">
              <h2 className="font-bold text-jet text-lg">{editingSlide ? 'تعديل شريحة' : 'إضافة شريحة جديدة'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-sm hover:bg-silver-100"><X className="w-5 h-5 text-silver-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">العنوان *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="مثال: مفروشات تحول حلمك إلى حقيقة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">العنوان الفرعي</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-field" placeholder="وصف مختصر للشريحة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-silver-700 mb-1.5">رابط الصورة *</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" dir="ltr" placeholder="https://..." />
                {form.image && <img src={form.image} alt="معاينة" className="w-full h-32 rounded-sm object-cover mt-2 bg-silver-100" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">نص الزر</label>
                  <input type="text" value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} className="input-field" placeholder="تسوق الآن" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-silver-700 mb-1.5">رابط الزر</label>
                  <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" dir="ltr" placeholder="/shop?category=مفروشات" />
                </div>
              </div>
              {error && <p className="text-alert text-sm bg-red-50 p-3 rounded-sm flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1">{editingSlide ? 'حفظ التعديلات' : 'إضافة الشريحة'}</button>
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
            <p className="text-silver-600 text-sm mb-6">هل أنت متأكد من حذف هذه الشريحة؟</p>
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
