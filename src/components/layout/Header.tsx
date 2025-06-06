"use client";

import Link from 'next/link';
import { ShoppingCart, User, LogIn, UserPlus, LogOut, Menu, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'خانه', icon: <Package className="h-4 w-4" /> },
    { href: '/sort-products', label: 'مرتب‌سازی محصولات', icon: <Package className="h-4 w-4" /> },
    { href: '/cart', label: 'سبد خرید', icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  const UserActions = () => {
    if (isLoading) {
      return <div className="h-8 w-20 animate-pulse bg-muted rounded-md" />;
    }
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.email} />
                <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">وارد شده با نام</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="ms-2 h-4 w-4" /> {/* Changed mr-2 to ms-2 */}
              <span>خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-2 space-x-reverse"> {/* Added space-x-reverse */}
        <Button variant="ghost" asChild>
          <Link href="/login">
            <LogIn className="ms-2 h-4 w-4" /> ورود {/* Changed mr-2 to ms-2 */}
          </Link>
        </Button>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/register">
            <UserPlus className="ms-2 h-4 w-4" /> ثبت‌نام {/* Changed mr-2 to ms-2 */}
          </Link>
        </Button>
      </div>
    );
  };

  const NavMenu = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button variant="ghost" asChild key={link.href} onClick={inSheet ? () => setMobileMenuOpen(false) : undefined}>
          <Link href={link.href} className="flex items-center space-x-2 space-x-reverse"> {/* Added space-x-reverse */}
            {link.icon}
            <span>{link.label}</span>
          </Link>
        </Button>
      ))}
      {!isAuthenticated && !isLoading && inSheet && (
        <>
          <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
            <Link href="/login" className="flex items-center space-x-2 space-x-reverse"> {/* Added space-x-reverse */}
              <LogIn className="h-4 w-4" /> ورود
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" onClick={() => setMobileMenuOpen(false)}>
            <Link href="/register" className="flex items-center space-x-2 space-x-reverse justify-center"> {/* Added space-x-reverse */}
              <UserPlus className="h-4 w-4" /> ثبت‌نام
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

        <nav className="hidden md:flex items-center space-x-4 space-x-reverse"> {/* Added space-x-reverse */}
          <NavMenu />
        </nav>

        <div className="flex items-center space-x-3 space-x-reverse"> {/* Added space-x-reverse */}
          <Link href="/cart" passHref legacyBehavior>
            <Button variant="ghost" size="icon" aria-label="باز کردن سبد خرید" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"> {/* Changed -right-1 to -left-1 */}
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          <UserActions />
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">باز/بسته کردن منو</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6"> {/* Changed side="right" to "left" for RTL */}
                <nav className="flex flex-col space-y-4">
                  <NavMenu inSheet={true}/>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
