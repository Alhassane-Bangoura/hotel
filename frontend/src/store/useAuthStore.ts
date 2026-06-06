import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'client' | 'hotel' | 'organizer' | 'admin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            loading: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setLoading: (loading) => set({ loading }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'labe-booking-auth',
        }
    )
);
