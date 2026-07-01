export type Category = 'مفروشات' | 'أدوات منزلية' | 'أجهزة كهربائية';

export type OrderStatus = 'قيد التنفيذ' | 'تم الشحن' | 'تم التوصيل';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: Category;
  image_url: string | null;
  stock: number;
  featured: boolean;
  best_seller: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: 'مفروشات', label: 'مفروشات', icon: '🛋️' },
  { key: 'أدوات منزلية', label: 'أدوات منزلية', icon: '🍽️' },
  { key: 'أجهزة كهربائية', label: 'أجهزة كهربائية', icon: '🔌' },
];

export const ORDER_STATUSES: OrderStatus[] = ['قيد التنفيذ', 'تم الشحن', 'تم التوصيل'];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ' L.E';
}

export function isOnSale(p: Product): boolean {
  return p.old_price !== null && p.old_price > p.price;
}

export function isNew(p: Product): boolean {
  const days = (Date.now() - new Date(p.created_at).getTime()) / 86400000;
  return days <= 7;
}
