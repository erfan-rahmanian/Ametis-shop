"use client";

import { useCart } from '@/contexts/CartContext';
import CartItemDisplay from './CartItemDisplay';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CartView() {
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    // Placeholder for checkout logic
    toast({
      title: "Checkout Initiated",
      description: "This is a demo. No real checkout will occur.",
      className: "border-primary bg-primary text-primary-foreground"
    });
    clearCart();
  };
  
  if (itemCount === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h2 className="text-3xl font-headline font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-4xl font-headline font-bold text-primary">Your Shopping Cart</h1>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        {cart.map((item) => (
          <CartItemDisplay key={item.id} item={item} />
        ))}
        <Separator className="my-6" />
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg text-muted-foreground">Subtotal ({itemCount} items)</p>
            <p className="text-2xl font-semibold text-primary">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Shipping</p>
            <p className="text-muted-foreground">Calculated at checkout</p>
          </div>
           <Separator className="my-2" />
           <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-foreground">Total</p>
            <p className="text-3xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={clearCart} className="w-full sm:w-auto">
            Clear Cart
          </Button>
          <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
