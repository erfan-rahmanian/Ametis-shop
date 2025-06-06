
import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/products/ProductList';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Generate static paths for each category
export async function generateStaticParams() {
  const products = await fetchProducts();
  if (!products || products.length === 0) {
    return [];
  }
  const categories = Array.from(new Set(products.map((product) => product.category)));
  return categories.map((category) => ({
    categoryName: encodeURIComponent(category),
  }));
}

export async function generateMetadata({ params }: { params: { categoryName: string } }) {
  const decodedCategoryName = decodeURIComponent(params.categoryName);
  return {
    title: `دسته بندی: ${decodedCategoryName} - فروشگاه آمیتیست`,
    description: `محصولات دسته بندی ${decodedCategoryName} را در فروشگاه آمیتیست مشاهده کنید.`,
  };
}

export default async function CategoryPage({ params }: { params: { categoryName: string } }) {
  const decodedCategoryName = decodeURIComponent(params.categoryName).toLowerCase();
  const allProducts = await fetchProducts();

  const filteredProducts = allProducts.filter(
    (product) => product.category.toLowerCase() === decodedCategoryName
  );

  // Check if the category itself is valid based on fetched products
  const allCategories = Array.from(new Set(allProducts.map(p => p.category.toLowerCase())));
  if (!allCategories.includes(decodedCategoryName)) {
    return (
      <div className="text-center py-12 animate-fade-in space-y-6">
        <PackageOpen className="mx-auto h-24 w-24 text-destructive mb-6" />
        <h1 className="text-3xl font-headline font-semibold mb-4 text-destructive">دسته بندی نامعتبر</h1>
        <p className="text-muted-foreground text-lg">
          متاسفانه، دسته بندی که به دنبال آن بودید یافت نشد.
        </p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">بازگشت به صفحه اصلی</Link>
        </Button>
         <Button asChild variant="outline" className="mt-8 ms-2">
          <Link href="/#categories">مشاهده همه دسته‌بندی‌ها</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center py-8 bg-gradient-to-l from-primary/10 via-background to-accent/10 rounded-lg shadow-md">
        <PackageOpen className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-2 capitalize">
          {decodeURIComponent(params.categoryName)}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80">
          {filteredProducts.length} محصول در این دسته بندی یافت شد.
        </p>
      </section>
      
      <Separator />

      <section>
        {filteredProducts.length > 0 ? (
          <ProductList initialProducts={filteredProducts} />
        ) : (
          <div className="text-center py-10 space-y-4">
            <p className="text-muted-foreground text-lg">
              هیچ محصولی در این دسته بندی یافت نشد.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
