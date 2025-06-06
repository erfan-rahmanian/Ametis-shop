
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (authLoading) {
        toast({
            title: "لطفاً صبر کنید",
            description: "در حال بررسی وضعیت ورود شما...",
            duration: 2000,
        });
        return;
    }

    if (!isAuthenticated) {
      toast({
        title: (
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-5 w-5 text-accent-foreground" /> {/* Icon color updated */}
            <span>ورود لازم است</span>
          </div>
        ),
        description: "برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.",
        className: "bg-accent border-accent text-accent-foreground shadow-lg", // Custom class for styling
        duration: 5000,
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
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
      aria-label={`افزودن ${product.title} به سبد خرید`}
      disabled={authLoading}
    >
      {authLoading ? <span className="animate-pulse">صبر کنید...</span> : <ShoppingCart className="ms-2 h-5 w-5" />}
      {!authLoading && "افزودن به سبد خرید"}
    </Button>
  );
}
