import { supabase } from '@/lib/supabaseClient';

export interface Hotel {
    id: string;
    name: string;
    location: string;
    city: string;
    price: number;
    rating: number;
    image: string;
    description: string;
    amenities: string[];
    user_id?: string;
    is_verified?: boolean;
}

export interface Room {
    id: string;
    hotel_id: string;
    name: string;
    description: string;
    price: number;
    amenities: string[];
    image_url: string;
    capacity: number;
}

export const hotelService = {
    getHotels: async (city?: string) => {
        let query = supabase
            .from('hotels')
            .select('*')
            .eq('is_verified', true);
        
        if (city && city !== 'Toutes les villes') {
            query = query.ilike('city', `%${city}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        return data.map(h => ({
            id: h.id,
            name: h.name,
            location: h.location,
            city: h.city,
            price: h.price || 0, // Fallback if no rooms yet
            rating: h.rating,
            image: h.image_url,
            description: h.description,
            amenities: h.amenities || []
        })) as Hotel[];
    },

    getHotelById: async (id: string) => {
        const { data, error } = await supabase
            .from('hotels')
            .select('*, rooms(*)')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            location: data.location,
            city: data.city,
            price: data.rooms?.[0]?.price || 0,
            rating: data.rating,
            image: data.image_url,
            description: data.description,
            amenities: data.amenities || [],
            rooms: data.rooms as Room[]
        };
    },

    getHotelRooms: async (hotelId: string) => {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('hotel_id', hotelId);

        if (error) throw error;
        return data as Room[];
    },

    getManagedHotel: async (ownerId: string) => {
        const { data, error } = await supabase
            .from('hotels')
            .select('*, rooms(*)')
            .eq('user_id', ownerId)
            .single();

        if (error) return null;
        return data;
    },

    getHotelStats: async (hotelId: string) => {
        const { data: bookings, error: bError } = await supabase
            .from('bookings')
            .select('total_price, status')
            .eq('hotel_id', hotelId);

        if (bError) throw bError;

        const totalRevenue = bookings
            ?.filter(b => b.status !== 'cancelled')
            .reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;
        
        const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0;
        const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;

        return {
            totalRevenue,
            confirmedCount,
            pendingCount,
            totalBookings: bookings?.length || 0
        };
    },

    getRoomById: async (id: string) => {
        const { data, error } = await supabase
            .from('rooms')
            .select('*, hotels(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as any;
    },

    getFeaturedHotels: async () => {
        const { data, error } = await supabase
            .from('hotels')
            .select('*')
            .eq('is_verified', true)
            .limit(6);

        if (error) throw error;
        return data.map(h => ({
            id: h.id,
            name: h.name,
            location: h.location,
            city: h.city,
            price: h.price || 0,
            rating: h.rating,
            image: h.image_url,
            description: h.description,
            amenities: h.amenities || []
        })) as Hotel[];
    }
};
