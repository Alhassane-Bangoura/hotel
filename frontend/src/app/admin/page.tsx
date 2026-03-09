'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoomModal } from '@/components/RoomModal';
import { AdminCalendar } from '@/components/AdminCalendar';
import {
    LayoutDashboard, Hotel, Calendar, Users, ShieldCheck,
    TrendingUp, CheckCircle, XCircle, Clock, Eye, Ban,
    Search, Bell, ChevronDown, Download, Star, Reply,
    MoreHorizontal, Smartphone, Zap, MessageSquare, Plus,
    BarChart3, Settings, LogOut, Wallet, Loader2, Target
} from 'lucide-react';
import { hotelService, Hotel as HotelType } from '@/services/hotelService';

// --- MOCK DATA ---
const KPI_STATS = [
    { label: "Réservations jour", value: "12", growth: "+12%", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Check-ins Today", value: "8", growth: "Stable", icon: Target, color: "text-primary", bg: "bg-primary/10" },
    { label: "Taux d'occupation", value: "85%", growth: "+5.2%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Revenus (30j)", value: "18.5M", growth: "+15%", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function AdminPage() {
    const [activeTab, setActiveTab ] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);
    const [rooms, setRooms] = useState<HotelType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        setLoading(true);
        const data = await hotelService.getHotels();
        setRooms(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleOpenAddModal = () => {
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (room: any) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-screen bg-[#f8f7f5] dark:bg-[#0f172a] overflow-hidden font-jakarta text-slate-900 dark:text-slate-100">
            <RoomModal 
                isOpen={isModalOpen} 
                initialData={selectedRoom}
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchRooms} 
            />
            
            {/* Sidebar */}
            <aside className="hidden lg:flex w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
                <div className="p-10 flex items-center gap-4">
                    <div className="bg-[#1a2b4b] size-12 rounded-2xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
                        <Hotel className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-[#1a2b4b] dark:text-white uppercase leading-none">H-Labé</h1>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] mt-1">Management Suite</p>
                    </div>
                </div>

                <nav className="flex-1 px-8 space-y-3 py-6">
                    {[
                        { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
                        { id: 'bookings', label: 'Flux Réservations', icon: Calendar },
                        { id: 'rooms', label: 'Gestion Chambres', icon: Hotel },
                        { id: 'clients', label: 'Clientèle', icon: Users },
                        { id: 'revenue', label: 'Analytique', icon: Wallet },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                                activeTab === item.id 
                                ? 'bg-[#1a2b4b] text-white shadow-2xl shadow-[#1a2b4b]/20' 
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div layoutId="activeNav" className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    <button 
                        onClick={handleOpenAddModal}
                        className="w-full flex items-center justify-center gap-3 bg-primary text-[#1a2b4b] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-[0.98]">
                        <Plus className="h-4 w-4" />
                        Nouvelle Unité
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition-all">
                        <LogOut className="h-5 w-5" />
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 md:h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-10 shrink-0 z-20">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                className="w-full pl-14 pr-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-xs font-black uppercase tracking-widest transition-all outline-none" 
                                placeholder="Recherche intelligente..." 
                                type="text"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <button className="relative p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-3 right-3 size-2.5 bg-red-500 rounded-full border-4 border-white dark:border-slate-900 animate-pulse" />
                        </button>
                        <div className="flex items-center gap-4 sm:pl-8 sm:border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-[#1a2b4b] dark:text-white uppercase tracking-widest">Alpha Mamadou</p>
                                <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">Directeur Général</p>
                            </div>
                            <div className="size-10 md:size-12 rounded-2xl bg-[#1a2b4b] flex items-center justify-center shadow-xl font-bold text-primary text-sm md:text-base">
                                AM
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-10 md:space-y-12 scroll-smooth">
                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                                Performance <br /><span className="text-primary italic">Live</span>
                            </h2>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4">Dernière mise à jour: à l'instant</p>
                        </motion.div>
                        <button className="flex items-center gap-4 px-4 sm:px-8 py-3 sm:py-4 bg-[#1a2b4b] rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white hover:shadow-2xl transition-all group shrink-0">
                            <Download className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:bounce" />
                            Export Data
                        </button>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {KPI_STATS.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border-none shadow-2xl shadow-black/5 rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-[10px] font-black text-green-500 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-lg">
                                                <TrendingUp className="h-3 w-3" /> {stat.growth}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                                        <p className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter tabular-nums">
                                            {stat.value}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 text-left">
                        {/* Feed Content */}
                        <div className="xl:col-span-8 space-y-12">
                            <Card className="border-none shadow-2xl shadow-black/5 rounded-[3rem] p-10 bg-white dark:bg-slate-900">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                                        <Zap className="h-6 w-6 text-primary" />
                                        Flux de Gestion
                                    </h3>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={fetchRooms} 
                                            disabled={loading}
                                            className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group disabled:opacity-50"
                                        >
                                            <Reply className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                                            Rafraîchir
                                        </button>
                                    </div>
                                </div>
                                
                                {loading && rooms.length === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sychronisation...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {rooms.slice(0, 4).map((room, i) => (
                                            <motion.div 
                                                key={room.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="size-20 rounded-[1.5rem] overflow-hidden bg-slate-200 dark:bg-slate-700">
                                                        <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="text-lg font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{room.name}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{room.location}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-10">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{room.price.toLocaleString()}</p>
                                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">GNF / NUIT</p>
                                                    </div>
                                                    <button onClick={() => handleOpenEditModal(room)} className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/5 hover:bg-primary transition-all text-slate-400 hover:text-[#1a2b4b]">
                                                        <Settings className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Calendar Sidebar */}
                        <div className="xl:col-span-4 space-y-12">
                            <AdminCalendar />
                            
                            <div className="bg-[#1a2b4b] rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <Target className="absolute -right-8 -bottom-8 h-40 w-40 text-primary opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
                                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none italic">Labé <br /><span className="text-primary italic">Infinity</span></h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-10">
                                    Optimisez vos tarifs dynamiquement selon la saisonnalité du Fouta.
                                </p>
                                <button className="w-full py-6 bg-primary text-[#1a2b4b] rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">
                                    Lancer l'Analyse AI
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
