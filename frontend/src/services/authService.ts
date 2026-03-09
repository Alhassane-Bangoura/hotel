import { useAuthStore } from "@/store/useAuthStore";

export const authService = {
    signIn: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock login
        if (email && password) {
            const mockUser = {
                id: '1',
                email,
                name: email.split('@')[0],
                role: 'user' as const,
            };
            useAuthStore.getState().setUser(mockUser);
            return { success: true, user: mockUser };
        }
        return { success: false, error: 'Identifiants invalides' };
    },
    
    signUp: async (email: string, password: string, name: string, role: string) => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const mockUser = {
            id: Math.random().toString(36).substring(7),
            email: email,
            name: name,
            phone: null,
            role: (['client', 'hotel', 'organizer', 'admin'].includes(role) ? role : 'client') as any,
            created_at: new Date().toISOString()
        };
        useAuthStore.getState().setUser(mockUser as any);
        return { success: true, user: mockUser };
    },
    
    signOut: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        useAuthStore.getState().logout();
    },
    
    getUserProfile: async (id: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            id,
            email: 'user@example.com',
            name: 'Nom Utilisateur',
            phone: null,
            role: 'client' as const,
            created_at: new Date().toISOString()
        };
    }
};
