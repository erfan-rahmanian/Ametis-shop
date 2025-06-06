"use client";

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [formIsLoading, setFormIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (email: string, password?: string) => {
    setFormIsLoading(true);
    try {
      // Removed API call delay
      login(email, password); // Password not used in current useAuth hook
      toast({
        title: "ورود موفقیت‌آمیز!",
        description: "به فروشگاه آمیتیست خوش آمدید.",
        className: "border-primary bg-primary text-primary-foreground",
      });
      // router.push('/'); // useEffect will handle this
    } catch (error: any) {
      toast({
        title: "ورود ناموفق",
        description: error.message || "خطایی غیرمنتظره رخ داد.",
        variant: "destructive",
      });
    } finally {
      setFormIsLoading(false);
    }
  };

  if (authIsLoading) {
     return <div className="flex justify-center items-center h-screen"><p>در حال بارگذاری...</p></div>;
  }
  
  if (isAuthenticated) {
    return null; // Or a redirecting message, though useEffect should handle it
  }

  return <AuthForm formType="login" onSubmit={handleLogin} isLoading={formIsLoading} />;
}
