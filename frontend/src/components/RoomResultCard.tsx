'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Wifi, Wind, Coffee, CheckCircle, Heart, Building2 } from 'lucide-react';

interface RoomProps {
    room: {
        id: string;
        name: string;
        hotel: string;
        quartier: string;
        price: number;
        oldPrice?: number;
        rating: number;
        capacity: number;
        category: string;
        image: string;
        amenities: string[];
        remaining: number;
    }
}

export function RoomResultCard({ room }: RoomProps) {
    const router = useRouter();

    const handleReserve = () => {
        router.push(`/bookings/new?id=${room.id}`);
    };

    const handleDetails = () => {
        router.push(`/hotels/${room.id}`);
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row group transition-all duration-300"
        >
            {/* Image Section */}
            <div className="w-full md:w-80 h-72 md:h-auto relative shrink-0 overflow-hidden">
                <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2b4b] shadow-xl">
                    {room.category}
                </div>
                <button className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-primary backdrop-blur-md rounded-2xl text-white transition-all group/heart scale-90 hover:scale-100">
                    <Heart className="h-5 w-5 group-hover/heart:fill-white" />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between md:justify-start gap-4 sm:gap-6">
                            <h3 className="text-xl sm:text-2xl font-black text-[#1a2b4b] dark:text-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{room.name}</h3>
                            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-black text-xs">
                                <Star className="h-4 w-4 fill-current" /> {room.rating}
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-black text-xs uppercase tracking-widest opacity-70">
                            <Building2 className="h-4 w-4 text-primary" />
                            {room.hotel} — {room.quartier}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {room.amenities.map(amenity => (
                            <span key={amenity} className="bg-[#f8f7f5] dark:bg-slate-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 flex items-center gap-2 border border-slate-100 dark:border-slate-600">
                                {amenity.toLowerCase().includes('wifi') && <Wifi className="h-3 w-3 text-primary" />}
                                {amenity.toLowerCase().includes('clim') && <Wind className="h-3 w-3 text-primary" />}
                                {amenity.toLowerCase().includes('breakfast') && <Coffee className="h-3 w-3 text-primary" />}
                                {amenity}
                            </span>
                        ))}
                    </div>

                    <ul className="text-[11px] text-green-600 dark:text-green-400 space-y-2 font-black uppercase tracking-widest opacity-80">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Petit-déjeuner buffet inclus
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Annulation sans frais
                        </li>
                    </ul>
                </div>

                {/* Price & Action Section */}
                <div className="flex flex-col items-end justify-between min-w-[240px] border-l border-slate-100 dark:border-slate-700 pl-8 lg:border-l lg:pl-8 border-t pt-8 md:border-t-0 md:pt-0">
                    <div className="text-right w-full">
                        {room.remaining <= 3 && (
                            <span className="inline-block bg-red-500/10 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 border border-red-200">
                                Plus que {room.remaining} restantes !
                            </span>
                        )}
                        {room.oldPrice && (
                            <p className="text-xs text-slate-300 line-through font-bold uppercase tracking-widest mb-1">{room.oldPrice.toLocaleString()} GNF</p>
                        )}
                        <p className="text-3xl sm:text-4xl font-black text-[#1a2b4b] dark:text-white leading-none mb-2">
                            {room.price.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] align-middle">GNF / nuit</span>
                        </p>
                        <p className="inline-block text-[10px] font-black text-[#1a2b4b] dark:text-slate-300 bg-primary/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                            {(room.price * 3).toLocaleString()} GNF <span className="text-[9px] font-medium text-slate-400">(3 nuits)</span>
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-3 mt-8">
                        <button 
                            onClick={handleReserve}
                            className="w-full py-4 bg-primary text-[#1a2b4b] font-black rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all text-[11px] uppercase tracking-widest active:scale-95"
                        >
                            Réserver maintenant
                        </button>
                        <button 
                            onClick={handleDetails}
                            className="w-full py-3.5 bg-[#1a2b4b] text-white font-black rounded-2xl hover:bg-[#1a2b4b]/90 transition-all text-[10px] uppercase tracking-widest border border-white/10 active:scale-95"
                        >
                            Voir les détails
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
