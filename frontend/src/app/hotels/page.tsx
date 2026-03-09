'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSummary } from '@/components/SearchSummary';
import { FilterSidebar } from '@/components/FilterSidebar';
import { RoomResultCard } from '@/components/RoomResultCard';
import { useHotelStore } from '@/store/useHotelStore';
import { hotelService } from '@/services/hotelService';
import { TrendingUp, History, Map as MapIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function HotelsPage() {
    const { filteredHotels, setHotels, loading, setLoading } = useHotelStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await hotelService.getHotels();
            setHotels(data);
            setLoading(false);
        };
        fetchData();
    }, [setHotels, setLoading]);

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827]">
            <SearchSummary />

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row gap-10">
                <FilterSidebar />

                <section className="flex-1">
                    {/* Results Header */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-4xl font-black text-[#1a2b4b] dark:text-white mb-2 tracking-tighter uppercase">Chambres disponibles à Labé</h1>
                            <p className="text-slate-500 font-bold tracking-tight uppercase text-xs opacity-60">
                                {loading ? 'Recherche en cours...' : `${filteredHotels.length} options trouvées pour vos dates`}
                            </p>
                        </motion.div>
                        <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-black/5">
                            <span className="uppercase tracking-[0.2em] opacity-40">Trier par :</span>
                            <select className="border-none bg-transparent p-0 focus:ring-0 text-[#1a2b4b] dark:text-white cursor-pointer font-black uppercase tracking-widest text-[10px]">
                                <option>Recommandé</option>
                                <option>Prix croissant</option>
                                <option>Note clients</option>
                            </select>
                        </div>
                    </div>

                    {/* Urgency Banner */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/5"
                    >
                        <div className="flex items-center gap-6">
                            <div className="bg-primary p-3.5 rounded-2xl text-[#1a2b4b] animate-bounce shadow-xl shadow-primary/30">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-black text-[#1a2b4b] dark:text-slate-200 uppercase tracking-tight">
                                <span className="text-primary">3 réservations</span> effectuées aujourd'hui à Labé.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                            <History className="h-4 w-4" />
                            Dernière mise à jour : 5 min
                        </div>
                    </motion.div>

                    {/* Room Listings */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chargement des meilleures offres...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <AnimatePresence mode="popLayout">
                                {filteredHotels.map((hotel, index) => (
                                    <motion.div
                                        key={hotel.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <RoomResultCard room={{
                                            ...hotel,
                                            quartier: hotel.location.split(',')[0],
                                            capacity: 2,
                                            category: 'Premium',
                                            amenities: hotel.amenities,
                                            remaining: 3,
                                            oldPrice: hotel.price * 1.2
                                        }} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Pagination */}
                    <nav className="mt-20 flex items-center justify-center gap-6">
                        <button className="flex items-center justify-center w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-300 transition-all hover:bg-white active:scale-90" disabled>
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div className="flex gap-4">
                            <button className="w-14 h-14 rounded-2xl bg-primary text-[#1a2b4b] font-black text-sm shadow-2xl shadow-primary/30">1</button>
                            <button className="w-14 h-14 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 font-black text-sm transition-all border border-transparent hover:border-slate-200">2</button>
                            <button className="w-14 h-14 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-slate-500 font-black text-sm transition-all border border-transparent hover:border-slate-200">3</button>
                        </div>
                        <button className="flex items-center justify-center w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 text-[#1a2b4b] hover:text-primary transition-all hover:bg-white active:scale-90">
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </nav>
                </section>
            </main>

            {/* Sticky Map Button */}
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1a2b4b] text-white px-10 py-5 rounded-full flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-40 border-4 border-white/5 group"
            >
                <MapIcon className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                Voir sur la carte
            </motion.button>
        </div>
    );
}
