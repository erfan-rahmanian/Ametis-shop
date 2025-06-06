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
    <div className="flex items-center space-x-4 space-x-reverse py-4 border-b border-border/60 animate-fade-in"> {/* Added space-x-reverse */}
      <Link href={`/products/${item.id}`} className="shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          width={80}
          height={80}
          className="rounded-md object-contain border border-border/40 p-1 bg-white"
          data-ai-hint="product photo"
        />
      </Link>
      <div className="flex-grow min-w-0"> {/* Added min-w-0 here */}
        <Link href={`/products/${item.id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{item.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} هر عدد</p>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse"> {/* Added space-x-reverse */}
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="کاهش تعداد">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          min="1"
          className="w-14 text-center h-10" /* Changed w-16 to w-14 */
          aria-label="تعداد کالا"
        />
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="افزایش تعداد">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-semibold w-24 text-left text-primary">${(item.price * item.quantity).toFixed(2)}</p> {/* Changed w-20 to w-24 */}
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive" aria-label="حذف کالا">
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
