'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomGallery } from '@/components/RoomGallery';
import Image from 'next/image';
import { BookingCard } from '@/components/BookingCard';
import { ReviewList } from '@/components/ReviewList';
import { hotelService, Hotel } from '@/services/hotelService';
import { ChevronRight, MapPin, Users, Bed, Wind, Eye, Wifi, Thermometer, Tv, Coffee, Wine, ArrowRight, Hotel as HotelIcon, Loader2, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function RoomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [room, setRoom] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookedRooms, setBookedRooms] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoom = async () => {
            if (params.id) {
                setLoading(true);
                try {
                    const data = await hotelService.getHotelById(params.id as string);
                    setRoom(data || null);
                    
                    if (data && data.rooms && data.rooms.length > 0) {
                        const { data: bookings, error } = await supabase
                            .from('bookings')
                            .select('room_id')
                            .in('room_id', data.rooms.map((r: any) => r.id))
                            .in('status', ['pending', 'confirmed']);
                        
                        if (!error && bookings) {
                            setBookedRooms(bookings.map(b => b.room_id));
                        }
                    }
                } catch (err) {
                    console.error("Error fetching room/bookings:", err);
                } finally {
                    setLoading(false);
                }
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12 w-full">
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
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 flex items-center gap-2">
                                <Zap className="h-3 w-3 fill-current" /> Best-seller à Labé
                            </span>
                            <span className="bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/20 flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3" /> Confirmation immédiate
                            </span>
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => (
                                    <Sparkles key={i} className={`h-4 w-4 ${i < Math.floor(room.rating) ? 'fill-current' : 'opacity-30'}`} />
                                ))}
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-8xl font-black text-[#1a2b4b] dark:text-white leading-[0.85] tracking-tighter uppercase max-w-5xl">
                            {room.name} <br />
                            <span className="text-2xl sm:text-4xl md:text-6xl text-primary drop-shadow-sm">@ {room.location.split(',')[0]}</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 mt-4">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-black text-[11px] uppercase tracking-widest bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <MapPin className="h-5 w-5 text-primary" />
                                {room.location}
                            </div>
                            <button className="text-[10px] font-black text-[#1a2b4b] dark:text-white border-b-4 border-primary pb-1 hover:pb-3 transition-all uppercase tracking-[0.2em] flex items-center gap-3 group">
                                Voir sur la carte interactif
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
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
                            <div key={i} className="flex flex-col gap-4 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-black/5 group hover:border-primary transition-colors">
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
                        {/* Rooms List Section */}
                        <div id="rooms-section" className="space-y-12 scroll-mt-28">
                            <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white flex items-center gap-6 uppercase tracking-tight">
                                <span className="w-3 h-12 bg-primary rounded-full"></span>
                                Nos Chambres & Tarifs
                            </h3>
                            <div className="grid grid-cols-1 gap-8">
                                {room.rooms && room.rooms.length > 0 ? (
                                    room.rooms.map((r: any) => {
                                        const isBooked = bookedRooms.includes(r.id) || r.status === 'maintenance';
                                        return (
                                            <div 
                                                key={r.id}
                                                className={`bg-white dark:bg-slate-900 border-2 rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5 hover:scale-[1.01] transition-all flex flex-col md:flex-row ${
                                                    isBooked ? 'border-red-200 dark:border-red-950/40 opacity-80' : 'border-slate-100 dark:border-slate-800 hover:border-primary'
                                                }`}
                                            >
                                                {/* Room Image */}
                                                <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0 bg-slate-100">
                                                    <Image 
                                                        src={r.image_url || 'https://images.unsplash.com/photo-1611891487122-2075b96244e1?auto=format&fit=crop&q=80'} 
                                                        alt={r.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {isBooked && (
                                                        <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm flex items-center justify-center">
                                                            <span className="bg-red-600 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                                                🔒 Déjà Réservée
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room Info */}
                                                <div className="p-8 flex-1 flex flex-col justify-between space-y-6 text-left">
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="bg-[#1a2b4b] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                                                                {r.type === 'suite' ? '👑 Suite Royale' : r.type === 'double' ? '👥 Chambre Double' : '👤 Chambre Simple'}
                                                            </span>
                                                            <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                                <Users className="h-3 w-3 text-primary" /> Max {r.capacity} pers.
                                                            </span>
                                                        </div>
                                                        <h4 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">
                                                            {r.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                                                            {r.description || "Un espace luxueusement aménagé doté de prestations haut de gamme."}
                                                        </p>
                                                    </div>

                                                    {/* Amenities */}
                                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                                        {(r.amenities || []).map((amenity: string, idx: number) => (
                                                            <span key={idx} className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Footer Price & Booking */}
                                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-3xl font-black text-primary tracking-tighter">{r.price.toLocaleString()}</span>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GNF / NUIT</span>
                                                        </div>

                                                        <button
                                                            disabled={isBooked}
                                                            onClick={() => router.push(`/bookings/new?id=${r.id}`)}
                                                            className={`px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                                isBooked 
                                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                                                    : 'bg-[#1a2b4b] text-white hover:bg-primary hover:text-[#1a2b4b] shadow-xl hover:shadow-primary/20'
                                                            }`}
                                                        >
                                                            {isBooked ? "Indisponible" : "Réserver cette chambre"}
                                                            {!isBooked && <ArrowRight className="h-3.5 w-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                        <Bed className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Aucune chambre disponible pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                {room.amenities.map((amenity: any, i: number) => {
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
                        <div className="p-6 sm:p-12 bg-[#1a2b4b] rounded-[2.5rem] sm:rounded-[3.5rem] flex flex-col md:flex-row gap-12 items-center text-white overflow-hidden relative">
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
                    <div className="lg:col-span-4 sticky top-28 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border-t-8 border-primary rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden p-10 text-left space-y-8">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">À partir de</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">
                                        {room.rooms && room.rooms.length > 0 
                                            ? Math.min(...room.rooms.map((r: any) => r.price)).toLocaleString() 
                                            : '0'}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-500">GNF / NUIT</span>
                                </div>
                            </div>
                            
                            <p className="text-slate-500 text-xs leading-relaxed italic">
                                "Choisissez parmi nos {room.rooms?.length || 0} chambres de luxe disponibles et commencez votre séjour d'exception à Labé."
                            </p>

                            <button
                                onClick={() => {
                                    const el = document.getElementById('rooms-section');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full h-16 bg-primary text-[#1a2b4b] hover:bg-[#1a2b4b] hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 group shadow-xl shadow-primary/20 hover:shadow-[#1a2b4b]/20"
                            >
                                Voir les chambres
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
