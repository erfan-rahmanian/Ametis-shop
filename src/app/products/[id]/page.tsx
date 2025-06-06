
import { fetchProductById, fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton'; // A client component for adding to cart
import ProductList from '@/components/products/ProductList';

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id:string } }) {
  const product = await fetchProductById(params.id);
  if (!product) {
    return {
      title: 'محصول یافت نشد',
    };
  }
  return {
    title: `${product.title} - فروشگاه آمیتیست`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);
  const allProducts = await fetchProducts();

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-headline font-semibold mb-4">محصول یافت نشد</h1>
        <p className="text-muted-foreground">متاسفانه، محصولی که به دنبال آن بودید پیدا نشد.</p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
          <a href="/">رفتن به صفحه اصلی</a>
        </Button>
      </div>
    );
  }

  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5); // Show up to 5 similar products

  return (
    <div className="container mx-auto py-8 animate-fade-in space-y-12">
      <Card className="overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="p-4 md:p-6 bg-card flex justify-center items-center aspect-square md:aspect-auto">
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="object-contain max-h-[500px] rounded-lg"
              data-ai-hint="product large"
            />
          </div>
          <div className="p-4 md:p-8 flex flex-col">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-headline text-primary mb-2">{product.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground uppercase tracking-wider mb-4">{product.category}</CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 flex-grow space-y-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(product.rating.rate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">({product.rating.count} نظر)</span>
              </div>

              <p className="text-2xl sm:text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
              
              <Separator />
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground/90">توضیحات</h3>
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
              </div>
            </CardContent>
            
            <CardFooter className="p-0 mt-8">
              <AddToCartButton product={product} size="lg" />
            </CardFooter>
          </div>
        </div>
      </Card>

      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <Separator />
          <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-center text-primary/90">
            محصولات مشابه
          </h2>
          <ProductList initialProducts={similarProducts} />
        </section>
      )}
    </div>
  );
}

export const revalidate = 3600; // Revalidate product data every hour
