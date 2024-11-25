import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  validateCredentials: (email: string, password: string) => { message: string }[];
  verifyEmail: (token: string) => Promise<void>;
}

const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Mock user data - in a real app, this would come from a database
const MOCK_USERS = [
  {
    id: 'admin',
    email: 'admin@janovian.com',
    password: 'admin123!@#',
    name: 'Admin User',
    role: 'admin' as const,
    emailVerified: true,
  },
  {
    id: 'nastya',
    email: 'nastya@janovian.com',
    password: 'Nastya123!',
    name: 'Nastya',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'gleb',
    email: 'gleb@janovian.com',
    password: 'Gleb123!',
    name: 'Gleb',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'slava',
    email: 'slava@janovian.com',
    password: 'Slava123!',
    name: 'Slava',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'ariadna',
    email: 'ariadna@janovian.com',
    password: 'Ariadna123!',
    name: 'Ariadna',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'david',
    email: 'david@janovian.com',
    password: 'David123!',
    name: 'David',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'simon',
    email: 'simon@janovian.com',
    password: 'Simon123!',
    name: 'Simon',
    role: 'user' as const,
    emailVerified: true,
  },
  {
    id: 'vladimir',
    email: 'vladimir@janovian.com',
    password: 'Vladimir123!',
    name: 'Vladimir',
    role: 'user' as const,
    emailVerified: true,
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      validateCredentials: (email: string, password: string) => {
        try {
          credentialsSchema.parse({ email, password });
          return [];
        } catch (error) {
          if (error instanceof z.ZodError) {
            return error.errors.map(err => ({ message: err.message }));
          }
          return [{ message: 'Invalid credentials' }];
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

          const user = MOCK_USERS.find(u => u.email === email && u.password === password);

          if (!user) {
            throw new Error('Invalid email or password');
          }

          if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in');
          }

          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              emailVerified: user.emailVerified,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

          if (MOCK_USERS.some(u => u.email === email)) {
            throw new Error('Email already registered');
          }

          // In a real app, you would create the user in your database
          // For now, we'll just simulate success
          set({ isLoading: false, error: null });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        return Promise.resolve();
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);