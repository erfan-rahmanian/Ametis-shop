"use client";

import type { Product } from '@/lib/types';
import SortableProductItem from './SortableProductItem';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownUp, Save } from 'lucide-react';

interface SortableProductListProps {
  initialProducts: Product[];
}

const PRODUCT_SORT_ORDER_KEY = 'amethystShopProductSortOrder';

export default function SortableProductList({ initialProducts }: SortableProductListProps) {
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);


  const loadAndSortProducts = useCallback(() => {
    setIsLoading(true);
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
        console.error("خطا در تجزیه ترتیب محصولات:", e);
      }
    }
    setSortedProducts(finalProducts);
    setIsLoading(false);
  }, [initialProducts]);

  useEffect(() => {
    loadAndSortProducts();
  }, [loadAndSortProducts]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItemIndex.current = index;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
     // Minimalistic drag image (optional, browser dependent)
    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    dragOverItemIndex.current = index;
     // Add visual feedback for drag over if desired
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (dragItemIndex.current === null) return;

    const newSortedProducts = [...sortedProducts];
    const draggedItemContent = newSortedProducts.splice(dragItemIndex.current, 1)[0];
    newSortedProducts.splice(dropIndex, 0, draggedItemContent);
    
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggingIndex(null);
    setSortedProducts(newSortedProducts);
  };
  
  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const saveOrder = () => {
    const productIdsInOrder = sortedProducts.map(p => p.id);
    localStorage.setItem(PRODUCT_SORT_ORDER_KEY, JSON.stringify(productIdsInOrder));
    toast({
      title: "ترتیب ذخیره شد!",
      description: "ترتیب سفارشی محصولات شما ذخیره شد.",
      className: "border-primary bg-primary text-primary-foreground",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
        <Skeleton className="h-12 w-32 rounded-lg mt-4" />
      </div>
    );
  }

  if (!sortedProducts || sortedProducts.length === 0) {
    return <p className="text-center text-muted-foreground text-lg">هیچ محصولی برای مرتب‌سازی وجود ندارد.</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-headline font-semibold text-primary/90">
          مرتب‌سازی محصولات
        </h2>
        <Button onClick={saveOrder} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="ms-2 h-4 w-4" /> ذخیره ترتیب {/* Changed mr-2 to ms-2 */}
        </Button>
      </div>
      <p className="text-muted-foreground">
        محصولات را بکشید و رها کنید تا ترتیب نمایش آنها در صفحه اصلی تغییر کند. تنظیمات شما به صورت محلی ذخیره خواهد شد.
      </p>
      <div className="space-y-3" onDragEnd={handleDragEnd}>
        {sortedProducts.map((product, index) => (
          <SortableProductItem
            key={product.id}
            product={product}
            index={index}
            position={index + 1}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={draggingIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
