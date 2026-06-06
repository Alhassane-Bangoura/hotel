import { supabase } from '@/lib/supabaseClient';

export const favoriteService = {
    // Add to favorites
    toggleFavorite: async (hotelId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Authentification requise');

        // Check if exists
        const { data: existing } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('hotel_id', hotelId)
            .single();

        if (existing) {
            // Remove
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', existing.id);
            if (error) throw error;
            return false;
        } else {
            // Add
            const { error } = await supabase
                .from('favorites')
                .insert([{ user_id: user.id, hotel_id: hotelId }]);
            if (error) throw error;
            return true;
        }
    },

    // Get user favorites
    getUserFavorites: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('favorites')
            .select('*, hotels(*)')
            .eq('user_id', user.id);

        if (error) throw error;
        return data.map(f => f.hotels);
    },

    // Check if hotel is favorite
    isFavorite: async (hotelId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('hotel_id', hotelId)
            .single();

        return !!data;
    }
};
