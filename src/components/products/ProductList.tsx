"use client";

import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  initialProducts: Product[];
}

const PRODUCT_SORT_ORDER_KEY = 'amethystShopProductSortOrder';

export default function ProductList({ initialProducts }: ProductListProps) {
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const storedOrderJson = localStorage.getItem(PRODUCT_SORT_ORDER_KEY);
      let finalProducts = [...initialProducts];

      if (storedOrderJson) {
        try {
          const storedOrder = JSON.parse(storedOrderJson) as number[];
          if (Array.isArray(storedOrder)) {
            const productMap = new Map(initialProducts.map(p => [p.id, p]));
            const orderedPart: Product[] = [];
            const remainingProducts = new Set(initialProducts);

            storedOrder.forEach(id => {
              const product = productMap.get(id);
              if (product) {
                orderedPart.push(product);
                remainingProducts.delete(product);
              }
            });
            finalProducts = [...orderedPart, ...Array.from(remainingProducts)];
          }
        } catch (e) {
          console.error("Failed to parse product sort order:", e);
          // Fallback to initialProducts if parsing fails
        }
      }
      setSortedProducts(finalProducts);
      setIsLoading(false);
    } else {
      // For SSR or environments without localStorage, use initial order
      setSortedProducts(initialProducts);
      setIsLoading(false);
    }
  }, [initialProducts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!sortedProducts || sortedProducts.length === 0) {
    return <p className="text-center text-muted-foreground text-lg">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
