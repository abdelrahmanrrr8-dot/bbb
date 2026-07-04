import { useEffect, useState, useCallback } from 'react';

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

const STORAGE_KEY = 'mj_slides';

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 's1',
    title: 'مفروشات تحول حلمك إلى حقيقة',
    subtitle: 'تشكيلة فاخرة من الأرائك والسرر والسجاد بأرقى التصاميم',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    cta: 'تسوق الآن',
    link: '/shop?category=مفروشات',
  },
  {
    id: 's2',
    title: 'أدوات منزلية بأناقة لا مثيل لها',
    subtitle: 'أواني طبخ وأطقم عشاء بجودة عالية وتصاميم عصرية',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
    cta: 'اكتشف المجموعة',
    link: '/shop?category=أدوات منزلية',
  },
  {
    id: 's3',
    title: 'أجهزة كهربائية بأحدث التقنيات',
    subtitle: 'ثلاجات وغسالات ومكيفات من أفضل العلامات التجارية',
    image: 'https://images.unsplash.com/photo-1719937226655-6a429b717f6b?auto=format&fit=crop&q=80&w=1200',
    cta: 'تصفح الأجهزة',
    link: '/shop?category=أجهزة كهربائية',
  },
];

function loadSlides(): Slide[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SLIDES));
  return DEFAULT_SLIDES;
}

function saveSlides(slides: Slide[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  window.dispatchEvent(new CustomEvent('mj-slides-changed'));
}

export function useSliderStore() {
  const [slides, setSlides] = useState<Slide[]>(loadSlides);

  useEffect(() => {
    const handler = () => setSlides(loadSlides());
    window.addEventListener('mj-slides-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('mj-slides-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const addSlide = useCallback((data: Omit<Slide, 'id'>) => {
    const newSlide: Slide = { ...data, id: 's' + Date.now() };
    const updated = [...slides, newSlide];
    saveSlides(updated);
    setSlides(updated);
    return newSlide;
  }, [slides]);

  const updateSlide = useCallback((id: string, data: Partial<Slide>) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, ...data } : s));
    saveSlides(updated);
    setSlides(updated);
  }, [slides]);

  const deleteSlide = useCallback((id: string) => {
    const updated = slides.filter((s) => s.id !== id);
    saveSlides(updated);
    setSlides(updated);
  }, [slides]);

  return { slides, addSlide, updateSlide, deleteSlide };
}
