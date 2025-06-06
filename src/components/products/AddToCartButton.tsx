"use client";

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "به سبد خرید اضافه شد!",
      description: `${product.title} به سبد خرید شما اضافه شد.`,
      className: "border-primary bg-primary text-primary-foreground",
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
      aria-label={`افزودن ${product.title} به سبد خرید`}
    >
      <ShoppingCart className="ms-2 h-5 w-5" /> افزودن به سبد خرید {/* Changed mr-2 to ms-2 */}
    </Button>
  );
}
