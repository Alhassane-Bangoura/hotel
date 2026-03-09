export interface Booking {
    id: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    totalPrice: number;
    guests?: number;
}

export const bookingService = {
    createBooking: async (bookingData: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Mock booking creation
        console.log('Booking created:', bookingData);
        return { 
            success: true, 
            bookingId: 'RES-' + Math.floor(100000 + Math.random() * 900000)
        };
    },
    
    getUserBookings: async (userId: string): Promise<Booking[]> => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [
            {
                id: 'RES-102938',
                hotelName: 'Hôtel Labé Luxury Resort',
                checkIn: '2024-07-12',
                checkOut: '2024-07-15',
                status: 'confirmed',
                totalPrice: 1260000,
                guests: 2
            },
            {
                id: 'RES-882731',
                hotelName: 'Résidence Fouta',
                checkIn: '2024-08-01',
                checkOut: '2024-08-03',
                status: 'pending',
                totalPrice: 450000,
                guests: 1
            },
            {
                id: 'RES-552617',
                hotelName: 'Hôtel Tata',
                checkIn: '2024-06-15',
                checkOut: '2024-06-16',
                status: 'cancelled',
                totalPrice: 320000,
                guests: 2
            }
        ];
    }
};
