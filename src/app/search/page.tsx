
import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import type { Product } from '@/lib/types';

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const allProducts = await fetchProducts();

  const filteredProducts = query
    ? allProducts.filter((product: Product) => {
        const searchTerm = query.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      })
    : []; // Show no products if query is empty, or allProducts if you prefer

  return (
    <div className="space-y-8">
      <section className="text-center py-6 sm:py-8 bg-gradient-to-l from-primary/10 via-background to-accent/10 rounded-lg shadow-md">
        <Search className="mx-auto h-12 w-12 text-primary mb-4" />
        {query ? (
          <>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-2">
              نتایج جستجو برای: &quot;{query}&quot;
            </h1>
            <p className="text-base sm:text-lg text-foreground/80">
              {filteredProducts.length} محصول یافت شد.
            </p>
          </>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">
            لطفاً عبارتی را برای جستجو وارد کنید
          </h1>
        )}
      </section>
      
      <Separator />

      {query && (
        <section>
          {filteredProducts.length > 0 ? (
            <ProductList initialProducts={filteredProducts} />
          ) : (
            <p className="text-center text-muted-foreground text-lg py-10">
              هیچ محصولی مطابق با جستجوی شما یافت نشد. لطفاً با عبارت دیگری امتحان کنید.
            </p>
          )}
        </section>
      )}
       {!query && (
         <p className="text-center text-muted-foreground text-lg py-10">
            برای دیدن نتایج، لطفاً یک عبارت جستجو در نوار بالا وارد کنید.
        </p>
       )}
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour if needed
