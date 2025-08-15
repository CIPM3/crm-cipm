import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for our store
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  
  // Cache control
  lastFetch: Record<string, number>;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateLastFetch: (key: string) => void;
  shouldRefetch: (key: string, cacheTime?: number) => boolean;
  logout: () => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastFetch: {},
        
        // Actions
        setUser: (user) => set({ user }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        updateLastFetch: (key) => 
          set((state) => ({ 
            lastFetch: { ...state.lastFetch, [key]: Date.now() } 
          })),
        
        shouldRefetch: (key, cacheTime = 5 * 60 * 1000) => { // 5 minutes default
          const lastFetch = get().lastFetch[key];
          if (!lastFetch) return true;
          return Date.now() - lastFetch > cacheTime;
        },
        
        logout: () => set({ 
          user: null, 
          isAuthenticated: false,
          lastFetch: {} // Clear cache on logout
        }),
      }),
      {
        name: 'crm-storage',
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'crm-store',
    }
  )
);