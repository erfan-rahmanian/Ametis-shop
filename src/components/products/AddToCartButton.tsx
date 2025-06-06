
"use client";

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ToastAction } from "@/components/ui/toast";
import React from 'react'; // Added React for JSX in title

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive-foreground group-[.destructive]:text-destructive-foreground" />
            <span>ورود لازم است</span>
          </div>
        ),
        description: "برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="ورود به حساب کاربری"
            onClick={() => router.push('/login')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            ورود به حساب
          </ToastAction>
        ),
      });
      return;
    }

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
      <ShoppingCart className="ms-2 h-5 w-5" /> افزودن به سبد خرید
    </Button>
  );
}
