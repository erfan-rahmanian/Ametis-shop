import type { Product } from './types';

const API_URL = 'https://fakestoreapi.com';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('خطا در دریافت محصولات');
    }
    const products = await response.json();
    return products as Product[];
  } catch (error) {
    console.error('خطا در دریافت محصولات:', error);
    return []; // Return empty array on error
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`خطا در دریافت محصول با شناسه ${id}`);
    }
    const product = await response.json();
    return product as Product;
  } catch (error) {
    console.error(`خطا در دریافت محصول ${id}:`, error);
    return null;
  }
}
