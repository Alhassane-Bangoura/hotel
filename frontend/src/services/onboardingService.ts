import { supabase } from '@/lib/supabaseClient';

export const onboardingService = {
    // Step 1: Create Hotel Draft
    createHotelDraft: async (hotelData: any) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Non authentifié');

        const { data, error } = await supabase
            .from('hotels')
            .insert([{
                user_id: user.id,
                ...hotelData,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Step 2: Add Rooms
    addRooms: async (hotelId: string, rooms: any[]) => {
        const roomsWithHotelId = rooms.map(room => ({
            hotel_id: hotelId,
            ...room
        }));

        const { data, error } = await supabase
            .from('rooms')
            .insert(roomsWithHotelId)
            .select();

        if (error) throw error;
        return data;
    },

    // Step 3: Finalize Onboarding
    finalizeOnboarding: async (hotelId: string, documents: string[]) => {
        const { error } = await supabase
            .from('hotels')
            .update({ 
                documents_url: documents,
                status: 'pending' // Still pending until super_admin approves
            })
            .eq('id', hotelId);

        if (error) throw error;
    }
};
