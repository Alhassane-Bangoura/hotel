'use client';

import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Search, Calendar, Users, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export function HotelSearch() {
    const router = useRouter();

    const handleSearch = () => {
        router.push('/hotels');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto border border-white/20"
        >
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 py-3">
                <CalendarDays className="h-5 w-5 text-slate-400 mr-3" />
                <div className="text-left flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Check-in</p>
                    <input
                        className="bg-transparent border-none p-0 text-slate-900 focus:ring-0 text-sm font-semibold placeholder:text-slate-300 w-full"
                        placeholder="Ajouter une date"
                        type="text"
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 py-3">
                <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                <div className="text-left flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Check-out</p>
                    <input
                        className="bg-transparent border-none p-0 text-slate-900 focus:ring-0 text-sm font-semibold placeholder:text-slate-300 w-full"
                        placeholder="Ajouter une date"
                        type="text"
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center px-4 py-3">
                <Users className="h-5 w-5 text-slate-400 mr-3" />
                <div className="text-left flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Voyageurs</p>
                    <input
                        className="bg-transparent border-none p-0 text-slate-900 focus:ring-0 text-sm font-semibold placeholder:text-slate-300 w-full"
                        placeholder="Combien de personnes ?"
                        type="text"
                    />
                </div>
            </div>

            <Button 
                onClick={handleSearch}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 min-w-[200px] shadow-lg shadow-accent/20 active:scale-95"
            >
                <Search className="h-5 w-5" />
                Réserver maintenant
            </Button>
        </motion.div>
    );
}
