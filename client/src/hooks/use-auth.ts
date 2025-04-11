import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        // Force a state update to ensure the UI reflects the changes
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },
      signOut: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
      // Add partialize to only persist the user data
      partialize: (state) => ({ user: state.user }),
    }
  )
);
