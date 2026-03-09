'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomGallery } from '@/components/RoomGallery';
import { BookingCard } from '@/components/BookingCard';
import { ReviewList } from '@/components/ReviewList';
import { hotelService, Hotel } from '@/services/hotelService';
import { ChevronRight, MapPin, Users, Bed, Wind, Eye, Wifi, Thermometer, Tv, Coffee, Wine, ArrowRight, Hotel as HotelIcon, Loader2, Sparkles } from 'lucide-react';

export default function RoomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [room, setRoom] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            if (params.id) {
                setLoading(true);
                const data = await hotelService.getHotelById(params.id as string);
                setRoom(data || null);
                setLoading(false);
            }
        };
        fetchRoom();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827] flex flex-col items-center justify-center gap-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="relative"
                >
                    <Loader2 className="h-16 w-16 text-primary" />
                    <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
                </motion.div>
                <p className="font-black text-[#1a2b4b] dark:text-slate-400 uppercase tracking-[0.3em] text-[10px]">Préparation de votre suite de luxe...</p>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827] flex flex-col items-center justify-center gap-8">
                <h1 className="text-4xl font-black text-[#1a2b4b]">Hôtel introuvable</h1>
                <button 
                    onClick={() => router.push('/hotels')}
                    className="px-8 py-4 bg-primary text-[#1a2b4b] font-black rounded-2xl uppercase tracking-widest text-xs"
                >
                    Retour à la liste
                </button>
            </div>
        );
    }

    const amenitiesMap: Record<string, any> = {
        'WiFi': { icon: Wifi, label: 'WiFi haut débit' },
        'Eau Chaude': { icon: Thermometer, label: 'Eau chaude' },
        'Petit-déjeuner': { icon: Coffee, label: 'Petit-déjeuner offert' },
        'TV': { icon: Tv, label: 'TV Satellite 4K' },
        'Clim': { icon: Wind, label: 'Climatisation' },
        'Mini-bar': { icon: Wine, label: 'Mini-bar' }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827]">
            <main className="max-w-7xl mx-auto px-6 lg:px-20 py-12 w-full">
                {/* Breadcrumbs */}
                <motion.nav 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-10"
                >
                    <span onClick={() => router.push('/')} className="hover:text-primary cursor-pointer transition-colors">Guinée</span>
                    <ChevronRight className="h-3 w-3" />
                    <span onClick={() => router.push('/hotels')} className="hover:text-primary cursor-pointer transition-colors">Labé</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#1a2b4b] dark:text-slate-200">{room.name}</span>
                </motion.nav>

                <RoomGallery images={[room.image]} remaining={3} />

                {/* Header Section */}
                <section className="mb-16 mt-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                Best-seller à Labé
                            </span>
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <Sparkles key={i} className={`h-4 w-4 ${i < Math.floor(room.rating) ? 'fill-current' : 'opacity-30'}`} />
                                ))}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#1a2b4b] dark:text-white leading-[0.9] tracking-tighter uppercase max-w-4xl">
                            {room.name} <br />
                            <span className="text-primary text-4xl md:text-5xl">@ {room.location.split(',')[0]}</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase tracking-widest">
                                <MapPin className="h-5 w-5 text-primary" />
                                {room.location}
                            </div>
                            <button className="text-[10px] font-black text-[#1a2b4b] dark:text-white border-b-4 border-primary pb-1 hover:pb-2 transition-all uppercase tracking-widest">
                                Voir sur la carte haute définition
                            </button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: Users, label: '2 Adultes' },
                            { icon: Bed, label: '1 Lit King Size' },
                            { icon: Wind, label: 'Air Conditionné' },
                            { icon: Eye, label: 'Vue Panoramique' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col gap-4 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-black/5 group hover:border-primary transition-colors">
                                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-6 w-6 text-primary" />
                                </div>
                                <span className="font-black text-[10px] uppercase tracking-widest text-[#1a2b4b] dark:text-slate-200">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-8 space-y-24">
                        {/* Description */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white flex items-center gap-6 uppercase tracking-tight">
                                <span className="w-3 h-12 bg-primary rounded-full"></span>
                                Immersion Totale
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-[1.6] font-medium italic">
                                "{room.description || "Une expérience unique combinant le charme traditionnel et le luxe moderne au coeur de la cité de Karamoko Alpha Mo Labé."}"
                            </p>
                        </motion.div>

                        {/* Amenities */}
                        <div className="space-y-12">
                            <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white flex items-center gap-6 uppercase tracking-tight">
                                <span className="w-3 h-12 bg-primary rounded-full"></span>
                                Services Exclusifs
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                {room.amenities.map((amenity, i) => {
                                    const info = Object.entries(amenitiesMap).find(([key]) => amenity.toLowerCase().includes(key.toLowerCase()))?.[1] || { icon: Sparkles, label: amenity };
                                    return (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ x: 10 }}
                                            className="flex items-center gap-5 group cursor-default"
                                        >
                                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl group-hover:bg-primary transition-colors">
                                                <info.icon className="h-6 w-6 text-slate-400 group-hover:text-[#1a2b4b] transition-colors" />
                                            </div>
                                            <span className="text-xs font-black text-[#1a2b4b] dark:text-slate-300 uppercase tracking-widest">{info.label}</span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* About Hotel */}
                        <div className="p-12 bg-[#1a2b4b] rounded-[3.5rem] flex flex-col md:flex-row gap-12 items-center text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 opacity-10 blur-2xl pointer-events-none">
                                <HotelIcon className="size-64 text-white" />
                            </div>
                            <div className="size-32 rounded-[2rem] bg-primary flex items-center justify-center shrink-0 shadow-2xl shadow-primary/40 rotate-3 group-hover:rotate-0 transition-transform">
                                <HotelIcon className="h-16 w-16 text-[#1a2b4b]" />
                            </div>
                            <div className="space-y-6 text-center md:text-left relative z-10">
                                <div>
                                    <h4 className="text-3xl font-black uppercase tracking-tight">L'Héritage Labéen</h4>
                                    <p className="text-slate-400 mt-4 leading-relaxed font-medium">Reconnu comme l'un des fleurons de l'hôtellerie en Moyenne Guinée, notre établissement s'engage à vous offrir une hospitalité authentique et raffinée.</p>
                                </div>
                                <button className="text-primary font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 group mx-auto md:mx-0">
                                    Découvrir l'univers de l'hôtel
                                    <div className="bg-primary/10 p-2 rounded-full group-hover:translate-x-3 transition-transform">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Guest Reviews */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-20">
                            <ReviewList hotelId={room.id} />
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-4 sticky top-12">
                        <BookingCard price={room.price} hotelName={room.name} />
                    </div>
                </div>
            </main>
        </div>
    );
}
