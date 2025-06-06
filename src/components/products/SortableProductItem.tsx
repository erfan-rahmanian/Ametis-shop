"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface SortableProductItemProps {
  product: Product;
  index: number; // 0-based index for sorting logic
  position: number; // 1-based position for display
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  isDragging?: boolean; // Optional: to style the item being dragged
}

export default function SortableProductItem({
  product,
  index,
  position,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging
}: SortableProductItemProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`flex items-center p-4 space-x-4 border rounded-lg shadow-sm cursor-grab transition-all duration-150 ease-in-out ${isDragging ? 'opacity-50 scale-95 shadow-xl bg-secondary' : 'bg-card hover:shadow-md'}`}
    >
      <GripVertical className="h-6 w-6 text-muted-foreground flex-shrink-0" />
      <div className="w-12 h-12 flex-shrink-0 relative">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="rounded-md object-contain p-1 bg-white border"
          data-ai-hint="product miniature"
        />
      </div>
      <div className="flex-grow min-w-0">
        <CardTitle className="text-base font-medium truncate" title={product.title}>
          {product.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow">
        {position}
      </div>
    </Card>
  );
}
