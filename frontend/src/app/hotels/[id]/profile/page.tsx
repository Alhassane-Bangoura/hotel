'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
    MapPin, Phone, Star, ShieldCheck, 
    CheckCircle, MessageSquare, Coffee, Wifi,
    Wind, Utensils, Heart, Share2, ChevronRight,
    Loader2, Building2, Globe
} from 'lucide-react';
import { hotelService } from '@/services/hotelService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/useAuthStore';

export default function HotelPublicProfile() {
    const { id } = useParams();
    const [hotel, setHotel] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                // Fetch hotel details
                const { data } = await supabase.from('hotels').select('*').eq('id', id).single();
                setHotel(data);

                // Fetch available rooms
                const { data: roomsData } = await supabase.from('rooms').select('*').eq('hotel_id', id).eq('status', 'published');
                setRooms(roomsData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0f172a]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!hotel) return null;

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] font-jakarta">
            {/* Hero Section / Gallery */}
            <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
                <Image 
                    src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} 
                    alt={hotel.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-12 left-0 w-full px-6 lg:px-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6 max-w-3xl text-left">
                        <div className="flex items-center gap-4">
                            <span className="bg-primary text-[#1a2b4b] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                Établissement de luxe
                            </span>
                            {hotel.is_verified && (
                                <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Vérifié par la plateforme
                                </span>
                            )}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8]">
                            {hotel.name}
                        </h1>
                        <p className="text-white/60 font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-primary" /> {hotel.quartier}, {hotel.address || 'Guinée'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button className="rounded-2xl p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"><Heart className="h-5 w-5 text-white" /></Button>
                        <Button className="rounded-2xl p-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20"><Share2 className="h-5 w-5 text-white" /></Button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-20 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Left: Info & Rooms */}
                <div className="lg:col-span-8 space-y-20 text-left">
                    <section className="space-y-10">
                        <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight flex items-center gap-4">
                            À propos de l'établissement
                            <div className="h-1 bg-primary w-20 rounded-full" />
                        </h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                            "{hotel.description || "Un établissement d'exception au cœur de la ville, alliant confort moderne et hospitalité traditionnelle guinéenne."}"
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Wifi, label: 'Fibre Optique' },
                                { icon: Wind, label: 'Climatisation' },
                                { icon: Coffee, label: 'Petit-déjeuner' },
                                { icon: Utensils, label: 'Restaurant' },
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 group hover:border-primary/50 transition-all">
                                    <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-12">
                        <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Chambres Disponibles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {rooms.map((room) => (
                                <Card key={room.id} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 group">
                                    <div className="relative h-56 overflow-hidden">
                                        <Image src={room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80'} alt={room.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-6 left-6 bg-primary text-[#1a2b4b] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                            {room.category}
                                        </div>
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{room.name}</h4>
                                            <div className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                                                <Star className="h-3 w-3 text-primary fill-current" />
                                                <span className="text-[10px] font-black text-[#1a2b4b] dark:text-white">4.9</span>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-primary tracking-tighter">
                                            {room.price.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">GNF / nuit</span>
                                        </p>
                                        <Button 
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    router.push(`/login?redirect=${encodeURIComponent(`/bookings/new?id=${room.id}`)}`);
                                                } else {
                                                    router.push(`/bookings/new?id=${room.id}`);
                                                }
                                            }} 
                                            className="w-full py-6 bg-[#1a2b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-[#1a2b4b]/20"
                                        >
                                            Réserver
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Booking Summary / Contact */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] rounded-[3.5rem] p-10 bg-white dark:bg-slate-900 sticky top-28 text-left">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Building2 className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Contact Direct</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Réponse en moins de 10 min</p>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="text-sm font-black text-[#1a2b4b] dark:text-white">{hotel.phone || '+224 000 00 00'}</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="text-sm font-black text-[#1a2b4b] dark:text-white">Chat en direct actif</span>
                            </div>
                        </div>

                        <Button className="w-full py-8 bg-[#1a2b4b] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                            Contacter l'hôtel <ChevronRight className="h-5 w-5 text-primary" />
                        </Button>
                        
                        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-6">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                <span>Note Globale</span>
                                <span className="text-primary">4.9/5 (128 avis)</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                <span>Position</span>
                                <span className="text-[#1a2b4b] dark:text-white">Top 1% de la ville</span>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-primary p-10 rounded-[3.5rem] text-left relative overflow-hidden">
                        <Globe className="absolute -right-8 -bottom-8 h-40 w-40 text-[#1a2b4b] opacity-10" />
                        <h4 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter leading-none mb-6">Paiement <br />Garanti</h4>
                        <p className="text-[11px] font-black text-[#1a2b4b]/60 uppercase tracking-widest leading-relaxed">
                            "Réservez en toute confiance. Votre paiement est sécurisé et transféré à l'hôtel seulement après votre séjour."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
