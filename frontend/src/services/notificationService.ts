import { supabase } from '@/lib/supabaseClient';

export type NotificationType = 
    | 'booking_confirmed' 
    | 'booking_cancelled' 
    | 'booking_reminder' 
    | 'hotel_verified' 
    | 'onboarding_approved' 
    | 'incident_alert'
    | 'system';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    link?: string;
    created_at: string;
}

export const notificationService = {
    // Create a notification
    notify: async (notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('notifications')
            .insert([notification])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get notifications for current user
    getUserNotifications: async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Notification[];
    },

    // Mark as read
    markAsRead: async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
    },

    // Delete notification
    delete: async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Real-time subscription
    subscribeToNotifications: (userId: string, onNotification: (payload: any) => void) => {
        return supabase
            .channel(`public:notifications:user_id=eq.${userId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, onNotification)
            .subscribe();
    }
};
