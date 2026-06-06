'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Search, Calendar, Users, MapPin, ChevronDown, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchService, SearchResult } from "@/services/searchService";

export function HotelSearch() {
    const router = useRouter();
    const [focusedSection, setFocusedSection] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [popularDestinations, setPopularDestinations] = useState<any[]>([]);

    const handleSearch = () => {
        router.push(`/hotels?q=${encodeURIComponent(query)}`);
    };

    // Load popular destinations
    useEffect(() => {
        searchService.getPopularDestinations().then(setPopularDestinations);
    }, []);

    // Intelligent Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const data = await searchService.suggest(query);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0 z-40">
            {/* Main Search Container - Premium "Pill" Design */}
            <motion.div 
                initial={{ opacity: 1, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-full shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch p-2 gap-1"
            >
                {/* Destination Section */}
                <div 
                    onClick={() => setFocusedSection('destination')}
                    className={`flex-[1.4] flex items-center px-8 py-4 md:py-6 rounded-full transition-all cursor-pointer relative group ${focusedSection === 'destination' ? 'bg-white dark:bg-slate-800 shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                    <MapPin className={`h-5 w-5 mr-4 shrink-0 transition-colors ${focusedSection === 'destination' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">Destination</p>
                        <input
                            className="bg-transparent border-none p-0 text-slate-900 dark:text-white focus:ring-0 text-sm font-black placeholder:text-slate-300 dark:placeholder:text-slate-600 w-full"
                            placeholder="Où allez-vous ?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setFocusedSection('destination')}
                        />
                    </div>
                    {query && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                            <X className="h-4 w-4 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); setQuery(""); }} />
                        </div>
                    )}
                </div>

                <div className="hidden md:block w-[1px] h-10 self-center bg-slate-100 dark:bg-slate-800" />

                {/* Dates Section */}
                <div 
                    onClick={() => setFocusedSection('dates')}
                    className={`flex-1 flex items-center px-8 py-4 md:py-6 rounded-full transition-all cursor-pointer group ${focusedSection === 'dates' ? 'bg-white dark:bg-slate-800 shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                    <Calendar className={`h-5 w-5 mr-4 shrink-0 transition-colors ${focusedSection === 'dates' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">Dates</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">12 Oct — 15 Oct</p>
                    </div>
                </div>

                <div className="hidden md:block w-[1px] h-10 self-center bg-slate-100 dark:bg-slate-800" />

                {/* Guests Section */}
                <div 
                    onClick={() => setFocusedSection('guests')}
                    className={`flex-1 flex items-center px-8 py-4 md:py-6 rounded-full transition-all cursor-pointer group ${focusedSection === 'guests' ? 'bg-white dark:bg-slate-800 shadow-xl' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                    <Users className={`h-5 w-5 mr-4 shrink-0 transition-colors ${focusedSection === 'guests' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                    <div className="flex-1 text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">Voyageurs</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">2 adultes, 0 enf.</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${focusedSection === 'guests' ? 'rotate-180 text-primary' : 'text-slate-300'}`} />
                </div>

                {/* Search Button - Integrated */}
                <div className="p-1">
                    <Button 
                        onClick={handleSearch}
                        className="h-full w-full md:w-auto px-10 py-5 md:py-0 bg-[#1a2b4b] hover:bg-[#1a2b4b]/90 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1a2b4b]/20 group active:scale-95"
                    >
                        <Search className="h-5 w-5 stroke-[3px] group-hover:scale-110 transition-transform" />
                        <span className="md:hidden lg:inline">Rechercher</span>
                    </Button>
                </div>
            </motion.div>

            {/* Suggestions / Dropdowns */}
            <AnimatePresence>
                {focusedSection === 'destination' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 p-8 z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                {query.length >= 2 ? `Résultats pour "${query}"` : "Suggestions populaires"}
                            </h4>
                            {loading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {query.length >= 2 ? (
                                results.length > 0 ? (
                                    results.map((res) => (
                                        <button 
                                            key={res.id} 
                                            onClick={() => { setQuery(res.name); setFocusedSection(null); }}
                                            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-primary/10 transition-all text-left group"
                                        >
                                            <div className="bg-white dark:bg-slate-700 p-2 rounded-xl">
                                                <MapPin className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{res.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{res.location}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="col-span-full py-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun résultat trouvé</p>
                                )
                            ) : (
                                popularDestinations.map((place) => (
                                    <button 
                                        key={place.name} 
                                        onClick={() => { setQuery(place.name); setFocusedSection(null); }}
                                        className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-primary/10 transition-all text-left group"
                                    >
                                        <MapPin className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-200">{place.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{place.count} hôtels</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for clicking outside */}
            {focusedSection && (
                <div 
                    className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30" 
                    onClick={() => setFocusedSection(null)}
                />
            )}
        </div>
    );
}
