import { fetchProducts } from '@/lib/api';
import SortableProductList from '@/components/products/SortableProductList';
import { ArrowDownUp } from 'lucide-react';

export default async function SortProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-l from-primary/10 via-background to-accent/10 rounded-lg shadow-md"> {/* Adjusted gradient direction */}
        <ArrowDownUp className="mx-auto h-16 w-16 text-primary mb-4 animate-fade-in" />
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
          سفارشی‌سازی نمایش
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
          محصولات را به دلخواه خود مرتب کنید. برای تغییر ترتیب، بکشید و رها کنید و چیدمان مورد نظر خود را ذخیره کنید.
        </p>
      </section>
      
      <SortableProductList initialProducts={products} />
    </div>
  );
}

// Revalidate data if products might change, though sorting is client-side
export const revalidate = 3600;
