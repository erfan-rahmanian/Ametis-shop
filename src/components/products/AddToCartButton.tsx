
"use client";

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ToastAction } from "@/components/ui/toast";
import React from 'react';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth(); // Renamed isLoading to avoid conflict if any
  const router = useRouter();

  const handleAddToCart = () => {
    // Wait for auth state to be resolved
    if (authLoading) {
        toast({
            title: "لطفاً صبر کنید",
            description: "در حال بررسی وضعیت ورود شما...",
            duration: 2000, // Short duration
        });
        return;
    }

    if (!isAuthenticated) {
      toast({
        title: (
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
            <span>ورود لازم است</span>
          </div>
        ),
        description: "برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.",
        variant: "destructive",
        duration: 5000, // Slightly longer for user to react
        action: (
          <ToastAction
            altText="ورود به حساب کاربری"
            onClick={() => router.push('/login')}
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary"
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
      // Default duration from use-toast (4 seconds) will apply
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
      aria-label={`افزودن ${product.title} به سبد خرید`}
      disabled={authLoading} // Disable button while auth state is loading
    >
      {authLoading ? <span className="animate-pulse">صبر کنید...</span> : <ShoppingCart className="ms-2 h-5 w-5" />}
      {!authLoading && "افزودن به سبد خرید"}
    </Button>
  );
}
