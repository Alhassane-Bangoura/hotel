import { supabase } from '@/lib/supabaseClient';

export interface Booking {
    id: string;
    hotel_id: string;
    room_id: string;
    user_id: string;
    check_in: string;
    check_out: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    total_price: number;
    guests: number;
    hotel_name?: string;
    room_name?: string;
    payment_method?: string;
    created_at?: string;
}

export const bookingService = {
    /**
     * Crée une réservation avec une vérification stricte de disponibilité
     * et des validations de sécurité.
     */
    createBooking: async (bookingData: Omit<Booking, 'id'>) => {
        const now = new Date();
        const checkIn = new Date(bookingData.check_in);
        const checkOut = new Date(bookingData.check_out);

        // Validation 1: Dates cohérentes
        if (checkIn < now) {
            throw new Error('La date d\'arrivée ne peut pas être dans le passé.');
        }
        if (checkOut <= checkIn) {
            throw new Error('La date de départ doit être après la date d\'arrivée.');
        }

        // Validation 2: Vérification de l'utilisateur (Sécurité)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== bookingData.user_id) {
            throw new Error('Action non autorisée.');
        }

        // Validation 3: Anti-collision (Disponibilité réelle)
        const { data: conflicts, error: conflictError } = await supabase
            .from('bookings')
            .select('id')
            .eq('room_id', bookingData.room_id)
            .neq('status', 'cancelled')
            .filter('check_in', 'lt', bookingData.check_out)
            .filter('check_out', 'gt', bookingData.check_in);

        if (conflictError) throw conflictError;
        
        if (conflicts && conflicts.length > 0) {
            throw new Error('Désolé, cette chambre a été réservée entre-temps par un autre voyageur.');
        }

        // Validation 4: Vérification du prix côté serveur
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('price')
            .eq('id', bookingData.room_id)
            .single();

        if (roomError || !room) throw new Error('Chambre introuvable.');
        
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        const expectedPrice = room.price * nights;
        
        if (Math.abs(bookingData.total_price - expectedPrice) > 10) {
            throw new Error('Erreur de calcul du montant total. Veuillez réessayer.');
        }

        // 5. Insertion
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                ...bookingData,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // --- Notification à l'admin/propriétaire de l'hôtel ---
        try {
            const { data: hotelData } = await supabase
                .from('hotels')
                .select('user_id, name')
                .eq('id', bookingData.hotel_id)
                .single();
                
            if (hotelData && hotelData.user_id) {
                const { notificationService } = await import('./notificationService');
                await notificationService.notify({
                    user_id: hotelData.user_id,
                    title: 'Nouvelle Réservation',
                    message: `Nouvelle réservation reçue pour ${hotelData.name} (${bookingData.guests} personnes).`,
                    type: 'booking_confirmed'
                });
            }
        } catch (notifErr) {
            console.error("Erreur d'envoi de notification au propriétaire:", notifErr);
        }

        return data;
    },
    
    getUserBookings: async (userId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, hotels(name), rooms(name)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return data.map(b => ({
            id: b.id,
            hotel_name: b.hotels?.name,
            room_name: b.rooms?.name,
            check_in: b.check_in,
            check_out: b.check_out,
            status: b.status,
            total_price: b.total_price,
            guests: b.guests,
            created_at: b.created_at
        }));
    },

    getHotelBookings: async (hotelId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, profiles(name, email), rooms(name)')
            .eq('hotel_id', hotelId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId);

        if (error) throw error;
    },

    cancelBooking: async (bookingId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Non authentifié.');

        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)
            .eq('user_id', user.id);

        if (error) throw error;
    }
};
