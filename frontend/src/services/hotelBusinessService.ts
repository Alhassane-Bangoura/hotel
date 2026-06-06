import { supabase } from '@/lib/supabaseClient';

export const hotelBusinessService = {
    /**
     * Statistiques Business pour le Dashboard Hôtel
     */
    getDashboardStats: async (hotelId: string) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        
        // 1. Revenus totaux (via RPC si défini ou agrégation)
        const { data: revenueData } = await supabase
            .from('bookings')
            .select('total_price')
            .eq('hotel_id', hotelId)
            .eq('status', 'confirmed');
        
        const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

        // 2. Taux d'occupation (Chambres réservées aujourd'hui / Total chambres)
        const { count: totalRooms } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true })
            .eq('hotel_id', hotelId)
            .eq('status', 'published');

        const { count: bookedRooms } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('hotel_id', hotelId)
            .in('operational_status', ['pending', 'checked_in'])
            .lte('check_in', now.toISOString().split('T')[0])
            .gte('check_out', now.toISOString().split('T')[0]);

        const occupancyRate = totalRooms ? ((bookedRooms || 0) / totalRooms) * 100 : 0;

        // 3. Chambres à nettoyer
        const { count: dirtyRooms } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true })
            .eq('hotel_id', hotelId)
            .eq('housekeeping_status', 'dirty');

        // 4. Réservations récentes avec profils clients
        const { data: recentBookings } = await supabase
            .from('bookings')
            .select('*, profiles:user_id(name, email, phone), rooms(name)')
            .eq('hotel_id', hotelId)
            .order('created_at', { ascending: false })
            .limit(10);

        return {
            totalRevenue,
            occupancyRate,
            activeRooms: totalRooms || 0,
            dirtyRooms: dirtyRooms || 0,
            recentBookings
        };
    },

    /**
     * Gestion Professionnelle des Chambres
     */
    publishRoom: async (roomData: any) => {
        const { data, error } = await supabase
            .from('rooms')
            .insert([{
                ...roomData,
                status: 'published'
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateRoomStatus: async (roomId: string, status: 'draft' | 'published' | 'suspended' | 'maintenance') => {
        const { error } = await supabase
            .from('rooms')
            .update({ status })
            .eq('id', roomId);

        if (error) throw error;
    },

    /**
     * Gestion Clients (CRM simplifié)
     */
    getHotelClients: async (hotelId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('user_id, profiles:user_id(id, name, email, phone, created_at)')
            .eq('hotel_id', hotelId);

        if (error) throw error;

        // Déduplication des clients
        const uniqueClientsMap = new Map();
        data.forEach(item => {
            if (item.profiles) {
                uniqueClientsMap.set(item.user_id, item.profiles);
            }
        });

        return Array.from(uniqueClientsMap.values());
    }
};
