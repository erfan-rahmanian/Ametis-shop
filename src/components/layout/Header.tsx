
"use client";

import Link from 'next/link';
import { ShoppingCart, LogIn, UserPlus, LogOut, Menu, Package, LayoutDashboard, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { itemCount, clearCart } = useCart();
  const { user, logout: authLogout, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    authLogout();
    clearCart();
    router.push('/'); // Redirect to home on logout
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after submission
      if (mobileMenuOpen) {
        setMobileMenuOpen(false); // Close mobile menu on search
      }
    }
  };

  const navLinks = [
    { href: '/', label: 'خانه', icon: <Package className="h-4 w-4" /> },
    { href: '/sort-products', label: 'مرتب‌سازی محصولات', icon: <LayoutDashboard className="h-4 w-4" /> },
    // Cart link is handled separately by an icon button
  ];

  const SearchForm = ({ inSheet = false }: { inSheet?: boolean }) => (
    <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 ${inSheet ? 'w-full px-3 py-2' : 'ms-4'}`}>
      <Input
        type="search"
        placeholder="جستجوی محصولات..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`h-9 ${inSheet ? 'flex-grow bg-background/70' : 'w-48 md:w-64 bg-background/70'}`}
        aria-label="جستجوی محصولات"
      />
      <Button type="submit" variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="دکمه جستجو">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );

  const UserActions = () => {
    if (authIsLoading) {
      return <div className="h-10 w-20 animate-pulse bg-muted rounded-md" />;
    }
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png?size=36`} alt={user.email} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" side="right" align="start" sideOffset={5} alignOffset={-16}>
            <DropdownMenuLabel className="font-normal px-2 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-muted-foreground">وارد شده با نام:</p>
                <p className="text-sm font-medium leading-none text-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="ms-2 h-4 w-4" />
              <span>خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-2 space-x-reverse">
        <Button variant="ghost" asChild>
          <Link href="/login">
            <LogIn className="ms-2 h-4 w-4" /> ورود
          </Link>
        </Button>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/register">
            <UserPlus className="ms-2 h-4 w-4" /> ثبت‌نام
          </Link>
        </Button>
      </div>
    );
  };

  const NavMenuItems = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button variant="ghost" asChild key={link.href} onClick={inSheet ? () => setMobileMenuOpen(false) : undefined}>
          <Link href={link.href} className="flex items-center space-x-2 space-x-reverse px-3 py-2">
            {link.icon}
            <span>{link.label}</span>
          </Link>
        </Button>
      ))}
       {/* Cart link for sheet menu */}
      {inSheet && (
         <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
            <Link href="/cart" className="flex items-center space-x-2 space-x-reverse px-3 py-2">
                <ShoppingCart className="h-4 w-4" />
                <span>سبد خرید</span>
                 {itemCount > 0 && (
                    <span className="ms-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {itemCount}
                    </span>
                    )}
            </Link>
        </Button>
      )}
      {!authIsLoading && !isAuthenticated && inSheet && (
        <>
          <DropdownMenuSeparator className="my-2" />
          <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)} className="w-full justify-start">
            <Link href="/login" className="flex items-center space-x-2 space-x-reverse px-3 py-2">
              <LogIn className="h-4 w-4" /> <span>ورود</span>
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
            <Link href="/register" className="flex items-center space-x-2 space-x-reverse px-3 py-2">
              <UserPlus className="h-4 w-4" /> <span>ثبت‌نام</span>
            </Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-primary/90 transition-colors">
          فروشگاه آمیتیست
        </Link>

        <div className="hidden md:flex items-center flex-grow">
          <nav className="flex items-center space-x-1 space-x-reverse ms-6">
            <NavMenuItems />
          </nav>
          <div className="flex-grow flex justify-start"> {/* Aligns search to the left of user actions */}
             <SearchForm />
          </div>
        </div>

        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="relative hidden md:block">
             <Button variant="ghost" size="icon" asChild aria-label="باز کردن سبد خرید">
                <Link href="/cart">
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                    <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {itemCount}
                    </span>
                    )}
                </Link>
            </Button>
          </div>
          
          <UserActions />

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" aria-label="باز کردن سبد خرید" className="relative" asChild> 
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">باز/بسته کردن منو</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-background">
                <div className="p-4 border-b border-border/40">
                   <Link href="/" className="text-xl font-headline font-bold text-primary hover:text-primary/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    فروشگاه آمیتیست
                  </Link>
                </div>
                <div className="py-2 border-b border-border/40">
                   <SearchForm inSheet={true} />
                </div>
                <nav className="flex flex-col space-y-1 p-4">
                  <NavMenuItems inSheet={true}/>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
