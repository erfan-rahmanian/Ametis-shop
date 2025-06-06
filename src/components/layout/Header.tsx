
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
  const { itemCount, openCart } = useCart();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: <Package className="h-4 w-4" /> },
    { href: '/sort-products', label: 'Sort Products', icon: <Package className="h-4 w-4" /> },
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
                <p className="text-sm font-medium leading-none">Signed in as</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="hidden md:flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Link>
        </Button>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/register">
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </Link>
        </Button>
      </div>
    );
  };

  const NavMenu = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button variant="ghost" asChild key={link.href} onClick={inSheet ? () => setMobileMenuOpen(false) : undefined}>
          <Link href={link.href} className="flex items-center space-x-2">
            {link.icon}
            <span>{link.label}</span>
          </Link>
        </Button>
      ))}
      {!isAuthenticated && !isLoading && inSheet && (
        <>
          <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
            <Link href="/login" className="flex items-center space-x-2">
              <LogIn className="h-4 w-4" /> Login
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" onClick={() => setMobileMenuOpen(false)}>
            <Link href="/register" className="flex items-center space-x-2 justify-center">
              <UserPlus className="h-4 w-4" /> Register
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
          Amethyst Shop
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavMenu />
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={openCart} aria-label="Open shopping cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Button>
          <UserActions />
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
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
