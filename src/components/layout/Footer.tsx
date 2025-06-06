export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} فروشگاه آمیتیست. تمامی حقوق محفوظ است.</p>
        <p className="text-sm mt-1">محصولات بی‌نظیر را با ما کشف کنید.</p>
      </div>
    </footer>
  );
}
