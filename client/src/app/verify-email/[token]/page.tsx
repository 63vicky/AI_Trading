'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verifying your email...');
  const { token } = use(params);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/verify-email/${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Email verified successfully! You can now login.');
      } catch {
        setStatus('error');
        setMessage(
          'Invalid or expired verification link. Please try registering again.'
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          )}
          {status === 'success' && (
            <div className="text-green-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="text-red-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900">
            {status === 'loading'
              ? 'Verifying Email'
              : status === 'success'
              ? 'Email Verified'
              : 'Verification Failed'}
          </h2>
          <p className="text-center text-gray-600">{message}</p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            {status === 'success' ? 'Go to Login' : 'Try Again'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
