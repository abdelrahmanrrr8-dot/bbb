import { useEffect, useState, useCallback } from 'react';
import { Product } from './types';

const STORAGE_KEY = 'mj_products';

const DEFAULT_PRODUCTS: Product[] = [
  // مفروشات
  { id: 'p1', name: 'طقم كنب مودرن 3+2+1', description: 'طقم كنب مودرن فاخر بتصميم عصري وأقمشة عالية الجودة، يتكون من 3+2+1 قطع', price: 4500, old_price: 5500, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600', stock: 8, featured: true, best_seller: true, brand: 'جودة هوم', created_at: '2026-06-20T10:00:00Z', updated_at: '2026-06-20T10:00:00Z' },
  { id: 'p2', name: 'سرير كينج خشب زان', description: 'سرير كينج فاخر من خشب الزان الطبيعي بتصميم أنيق ومتين', price: 3200, old_price: 3800, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600', stock: 6, featured: false, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-21T10:00:00Z', updated_at: '2026-06-21T10:00:00Z' },
  { id: 'p3', name: 'سجادة فارسية 3x4', description: 'سجادة فارسية بتصميم كلاسيكي وألوان دافئة، مقاس 3x4 متر', price: 1800, old_price: null, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600', stock: 12, featured: false, best_seller: true, brand: 'جودة هوم', created_at: '2026-06-22T10:00:00Z', updated_at: '2026-06-22T10:00:00Z' },
  { id: 'p4', name: 'ستائر قطيفة ثقيلة', description: 'ستائر قطيفة فاخرة بوزن ثقيل، عازلة للضوء بتصميم راقٍ', price: 650, old_price: null, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600', stock: 20, featured: false, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-23T10:00:00Z', updated_at: '2026-06-23T10:00:00Z' },
  { id: 'p5', name: 'وسائد زينة مشغولة', description: 'طقم وسائد زينة مشغولة يدوياً بتصاميم شرقية أنيقة', price: 250, old_price: null, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600', stock: 30, featured: false, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-24T10:00:00Z', updated_at: '2026-06-24T10:00:00Z' },
  { id: 'p6', name: 'كرسي مكتب جلد طبيعي', description: 'كرسي مكتب تنفيذي بجلد طبيعي وقاعدة معدنية، دعم ظهر قابل للتعديل', price: 1850, old_price: 2200, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600', stock: 10, featured: true, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-25T10:00:00Z', updated_at: '2026-06-25T10:00:00Z' },
  { id: 'p7', name: 'طاولة طعام رخام 6 أشخاص', description: 'طاولة طعام بسطح رخامي وقاعدة معدنية ذهبية، تتسع لـ 6 أشخاص', price: 4200, old_price: null, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600', stock: 4, featured: false, best_seller: true, brand: 'جودة هوم', created_at: '2026-06-26T10:00:00Z', updated_at: '2026-06-26T10:00:00Z' },
  { id: 'p8', name: 'مرتبة سرير طبية 30 سم', description: 'مرتبة سرير طبية بارتفاع 30 سم، مريحة وتدعم العمود الفقري', price: 2800, old_price: 3200, category: 'مفروشات', image_url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600', stock: 8, featured: false, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-27T10:00:00Z', updated_at: '2026-06-27T10:00:00Z' },

  // أدوات منزلية
  { id: 'p9', name: 'طقم أواني طبخ 10 قطع', description: 'طقم أواني طبخ من الستانلس ستيل عالي الجودة، 10 قطع بأحجام متنوعة', price: 850, old_price: 1100, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600', stock: 15, featured: true, best_seller: true, brand: 'كيتشن ماستر', created_at: '2026-06-20T11:00:00Z', updated_at: '2026-06-20T11:00:00Z' },
  { id: 'p10', name: 'طقم عشاء سيراميك 12 شخص', description: 'طقم عشاء من السيراميك الفاخر يكفي 12 شخصاً بتصميم أنيق', price: 620, old_price: null, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600', stock: 18, featured: false, best_seller: true, brand: 'جودة هوم', created_at: '2026-06-21T11:00:00Z', updated_at: '2026-06-21T11:00:00Z' },
  { id: 'p11', name: 'مجموعة سكاكين 7 قطع', description: 'مجموعة سكاكين احترافية 7 قطع من الستانلس ستيل مع حامل خشبي', price: 340, old_price: null, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600', stock: 25, featured: false, best_seller: false, brand: 'كيتشن ماستر', created_at: '2026-06-22T11:00:00Z', updated_at: '2026-06-22T11:00:00Z' },
  { id: 'p12', name: 'براد زجاجي 3 طبقات', description: 'براد زجاجي بـ 3 طبقات لحفظ وتقديم المشروبات والضيافة', price: 180, old_price: null, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600', stock: 22, featured: false, best_seller: false, brand: 'كيتشن ماستر', created_at: '2026-06-23T11:00:00Z', updated_at: '2026-06-23T11:00:00Z' },
  { id: 'p13', name: 'طقم أكواب شاي زجاجي', description: 'طقم أكواب شاي زجاجي أنيق مع صينية تقديم، 6 قطع', price: 150, old_price: null, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600', stock: 28, featured: false, best_seller: false, brand: 'كيتشن ماستر', created_at: '2026-06-24T11:00:00Z', updated_at: '2026-06-24T11:00:00Z' },
  { id: 'p14', name: 'طقم قلاية تيفال 5 قطع', description: 'طقم قلاية تيفال مانع للالتصاق، 5 قطع بأحجام مختلفة', price: 720, old_price: 900, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600', stock: 15, featured: true, best_seller: false, brand: 'كيتشن ماستر', created_at: '2026-06-25T11:00:00Z', updated_at: '2026-06-25T11:00:00Z' },
  { id: 'p15', name: 'حامل أدوات مطبخ معدني', description: 'حامل أدوات مطبخ من الستانلس ستيل مع 6 علب تخزين', price: 340, old_price: null, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600', stock: 20, featured: false, best_seller: true, brand: 'كيتشن ماستر', created_at: '2026-06-26T11:00:00Z', updated_at: '2026-06-26T11:00:00Z' },
  { id: 'p16', name: 'طقم أكواب كريستال 6 قطع', description: 'طقم 6 أكواب كريستال فاخرة بتذهيب ذهبي', price: 280, old_price: 380, category: 'أدوات منزلية', image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600', stock: 18, featured: false, best_seller: false, brand: 'جودة هوم', created_at: '2026-06-27T11:00:00Z', updated_at: '2026-06-27T11:00:00Z' },

  // أجهزة كهربائية
  { id: 'p17', name: 'ثلاجة 18 قدم', description: 'ثلاجة 18 قدم بتقنية التبريد الذكي وتوفير الطاقة، بتصميم فضي أنيق', price: 5200, old_price: 6000, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=600', stock: 5, featured: true, best_seller: true, brand: 'تكنو بريميوم', created_at: '2026-06-20T12:00:00Z', updated_at: '2026-06-20T12:00:00Z' },
  { id: 'p18', name: 'غسالة ملابس 8 كجم', description: 'غسالة ملابس أوتوماتيك بسعة 8 كجم ببرامج متعددة وتوفير الطاقة', price: 3100, old_price: 3600, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=600', stock: 7, featured: false, best_seller: true, brand: 'تكنو بريميوم', created_at: '2026-06-21T12:00:00Z', updated_at: '2026-06-21T12:00:00Z' },
  { id: 'p19', name: 'مكيف سبليت 1.5 حصان', description: 'مكيف سبليت 1.5 حصان بارد ساخن، موفر للطاقة بهواء نقي', price: 2600, old_price: 2800, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=600', stock: 6, featured: true, best_seller: true, brand: 'تكنو بريميوم', created_at: '2026-06-22T12:00:00Z', updated_at: '2026-06-22T12:00:00Z' },
  { id: 'p20', name: 'ميكروويف 30 لتر', description: 'ميكروويف 30 لتر بتصميم معدني أنيق ووظائف متعددة للطهي', price: 780, old_price: null, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=600', stock: 10, featured: false, best_seller: false, brand: 'تكنو بريميوم', created_at: '2026-06-23T12:00:00Z', updated_at: '2026-06-23T12:00:00Z' },
  { id: 'p21', name: 'خلاط كهربائي 3 سرعات', description: 'خلاط كهربائي قوي بـ 3 سرعات ووعاء زجاجي مقاوم للحرارة', price: 240, old_price: null, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=600', stock: 14, featured: false, best_seller: false, brand: 'تكنو بريميوم', created_at: '2026-06-24T12:00:00Z', updated_at: '2026-06-24T12:00:00Z' },
  { id: 'p22', name: 'تكييف شارب 1.5 حصان', description: 'تكييف شارب سبليت 1.5 حصان بارد ساخن، موفر للطاقة', price: 2600, old_price: 3000, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=600', stock: 5, featured: true, best_seller: true, brand: 'تكنو بريميوم', created_at: '2026-06-25T12:00:00Z', updated_at: '2026-06-25T12:00:00Z' },
  { id: 'p23', name: 'خبازة كهربائية 40 لتر', description: 'خبازة كهربائية 40 لتر مع شواية ومروحة توزيع حرارة', price: 950, old_price: 1200, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=600', stock: 10, featured: false, best_seller: false, brand: 'تكنو بريميوم', created_at: '2026-06-26T12:00:00Z', updated_at: '2026-06-26T12:00:00Z' },
  { id: 'p24', name: 'مكنسة كهربائية 2000 وات', description: 'مكنسة كهربائية قوية 2000 وات مع فلتر HEPA متعدد المراحل', price: 680, old_price: null, category: 'أجهزة كهربائية', image_url: 'https://images.unsplash.com/photo-1571175432267-ef0260be68d5?q=80&w=600', stock: 12, featured: false, best_seller: true, brand: 'تكنو بريميوم', created_at: '2026-06-27T12:00:00Z', updated_at: '2026-06-27T12:00:00Z' },
];

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('mj-products-changed'));
}

export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  useEffect(() => {
    const handler = () => setProducts(loadProducts());
    window.addEventListener('mj-products-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('mj-products-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const addProduct = useCallback((data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...data,
      id: 'p' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    saveProducts(updated);
    setProducts(updated);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
    );
    saveProducts(updated);
    setProducts(updated);
  }, [products]);

  const deleteProduct = useCallback((id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
  }, [products]);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id) || null, [products]);

  return { products, addProduct, updateProduct, deleteProduct, getProduct };
}
