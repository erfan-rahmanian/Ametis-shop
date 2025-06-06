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
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
      className: "border-primary bg-primary text-primary-foreground",
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${className}`}
      aria-label={`Add ${product.title} to cart`}
    >
      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
    </Button>
  );
}
