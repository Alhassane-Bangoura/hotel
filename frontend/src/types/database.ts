export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Profile {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: 'client' | 'hotel' | 'organizer' | 'admin';
    created_at: string;
}

export interface Hotel {
    id: string;
    user_id: string;
    name: string;
    address: string | null;
    quartier: string | null;
    phone: string | null;
    description: string | null;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
}

export interface Room {
    id: string;
    hotel_id: string;
    name: string;
    type: string | null;
    price: number;
    capacity: number;
    description: string | null;
    status: 'available' | 'maintenance';
    created_at: string;
}

export interface Booking {
    id: string;
    user_id: string;
    room_id: string;
    event_id: string | null;
    check_in: string;
    check_out: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
}

export interface Payment {
    id: string;
    booking_id: string;
    method: 'orange_money' | 'mtn_money' | 'cash';
    transaction_reference: string | null;
    status: 'pending' | 'success' | 'failed';
    created_at: string;
}

export interface Event {
    id: string;
    name: string;
    type: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    created_at: string;
}
