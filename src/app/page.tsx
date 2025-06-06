
import { fetchProducts } from '@/lib/api';
import ProductList from '@/components/products/ProductList';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Layers } from 'lucide-react'; 

export default async function HomePage() {
  const products = await fetchProducts();
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-12"> {/* Increased default space-y for better separation */}
      {/* Hero Section */}
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
            <div className="md:order-1 text-center pt-4 md:pt-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-8 animate-fade-in py-6">
                به فروشگاه آمیتیست خوش آمدید
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto animate-fade-in px-2" style={{animationDelay: '0.3s'}}>
                مجموعه‌ای نفیس از محصولات بی‌نظیر و باکیفیت را که فقط برای شما گردآوری شده، کشف کنید. تجربه‌ای لوکس از خرید را با طراحی مدرن و پشتیبانی بی‌نظیر برای خود رقم بزنید.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Separator />

      {/* Categories Section */}
      <section id="categories" className="space-y-6">
        <div className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
            <Layers className="mx-auto h-12 w-12 text-primary mb-3" />
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-primary/90">
                دسته بندی محصولات
            </h2>
            <p className="text-muted-foreground mt-2">دسته‌بندی مورد نظر خود را برای مشاهده محصولات انتخاب کنید.</p>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
            {categories.map((category, index) => (
              <Link key={category} href={`/category/${encodeURIComponent(category)}`} className="group block" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 ease-in-out transform hover:scale-105 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    {/* Placeholder for category image - could be added later */}
                    {/* <Image src={`https://placehold.co/100x100.png?text=${encodeURIComponent(category)}`} alt={category} width={80} height={80} className="mb-4 rounded-md" data-ai-hint="category icon" /> */}
                    <CardTitle className="text-lg sm:text-xl font-semibold capitalize text-card-foreground group-hover:text-primary transition-colors">
                      {category}
                    </CardTitle>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            دسته بندی برای نمایش وجود ندارد.
          </p>
        )}
      </section>

      <Separator />

      {/* Products Section */}
      <section id="products" className="space-y-6"> {/* Added space-y-6 */}
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold text-center text-primary/90 animate-fade-in" style={{animationDelay: '0.4s'}}>
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
