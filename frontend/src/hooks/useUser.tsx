'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { authService } from '@/services/authService';
import { useAuthStore, User } from '@/store/useAuthStore';

interface UserContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { setUser, user: storeUser } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const profile = await authService.getProfile(session.user.id);
                    setUser(profile);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const profile = await authService.getProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser]);

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user: storeUser, loading, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
