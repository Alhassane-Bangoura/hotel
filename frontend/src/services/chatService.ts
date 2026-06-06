import { supabase } from '@/lib/supabaseClient';

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    type: 'text' | 'voice' | 'image' | 'file' | 'call_log';
    media_url?: string;
    metadata?: any;
    is_read: boolean;
    created_at: string;
}

export const chatService = {
    // Get or Create Conversation for a Booking
    getOrCreateConversation: async (bookingId: string, clientId: string, hotelId: string) => {
        // 1. Try to find existing
        const { data: existing, error: findError } = await supabase
            .from('conversations')
            .select('*')
            .eq('booking_id', bookingId)
            .single();

        if (existing) return existing;

        // 2. Create new if doesn't exist
        const { data, error } = await supabase
            .from('conversations')
            .insert([{
                booking_id: bookingId,
                client_id: clientId,
                hotel_id: hotelId
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get Messages
    getMessages: async (conversationId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    // Send Message
    sendMessage: async (message: Omit<ChatMessage, 'id' | 'created_at' | 'is_read'>) => {
        const { data, error } = await supabase
            .from('messages')
            .insert([message])
            .select()
            .single();

        if (error) throw error;

        // Update conversation last_message_at
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', message.conversation_id);

        return data;
    },

    // Upload Media (Voice/Image)
    uploadMedia: async (file: File, type: 'voice' | 'image') => {
        const bucket = type === 'voice' ? 'chat_voice' : 'chat_media';
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `chat/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    },

    // Mark as Read
    markAsRead: async (conversationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id);

        if (error) throw error;
    },

    // Real-time Subscription
    subscribeToMessages: (conversationId: string, onNewMessage: (payload: any) => void) => {
        return supabase
            .channel(`conversation:${conversationId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, onNewMessage)
            .subscribe();
    }
};
