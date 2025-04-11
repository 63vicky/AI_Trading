'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleResendVerification = async () => {
    try {
      const email = getValues('email');
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification email');
      }

      toast.success('Verification email sent successfully');
    } catch {
      toast.error('Failed to resend verification email');
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      console.log('Submitting login form with:', { email: data.email });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (!response.ok) {
        if (result.error === 'Please verify your email first') {
          setShowResendLink(true);
          throw new Error('Please verify your email before logging in');
        }
        throw new Error(result.error || 'Login failed');
      }

      // Store the token in localStorage for debugging
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
      }
      // Set the user in the auth store
      setUser({
        id: result?.data.user._id,
        name: result?.data.user.name,
        email: result?.data.user.email,
      });

      toast.success('Login successful');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Invalid credentials'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {showResendLink && (
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Need a new verification email?{' '}
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Click here to resend
            </button>
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <div className="text-sm text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium underline underline-offset-4"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}
