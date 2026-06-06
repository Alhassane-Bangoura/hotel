import { supabase } from '@/lib/supabaseClient';
import { offlineService } from './offlineService';

export const hotelCommandService = {
    /**
     * Récupère l'état complet du Command Center (Unifié)
     */
    getUnifiedDashboard: async (hotelId: string) => {
        // Try to return cached data immediately for fast load
        const cached = offlineService.getCachedData(`dashboard_${hotelId}`);
        
        const today = new Date().toISOString().split('T')[0];

        // 1. Alertes actives
        const { data: alerts } = await supabase
            .from('hotel_alerts')
            .select('*')
            .eq('hotel_id', hotelId)
            .eq('is_resolved', false)
            .order('priority', { ascending: false });

        // 2. Flux d'activité récent
        const { data: activityFeed } = await supabase
            .from('hotel_activity_log')
            .select('*')
            .eq('hotel_id', hotelId)
            .order('created_at', { ascending: false })
            .limit(20);

        // 3. Opérations critiques (Check-ins/outs du jour)
        const { count: pendingCheckins } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('hotel_id', hotelId)
            .eq('check_in', today)
            .eq('operational_status', 'pending');

        const { count: dirtyRooms } = await supabase
            .from('rooms')
            .select('*', { count: 'exact', head: true })
            .eq('hotel_id', hotelId)
            .eq('housekeeping_status', 'dirty');

        const result = {
            alerts: alerts || [],
            activityFeed: activityFeed || [],
            criticalOps: {
                pendingCheckins: pendingCheckins || 0,
                dirtyRooms: dirtyRooms || 0
            }
        };

        // Save to cache for next time
        offlineService.cacheData(`dashboard_${hotelId}`, result);

        return result;
    },

    /**
     * Ajouter une alerte manuelle ou via système
     */
    createAlert: async (hotelId: string, type: string, message: string, priority: 'low' | 'medium' | 'high' | 'critical') => {
        const { data, error } = await supabase
            .from('hotel_alerts')
            .insert([{ hotel_id: hotelId, type, message, priority }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Résoudre une alerte
     */
    resolveAlert: async (alertId: string) => {
        const { error } = await supabase
            .from('hotel_alerts')
            .update({ is_resolved: true })
            .eq('id', alertId);

        if (error) throw error;
    }
};
