'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Bed, 
    MoreHorizontal, User, Clock, AlertCircle
} from 'lucide-react';
import { hotelOperationsService } from '@/services/hotelOperationsService';

interface CalendarProps {
    hotelId: string;
}

export function HotelCalendar({ hotelId }: CalendarProps) {
    const [viewDate, setViewDate] = useState(new Date());
    const [bookings, setBookings] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Générer les 14 prochains jours pour la vue "Smart Week"
    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() + i);
        return d;
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const startDate = days[0].toISOString().split('T')[0];
                const endDate = days[13].toISOString().split('T')[0];
                
                const { data: roomsData } = await supabase.from('rooms').select('*').eq('hotel_id', hotelId).eq('status', 'published');
                const bookingsData = await hotelOperationsService.getCalendarData(hotelId, startDate, endDate);
                
                setRooms(roomsData || []);
                setBookings(bookingsData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [hotelId, viewDate]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden font-jakarta text-left">
            {/* Calendar Toolbar */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-6">
                    <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter italic">Planning <span className="text-primary">Ops</span></h3>
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <button className="px-6 py-2 rounded-lg bg-[#1a2b4b] text-white text-[10px] font-black uppercase tracking-widest">Semaine</button>
                        <button className="px-6 py-2 rounded-lg text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary">Mois</button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => {
                            const d = new Date(viewDate);
                            d.setDate(d.getDate() - 7);
                            setViewDate(d);
                        }}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1a2b4b] dark:text-white">
                        {days[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                        onClick={() => {
                            const d = new Date(viewDate);
                            d.setDate(d.getDate() + 7);
                            setViewDate(d);
                        }}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-all"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[1200px]">
                    {/* Header: Days */}
                    <div className="grid grid-cols-[240px_repeat(14,1fr)] border-b border-slate-50 dark:border-slate-800">
                        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-50 dark:border-slate-800">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chambres / Dates</span>
                        </div>
                        {days.map((day, i) => (
                            <div key={i} className={`p-6 text-center border-r border-slate-50 dark:border-slate-800 last:border-none ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-slate-50/30 dark:bg-slate-800/20' : ''}`}>
                                <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 mb-1">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                                <p className={`text-xl font-black ${new Date().toDateString() === day.toDateString() ? 'text-primary' : 'text-[#1a2b4b] dark:text-white'}`}>{day.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Body: Rooms & Bookings */}
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {rooms.map((room) => (
                            <div key={room.id} className="grid grid-cols-[240px_repeat(14,1fr)] h-24 group">
                                {/* Room Label */}
                                <div className="p-6 border-r border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition-colors flex items-center gap-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center ${room.housekeeping_status === 'dirty' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
                                        <Bed className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight truncate w-32">{room.name}</h4>
                                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{room.housekeeping_status}</span>
                                    </div>
                                </div>

                                {/* Availability Grid Cells */}
                                {days.map((day, i) => {
                                    const dateStr = day.toISOString().split('T')[0];
                                    const booking = bookings.find(b => b.room_id === room.id && dateStr >= b.check_in && dateStr < b.check_out);
                                    
                                    return (
                                        <div key={i} className={`relative border-r border-slate-50 dark:border-slate-800 last:border-none ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-slate-50/20 dark:bg-slate-800/10' : ''}`}>
                                            {booking && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`absolute inset-1 rounded-xl p-2 flex flex-col justify-between overflow-hidden shadow-sm ${
                                                        booking.operational_status === 'checked_in' 
                                                        ? 'bg-[#1a2b4b] text-white border-l-4 border-primary' 
                                                        : 'bg-primary/10 text-primary border-l-4 border-primary'
                                                    }`}
                                                >
                                                    <p className="text-[8px] font-black uppercase truncate leading-none">{booking.profiles?.name}</p>
                                                    <div className="flex items-center justify-between opacity-50">
                                                        <User className="h-2.5 w-2.5" />
                                                        <span className="text-[7px] font-black tracking-tighter">REF-{booking.id.slice(0,4)}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend Footer */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex items-center gap-12">
                <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Réservé (En attente)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-[#1a2b4b]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Occupé (Client sur place)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-3 rounded-full bg-red-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Maintenance / Dirty</span>
                </div>
            </div>
        </div>
    );
}

import { supabase } from '@/lib/supabaseClient';
