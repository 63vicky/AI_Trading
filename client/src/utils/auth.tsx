import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type WithAuthProps = Record<string, unknown>;

// Higher-order component for protected routes
export function withAuth<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuth: React.FC<P> = (props) => {
    const { user, loading, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const checkAuthentication = async () => {
        await checkAuth();
        if (!loading && !user) {
          console.log('🔒 Redirecting to login - not authenticated');
          router.push('/login');
        }
      };

      checkAuthentication();
    }, [user, loading, checkAuth, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}

// Higher-order component for verified users only
export function withVerified<P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithVerified: React.FC<P> = (props) => {
    const { user, loading, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const checkVerification = async () => {
        await checkAuth();
        if (!loading && (!user || !user.isVerified)) {
          console.log('⚠️ Redirecting to verify email - not verified');
          router.push('/verify-email');
        }
      };

      checkVerification();
    }, [user, loading, checkAuth, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user || !user.isVerified) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithVerified;
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    return response.ok;
  } catch (error) {
    console.error('💥 Auth check error:', error);
    return false;
  }
}

// Utility function to check if user is verified
export async function isVerified(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    const data = await response.json();
    return response.ok && data.data.user.isVerified;
  } catch (error) {
    console.error('💥 Verification check error:', error);
    return false;
  }
}
