export interface Hotel {
    id: string;
    name: string;
    location: string;
    price: number;
    rating: number;
    image: string;
    description: string;
    amenities: string[];
}

// Mock data for initial implementation
export const MOCK_HOTELS = [
    {
        id: '1',
        name: 'Hôtel Labé Luxury Resort',
        location: 'Quartier Tata, Labé',
        price: 450000,
        rating: 4.8,
        image: '/hotel_building_split_1772792915358.png',
        description: 'Le plus prestigieux complexe hôtelier de la région du Fouta Djallon.',
        amenities: ['WiFi', 'Piscine', 'Restaurant', 'Parking'],
    },
    {
        id: '2',
        name: 'Hôtel de la Poste',
        location: 'Centre-ville, Labé',
        price: 250000,
        rating: 4.2,
        image: '/hero_hotel_bg_1772792881651.png',
        description: 'Un charme authentique au coeur de la ville de Labé.',
        amenities: ['WiFi', 'Restaurant', 'Bar'],
    },
    {
        id: '3',
        name: 'Tata Luxury Lodge',
        location: 'Tata Nord, Labé',
        price: 600000,
        rating: 4.9,
        image: '/room_suite_diplomatique_1772792992712.png',
        description: 'Calme et sérénité pour vos séjours professionnels ou en famille.',
        amenities: ['WiFi', 'Climatisation', 'Navette Aéroport'],
    }
];

export const hotelService = {
    getHotels: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_HOTELS;
    },
    getHotelById: async (id: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_HOTELS.find((h) => h.id === id) || null;
    }
};
