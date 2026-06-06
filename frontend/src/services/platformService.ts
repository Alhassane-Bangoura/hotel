import { supabase } from '@/lib/supabaseClient';

export const platformService = {
    // Global Stats for Super Admin
    getGlobalStats: async () => {
        const { data: hotels, count: hotelsCount } = await supabase
            .from('hotels')
            .select('*', { count: 'exact', head: true });

        const { data: bookings, count: bookingsCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });

        const { data: users, count: usersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { data: revenue } = await supabase
            .from('bookings')
            .select('total_price')
            .eq('status', 'confirmed');

        const totalRevenue = revenue?.reduce((acc, b) => acc + Number(b.total_price), 0) || 0;

        return {
            totalHotels: hotelsCount || 0,
            totalBookings: bookingsCount || 0,
            totalUsers: usersCount || 0,
            totalRevenue
        };
    },

    // Hotel Verification
    getPendingHotels: async () => {
        const { data, error } = await supabase
            .from('hotels')
            .select('*, profiles(name, email)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    verifyHotel: async (hotelId: string, status: 'active' | 'suspended', rejectionReason?: string) => {
        const { error } = await supabase
            .from('hotels')
            .update({ 
                status, 
                is_verified: status === 'active',
                rejection_reason: rejectionReason 
            })
            .eq('id', hotelId);

        if (error) throw error;

        // Log the action
        await platformService.logAction({
            action: `hotel_verification_${status}`,
            resource_type: 'hotel',
            resource_id: hotelId,
            details: { rejectionReason }
        });
    },

    // Audit Logging
    logAction: async (log: { action: string, resource_type: string, resource_id?: string, details?: any, severity?: 'info' | 'warning' | 'critical' }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('audit_logs').insert([{
            user_id: user.id,
            ...log
        }]);
    },

    getRecentActivity: async (limit = 10) => {
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*, profiles(name)')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data;
    },

    // National Scalability: Cities & Regions
    getRegionsWithCities: async () => {
        const { data, error } = await supabase
            .from('regions')
            .select('*, cities(*)');

        if (error) throw error;
        return data;
    },

    // Incident Management
    getIncidents: async () => {
        const { data, error } = await supabase
            .from('incidents')
            .select('*, hotels(name), profiles(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
