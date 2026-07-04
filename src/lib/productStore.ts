import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { Product } from './types';

const CACHE_KEY = 'mj_products_cache';

// Static fallback used only if both Supabase and cache are empty
const FALLBACK_PRODUCTS: Product[] = [];

function loadCache(): Product[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return FALLBACK_PRODUCTS;
}

function saveCache(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch {}
}

// Global singleton so all hook instances share the same state
let currentProducts: Product[] = loadCache();
let isLoading = false;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

async function fetchFromSupabase(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Product[];
}

async function ensureLoaded() {
  if (loaded || isLoading) return;
  isLoading = true;
  try {
    const products = await fetchFromSupabase();
    currentProducts = products;
    saveCache(products);
    loaded = true;
    emit();
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
    loaded = true; // don't retry forever; use cache
  } finally {
    isLoading = false;
  }
}

// Start loading immediately on module import
if (typeof window !== 'undefined') {
  ensureLoaded();
}

export function useProductStore() {
  const [products, setProducts] = useState<Product[]>(currentProducts);

  useEffect(() => {
    const listener = () => setProducts(currentProducts);
    listeners.add(listener);
    ensureLoaded();
    return () => { listeners.delete(listener); };
  }, []);

  const addProduct = useCallback(async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
    try {
      const { data: row, error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          old_price: data.old_price,
          category: data.category,
          image_url: data.image_url,
          stock: data.stock,
          featured: data.featured,
          best_seller: data.best_seller,
          brand: data.brand,
        })
        .select()
        .single();
      if (error) throw error;
      const newProduct = row as Product;
      currentProducts = [newProduct, ...currentProducts];
      saveCache(currentProducts);
      emit();
      return newProduct;
    } catch (err) {
      console.error('Failed to add product:', err);
      return null;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.old_price !== undefined) updateData.old_price = data.old_price;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.image_url !== undefined) updateData.image_url = data.image_url;
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.best_seller !== undefined) updateData.best_seller = data.best_seller;
      if (data.brand !== undefined) updateData.brand = data.brand;

      const { data: row, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      const updated = row as Product;
      currentProducts = currentProducts.map((p) => (p.id === id ? updated : p));
      saveCache(currentProducts);
      emit();
      return true;
    } catch (err) {
      console.error('Failed to update product:', err);
      return false;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      currentProducts = currentProducts.filter((p) => p.id !== id);
      saveCache(currentProducts);
      emit();
      return true;
    } catch (err) {
      console.error('Failed to delete product:', err);
      return false;
    }
  }, []);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id) || null, [products]);

  return { products, addProduct, updateProduct, deleteProduct, getProduct };
}
