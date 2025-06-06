import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-lg shadow-md">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 animate-fade-in">
          Welcome to Amethyst Shop
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
          Discover an exquisite collection of unique and high-quality products, curated just for you.
        </p>
      </section>
      
      <Separator />

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center text-primary/90 animate-fade-in" style={{animationDelay: '0.4s'}}>
          Our Products
        </h2>
        {products.length > 0 ? (
          <ProductList initialProducts={products} />
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            We are currently restocking our shelves. Please check back soon!
          </p>
        )}
      </section>
    </div>
  );
}

// Revalidate data every hour
export const revalidate = 3600;
