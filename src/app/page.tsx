
import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="space-y-8">
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-l from-primary/10 via-background to-accent/10 rounded-lg shadow-xl overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="md:order-2 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <Image
                src="https://sdmntprpolandcentral.oaiusercontent.com/files/00000000-bce8-620a-9d77-2962f55aee30/raw?se=2025-06-06T16%3A38%3A14Z&sp=r&sv=2024-08-04&sr=b&scid=b462787c-6e8d-5d0e-bbbe-feefe5f98807&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-06T06%3A11%3A16Z&ske=2025-06-07T06%3A11%3A16Z&sks=b&skv=2024-08-04&sig=f7tIvYvAnxTApxnmYl3oGQLf/LfV40XBZf6UBwdfXvQ%3D"
                alt="Promotional image for Amethyst Store"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl object-cover w-full h-auto mx-auto md:mx-0"
                data-ai-hint="user provided"
                priority
              />
            </div>
            <div className="md:order-1 text-center md:text-right pt-4 md:pt-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-8 animate-fade-in py-6">
                به فروشگاه آمیتیست خوش آمدید
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto md:mx-0 md:ms-auto animate-fade-in px-2" style={{animationDelay: '0.3s'}}>
                مجموعه‌ای نفیس از محصولات بی‌نظیر و باکیفیت را که فقط برای شما گردآوری شده، کشف کنید. تجربه‌ای لوکس از خرید را با طراحی مدرن و پشتیبانی بی‌نظیر برای خود رقم بزنید.
              </p>
              {/* Optional: Add a Call to Action button here if desired in the future */}
              {/*
              <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in" style={{animationDelay: '0.5s'}}>
                <Link href="#products">اکنون کاوش کنید</Link>
              </Button>
              */}
            </div>
          </div>
        </div>
      </section>
      
      <Separator />

      <section id="products">
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-center text-primary/90 animate-fade-in" style={{animationDelay: '0.4s'}}>
          محصولات ما
        </h2>
        {products.length > 0 ? (
          <ProductList initialProducts={products} />
        ) : (
          <p className="text-center text-muted-foreground text-lg">
            در حال حاضر در حال تکمیل موجودی قفسه‌هایمان هستیم. لطفاً به زودی دوباره سر بزنید!
          </p>
        )}
      </section>
    </div>
  );
}

// Revalidate data every hour
export const revalidate = 3600;

