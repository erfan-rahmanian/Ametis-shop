
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton'; // Import the centralized button

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] animate-slide-in-up opacity-0" style={{ animationDelay: `${product.id * 50}ms` }}>
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} aria-label={`مشاهده جزئیات ${product.title}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={400}
              className="object-contain w-full h-full p-4 transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint="product photo"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-2">
        <Link href={`/products/${product.id}`} aria-label={`مشاهده جزئیات ${product.title}`}>
          <CardTitle className="text-lg font-headline leading-tight h-12 overflow-hidden text-ellipsis hover:text-primary transition-colors">
            {product.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground capitalize">{product.category}</CardDescription>
        <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        {/* Use the AddToCartButton component directly */}
        <AddToCartButton product={product} />
      </CardFooter>
    </Card>
  );
}
