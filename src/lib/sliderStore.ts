import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

const CACHE_KEY = 'mj_slides_cache';

// Static fallback — premium Unsplash images baked in as permanent defaults
const FALLBACK_SLIDES: Slide[] = [
  {
    id: 'fallback-s1',
    title: 'مفروشات تحول حلمك إلى حقيقة',
    subtitle: 'تشكيلة فاخرة من الأرائك والسرر والسجاد بأرقى التصاميم',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    cta: 'تسوق الآن',
    link: '/shop?category=مفروشات',
  },
  {
    id: 'fallback-s2',
    title: 'أدوات منزلية بأناقة لا مثيل لها',
    subtitle: 'أواني طبخ وأطقم عشاء بجودة عالية وتصاميم عصرية',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
    cta: 'اكتشف المجموعة',
    link: '/shop?category=أدوات منزلية',
  },
  {
    id: 'fallback-s3',
    title: 'أجهزة كهربائية بأحدث التقنيات',
    subtitle: 'ثلاجات وغسالات ومكيفات من أفضل العلامات التجارية',
    image: 'https://images.unsplash.com/photo-1719937226655-6a429b717f6b?auto=format&fit=crop&q=80&w=1200',
    cta: 'تصفح الأجهزة',
    link: '/shop?category=أجهزة كهربائية',
  },
];

function loadCache(): Slide[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return FALLBACK_SLIDES;
}

function saveCache(slides: Slide[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(slides));
  } catch {}
}

// Global singleton
let currentSlides: Slide[] = loadCache();
let isLoading = false;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function mapRow(row: { id: string; title: string; subtitle: string | null; image: string; cta: string | null; link: string | null }): Slide {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    image: row.image,
    cta: row.cta || 'تسوق الآن',
    link: row.link || '/shop',
  };
}

async function fetchFromSupabase(): Promise<Slide[]> {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  if (!data || data.length === 0) return FALLBACK_SLIDES;
  return data.map(mapRow);
}

async function ensureLoaded() {
  if (loaded || isLoading) return;
  isLoading = true;
  try {
    const slides = await fetchFromSupabase();
    currentSlides = slides;
    saveCache(slides);
    loaded = true;
    emit();
  } catch (err) {
    console.error('Failed to load slides from Supabase:', err);
    loaded = true;
  } finally {
    isLoading = false;
  }
}

if (typeof window !== 'undefined') {
  ensureLoaded();
}

export function useSliderStore() {
  const [slides, setSlides] = useState<Slide[]>(currentSlides);

  useEffect(() => {
    const listener = () => setSlides(currentSlides);
    listeners.add(listener);
    ensureLoaded();
    return () => { listeners.delete(listener); };
  }, []);

  const addSlide = useCallback(async (data: Omit<Slide, 'id'>): Promise<Slide | null> => {
    try {
      const { data: row, error } = await supabase
        .from('slides')
        .insert({
          title: data.title,
          subtitle: data.subtitle,
          image: data.image,
          cta: data.cta,
          link: data.link,
        })
        .select()
        .single();
      if (error) throw error;
      const newSlide = mapRow(row);
      currentSlides = [...currentSlides, newSlide];
      saveCache(currentSlides);
      emit();
      return newSlide;
    } catch (err) {
      console.error('Failed to add slide:', err);
      return null;
    }
  }, []);

  const updateSlide = useCallback(async (id: string, data: Partial<Slide>): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (data.title !== undefined) updateData.title = data.title;
      if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.cta !== undefined) updateData.cta = data.cta;
      if (data.link !== undefined) updateData.link = data.link;

      const { data: row, error } = await supabase
        .from('slides')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updated = mapRow(row);
      currentSlides = currentSlides.map((s) => (s.id === id ? updated : s));
      saveCache(currentSlides);
      emit();
      return true;
    } catch (err) {
      console.error('Failed to update slide:', err);
      return false;
    }
  }, []);

  const deleteSlide = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('slides').delete().eq('id', id);
      if (error) throw error;
      currentSlides = currentSlides.filter((s) => s.id !== id);
      saveCache(currentSlides);
      emit();
      return true;
    } catch (err) {
      console.error('Failed to delete slide:', err);
      return false;
    }
  }, []);

  return { slides, addSlide, updateSlide, deleteSlide };
}
