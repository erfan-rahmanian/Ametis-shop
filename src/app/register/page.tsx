"use client";

import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [formIsLoading, setFormIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (email: string, password?: string) => {
    setFormIsLoading(true);
    try {
      // Simulate API call delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      register(email, password); // Password not used in current useAuth hook
      toast({
        title: "Registration Successful!",
        description: "Welcome to Amethyst Shop! You are now logged in.",
         className: "border-primary bg-primary text-primary-foreground",
      });
      // router.push('/'); // useEffect will handle this
    } catch (error: any) {
       toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
       setFormIsLoading(false);
    }
  };
  
  if (authIsLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (isAuthenticated) {
    return null; 
  }

  return <AuthForm formType="register" onSubmit={handleRegister} isLoading={formIsLoading} />;
}
