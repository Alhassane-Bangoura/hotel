import { supabase } from '@/lib/supabaseClient';

export const hotelOperationsService = {
    /**
     * Obtenir les opérations du jour (Arrivées, Départs, Nettoyage)
     */
    getDailyOperations: async (hotelId: string) => {
        const today = new Date().toISOString().split('T')[0];

        // 1. Arrivées (Check-ins aujourd'hui)
        const { data: arrivals } = await supabase
            .from('bookings')
            .select('*, profiles:user_id(name, phone), rooms(name)')
            .eq('hotel_id', hotelId)
            .eq('check_in', today)
            .neq('operational_status', 'checked_in');

        // 2. Départs (Check-outs aujourd'hui)
        const { data: departures } = await supabase
            .from('bookings')
            .select('*, profiles:user_id(name, phone), rooms(name)')
            .eq('hotel_id', hotelId)
            .eq('check_out', today)
            .eq('operational_status', 'checked_in');

        // 3. Statut Nettoyage des chambres
        const { data: housekeeping } = await supabase
            .from('rooms')
            .select('id, name, housekeeping_status, status')
            .eq('hotel_id', hotelId)
            .neq('housekeeping_status', 'clean');

        return {
            arrivals: arrivals || [],
            departures: departures || [],
            housekeeping: housekeeping || []
        };
    },

    /**
     * Gérer le Check-in / Check-out
     */
    updateOperationalStatus: async (bookingId: string, status: 'checked_in' | 'checked_out' | 'no_show') => {
        const { error } = await supabase
            .from('bookings')
            .update({ operational_status: status })
            .eq('id', bookingId);

        if (error) throw error;
    },

    /**
     * Mettre à jour le statut de nettoyage (Housekeeping)
     */
    updateHousekeepingStatus: async (roomId: string, status: 'clean' | 'dirty' | 'cleaning' | 'maintenance') => {
        const { error } = await supabase
            .from('rooms')
            .update({ housekeeping_status: status })
            .eq('id', roomId);

        if (error) throw error;
    },

    /**
     * Récupérer les données pour le calendrier (Plage de dates)
     */
    getCalendarData: async (hotelId: string, startDate: string, endDate: string) => {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, profiles:user_id(name), rooms(name, housekeeping_status)')
            .eq('hotel_id', hotelId)
            .gte('check_in', startDate)
            .lte('check_out', endDate);

        if (error) throw error;
        return bookings;
    }
};
