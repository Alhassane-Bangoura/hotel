import { useAuthStore } from "@/store/useAuthStore";

export const authService = {
    login: async (email: string, password: string) => {
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
    
    register: async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const mockUser = {
            id: Math.random().toString(36).substring(7),
            email: data.email,
            name: data.fullName,
            role: 'user' as const,
        };
        useAuthStore.getState().setUser(mockUser);
        return { success: true, user: mockUser };
    },
    
    logout: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        useAuthStore.getState().logout();
    }
};
