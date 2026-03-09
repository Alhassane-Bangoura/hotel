import { create } from 'zustand';

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

interface HotelState {
    hotels: Hotel[];
    filteredHotels: Hotel[];
    searchQuery: string;
    loading: boolean;
    setHotels: (hotels: Hotel[]) => void;
    setSearchQuery: (query: string) => void;
    setLoading: (loading: boolean) => void;
    filterHotels: () => void;
}

export const useHotelStore = create<HotelState>((set, get) => ({
    hotels: [],
    filteredHotels: [],
    searchQuery: '',
    loading: false,
    setHotels: (hotels) => set({ hotels, filteredHotels: hotels }),
    setSearchQuery: (searchQuery) => {
        set({ searchQuery });
        get().filterHotels();
    },
    setLoading: (loading) => set({ loading }),
    filterHotels: () => {
        const { hotels, searchQuery } = get();
        const filtered = hotels.filter((hotel) =>
            hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        set({ filteredHotels: filtered });
    },
}));
