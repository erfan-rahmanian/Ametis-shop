import { fetchProducts } from '@/lib/api';
import SortableProductList from '@/components/products/SortableProductList';
import { ArrowDownUp } from 'lucide-react';

export default async function SortProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg shadow-md">
        <ArrowDownUp className="mx-auto h-16 w-16 text-primary mb-4 animate-fade-in" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
          Customize Your View
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
          Arrange products to your liking. Drag and drop to reorder, and save your preferred layout.
        </p>
      </section>
      
      <SortableProductList initialProducts={products} />
    </div>
  );
}

// Revalidate data if products might change, though sorting is client-side
export const revalidate = 3600;
