
"use client";

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface CartItemDisplayProps {
  item: CartItem;
}

export default function CartItemDisplay({ item }: CartItemDisplayProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="py-4 border-b border-border/60 animate-fade-in">
      {/* Mobile Layout (default) */}
      <div className="sm:hidden flex flex-col items-center space-y-3 text-center">
        <Link href={`/products/${item.id}`} className="block w-28 h-28" aria-label={`مشاهده ${item.title}`}>
          <Image
            src={item.image}
            alt={item.title}
            width={112} 
            height={112}
            className="rounded-md object-contain border border-border/40 p-1 bg-white h-full w-full"
            data-ai-hint="product photo"
          />
        </Link>
        <Link href={`/products/${item.id}`} className="block w-full" aria-label={`مشاهده ${item.title}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors px-4">{item.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} هر عدد</p>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="کاهش تعداد">
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            min="1"
            className="w-14 text-center h-10"
            aria-label="تعداد کالا"
          />
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="افزایش تعداد">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="font-semibold text-lg text-primary">${(item.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive mt-1" aria-label="حذف کالا">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Desktop Layout (sm and up) */}
      <div className="hidden sm:flex sm:items-center sm:space-x-3 sm:space-x-reverse">
        <Link href={`/products/${item.id}`} className="shrink-0" aria-label={`مشاهده ${item.title}`}>
          <Image
            src={item.image}
            alt={item.title}
            width={80}
            height={80}
            className="rounded-md object-contain border border-border/40 p-1 bg-white"
            data-ai-hint="product photo"
          />
        </Link>
        <div className="flex-grow min-w-0">
          <Link href={`/products/${item.id}`} aria-label={`مشاهده ${item.title}`}>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{item.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} هر عدد</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="کاهش تعداد">
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            min="1"
            className="w-14 text-center h-10"
            aria-label="تعداد کالا"
          />
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="افزایش تعداد">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="font-semibold w-22 text-left text-primary">${(item.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="حذف کالا">
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
