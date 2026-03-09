import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'hotel';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null, // Default to null, will be populated by authService
    isAuthenticated: false,
    loading: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setLoading: (loading) => set({ loading }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
