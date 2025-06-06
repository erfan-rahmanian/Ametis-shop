import type { Product } from './types';

const API_URL = 'https://fakestoreapi.com';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array on error
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch product with id ${id}`);
    }
    const product = await response.json();
    return product as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}
