"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  formType: 'login' | 'register';
  onSubmit: (email: string, password?: string) => Promise<void> | void; // Password optional for demo
  isLoading?: boolean;
}

export default function AuthForm({ formType, onSubmit, isLoading = false }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (formType === 'register' && password !== confirmPassword) {
      setError("رمزهای عبور مطابقت ندارند.");
      return;
    }
    if (!email || !password) {
      setError("ایمیل و رمز عبور الزامی هستند.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
        return;
    }
    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err.message || "خطایی غیرمنتظره رخ داد.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            {formType === 'login' ? 'خوش آمدید!' : 'ایجاد حساب کاربری'}
          </CardTitle>
          <CardDescription>
            {formType === 'login' ? 'برای ادامه خرید وارد شوید.' : 'برای کشف محصولات انحصاری ثبت‌نام کنید.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">آدرس ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/70 focus:bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/70 focus:bg-background"
              />
            </div>
            {formType === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground/80">تکرار رمز عبور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background/70 focus:bg-background"
                />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading}>
              {isLoading ? <Loader2 className="ms-2 h-5 w-5 animate-spin" /> : (formType === 'login' ? 'ورود' : 'ثبت‌نام')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {formType === 'login' ? "حساب کاربری ندارید؟" : 'قبلاً حساب کاربری ایجاد کرده‌اید؟'}
            <Button variant="link" asChild className="text-accent hover:text-accent/80 px-1">
              <Link href={formType === 'login' ? '/register' : '/login'}>
                {formType === 'login' ? 'ثبت‌نام' : 'ورود'}
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
