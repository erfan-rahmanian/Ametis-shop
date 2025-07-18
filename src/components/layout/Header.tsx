
"use client";

import Link from 'next/link';
import { ShoppingCart, LogIn, UserPlus, LogOut, Menu, Package, LayoutDashboard, User, Search as SearchIcon, Layers, ChevronDown } from 'lucide-react'; // Added Layers & ChevronDown
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, type FormEvent, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts } from '@/lib/api'; // To fetch categories
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

// Define SearchFormComponent outside of Header
interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (event: FormEvent) => void;
  inSheet?: boolean;
}

const SearchFormComponent: React.FC<SearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  inSheet = false,
}) => {
  return (
    <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 ${inSheet ? 'w-full' : 'ms-4'}`}>
      <Input
        type="search"
        placeholder="جستجوی محصولات..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`h-9 ${inSheet ? 'flex-grow bg-input' : 'w-48 md:w-64 bg-input'}`}
        aria-label="جستجوی محصولات"
      />
      <Button type="submit" variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="دکمه جستجو">
        <SearchIcon className="h-5 w-5" />
      </Button>
    </form>
  );
};


export default function Header() {
  const { itemCount, clearCart } = useCart();
  const { user, logout: authLogout, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const products: Product[] = await fetchProducts();
        const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]); // Set to empty on error
      }
      setIsLoadingCategories(false);
    };
    loadCategories();
  }, []);

  const handleLogout = () => {
    authLogout();
    clearCart();
    router.push('/'); // Redirect to home on logout
  };

  const handleSearchSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  }, [searchQuery, router, mobileMenuOpen, setSearchQuery, setMobileMenuOpen]);


  const navLinks = [
    { href: '/', label: 'خانه', icon: <Package className="h-4 w-4" /> },
    { href: '#', label: 'دسته‌بندی‌ها', icon: <Layers className="h-4 w-4" /> }, // Changed href
    { href: '/sort-products', label: 'مرتب‌سازی محصولات', icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

  const UserActions = () => { // This component is now only for desktop display in the header bar
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
          <DropdownMenuContent
            className="w-52"
            side="right"
            align="start"
            sideOffset={5}
            alignOffset={-16}
          >
            <DropdownMenuLabel className="font-normal px-2 py-2 text-right">
              <div className="flex flex-col space-y-1">
                <p className="text-xs text-muted-foreground">وارد شده با نام:</p>
                <p className="text-sm font-medium leading-none text-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="ms-2 h-4 w-4" />
              <span>خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      // Login/Register buttons for desktop are part of UserActions, handled by its internal md:flex
      <div className="flex items-center space-x-2 space-x-reverse">
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
      {navLinks.map((link) => {
        if (link.label === 'دسته‌بندی‌ها') {
          return (
            <DropdownMenu key={link.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2 ${inSheet ? 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'} flex items-center space-x-2 space-x-reverse`}
                  aria-label="منوی دسته‌بندی‌ها"
                >
                  {link.icon}
                  <span>{link.label}</span>
                  <ChevronDown className="ms-auto h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={cn(
                  "w-56",
                  "bg-sidebar", // Apply sidebar background in both contexts
                  "text-sidebar-foreground" // Apply sidebar text color
                )}
                align={inSheet ? "end" : "start"}
                side={inSheet ? "bottom" : "bottom"}
              >
                {isLoadingCategories ? (
                  <DropdownMenuItem disabled className={inSheet ? "focus:bg-sidebar-accent/80" : ""}>در حال بارگذاری...</DropdownMenuItem>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <DropdownMenuItem
                      asChild
                      key={category}
                      onClick={() => { if (inSheet && setMobileMenuOpen) setMobileMenuOpen(false); }}
                      className={cn("capitalize cursor-pointer", inSheet ? "focus:bg-sidebar-accent/80" : "focus:bg-accent/80")}
                    >
                      <Link href={`/category/${encodeURIComponent(category)}`}>
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className={inSheet ? "focus:bg-sidebar-accent/80" : ""}>دسته‌بندی‌ای یافت نشد.</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return (
          <Button
            variant="ghost"
            asChild
            key={link.href}
            onClick={inSheet && setMobileMenuOpen ? () => setMobileMenuOpen(false) : undefined}
            className={`w-full justify-start px-3 py-2 ${inSheet ? 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
          >
            <Link href={link.href} className="flex items-center space-x-2 space-x-reverse">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </Button>
        );
      })}
      {inSheet && (
         <Button
            variant="ghost"
            asChild
            onClick={setMobileMenuOpen ? () => setMobileMenuOpen(false) : undefined}
            className="w-full justify-start px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Link href="/cart" className="flex items-center space-x-2 space-x-reverse">
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
          <DropdownMenuSeparator className="my-2 bg-sidebar-border" />
          <Button
            variant="ghost"
            asChild
            onClick={setMobileMenuOpen ? () => setMobileMenuOpen(false) : undefined}
            className="w-full justify-start px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Link href="/login" className="flex items-center space-x-2 space-x-reverse">
              <LogIn className="h-4 w-4" /> <span>ورود</span>
            </Link>
          </Button>
          <Button
            asChild
            className="bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground w-full justify-center px-3 py-2"
            onClick={setMobileMenuOpen ? () => setMobileMenuOpen(false) : undefined}
          >
            <Link href="/register" className="flex items-center space-x-2 space-x-reverse">
              <UserPlus className="h-4 w-4" /> <span>ثبت‌نام</span>
            </Link>
          </Button>
        </>
      )}
      {!authIsLoading && isAuthenticated && user && inSheet && (
        <>
          <DropdownMenuSeparator className="my-2 bg-sidebar-border" />
          <div className="px-3 py-2 text-right">
            <p className="text-xs text-sidebar-foreground/70">وارد شده با نام:</p>
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              handleLogout();
              if (setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive px-3 py-2"
          >
            <LogOut className="ms-2 h-4 w-4" />
            <span>خروج</span>
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
          <div className="flex-grow flex justify-start">
             <SearchFormComponent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearchSubmit={handleSearchSubmit}
              />
          </div>
        </div>

        <div className="flex items-center space-x-1 space-x-reverse">
          {/* Desktop Cart Icon */}
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

          {/* UserActions for desktop only */}
          <div className="hidden md:block">
            <UserActions />
          </div>

          {/* Mobile specific icons & menu trigger */}
          <div className="md:hidden flex items-center space-x-1 space-x-reverse">
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
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-sidebar text-sidebar-foreground">
                <SheetHeader className="p-4 border-b border-sidebar-border text-right">
                  <SheetTitle asChild>
                    <Link href="/" className="text-xl font-headline font-bold text-sidebar-primary hover:text-sidebar-primary/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      فروشگاه آمیتیست
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4 py-3 border-b border-sidebar-border">
                   <SearchFormComponent
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      handleSearchSubmit={handleSearchSubmit}
                      inSheet={true}
                    />
                </div>
                <nav className="flex flex-col space-y-1 p-4 flex-grow overflow-y-auto">
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
