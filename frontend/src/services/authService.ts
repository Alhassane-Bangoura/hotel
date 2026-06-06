import { supabase } from '@/lib/supabaseClient';
import { User, UserRole } from '@/store/useAuthStore';

export const authService = {
    signUp: async (email: string, password: string, fullName: string, role: UserRole = 'client') => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: fullName,
                    role: role
                }
            }
        });

        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: authData.user.id,
                    name: fullName,
                    email: email,
                    role: role
                });

            if (profileError) throw profileError;
        }

        return authData;
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) throw profileError;

        return {
            user: data.user,
            profile: profile as User
        };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    getProfile: async (userId: string): Promise<User | null> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
            avatar: data.avatar_url,
            phone: data.phone
        };
    },

    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;
        return authService.getProfile(user.id);
    },

    updateProfile: async (userId: string, updates: Partial<User>) => {
        const { error } = await supabase
            .from('profiles')
            .update({
                name: updates.name,
                phone: updates.phone,
                avatar_url: updates.avatar
            })
            .eq('id', userId);

        if (error) throw error;
    }
};
