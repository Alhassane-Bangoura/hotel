'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    Building2, MapPin, Star, ShieldCheck, 
    ArrowRight, Loader2, Search, Coffee, Wifi, Wind
} from 'lucide-react';
import { hotelService, Hotel } from '@/services/hotelService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function PartnersListPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                // Fetch verified hotels
                const data = await hotelService.getHotels();
                setHotels(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const filteredHotels = hotels.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0f172a]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] font-jakarta pt-20 md:pt-28 pb-20">
            {/* Hero Section */}
            <div className="bg-[#1a2b4b] dark:bg-slate-950 text-white py-16 px-6 lg:px-20 relative overflow-hidden mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto space-y-6 text-left relative z-10">
                    <span className="bg-primary text-[#1a2b4b] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        Établissements Enregistrés
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        Hôtels à <br /><span className="text-primary italic">Labé</span>
                    </h1>
                    <p className="text-white/60 max-w-2xl font-medium text-sm md:text-base italic">
                        "Parcourez tous les hôtels publiés par les propriétaires à Labé, vérifiés pour votre séjour."
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-20 space-y-12">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un hôtel, un quartier..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 text-sm font-bold shadow-xl shadow-black/5 placeholder:italic placeholder:font-medium"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHotels.map((hotel) => (
                        <Card key={hotel.id} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                            <div>
                                {/* Cover Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image 
                                        src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} 
                                        alt={hotel.name} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    {hotel.is_verified && (
                                        <div className="absolute top-6 left-6 bg-primary text-[#1a2b4b] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 border border-primary/20">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Établissement Vérifié
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <CardContent className="p-8 space-y-6 text-left">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                                            {hotel.name}
                                        </h3>
                                        <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                                            <Star className="h-3 w-3 text-primary fill-current" />
                                            <span className="text-[10px] font-black text-[#1a2b4b] dark:text-white">4.8</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> {hotel.location}, {hotel.city}
                                    </p>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic line-clamp-3 leading-relaxed">
                                        "{hotel.description || 'Un cadre exceptionnel et paisible vous accueillant chaleureusement à Labé.'}"
                                    </p>

                                    <div className="flex gap-2 pt-2">
                                        {hotel.amenities?.slice(0, 3).map((amenity, i) => (
                                            <span key={i} className="bg-[#f8f7f5] dark:bg-slate-800 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                                {amenity.toLowerCase().includes('wifi') && <Wifi className="h-3 w-3 text-primary" />}
                                                {amenity.toLowerCase().includes('clim') && <Wind className="h-3 w-3 text-primary" />}
                                                {amenity.toLowerCase().includes('dej') && <Coffee className="h-3 w-3 text-primary" />}
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </div>

                            {/* Discover Button */}
                            <div className="p-8 pt-0 w-full">
                                <Button 
                                    onClick={() => router.push(`/hotels/${hotel.id}/profile`)} 
                                    className="w-full py-6 bg-[#1a2b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-[#1a2b4b]/20 flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-[#1a2b4b] transition-all"
                                >
                                    Découvrir l'établissement <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {filteredHotels.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Aucun hôtel ne correspond à votre recherche.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
