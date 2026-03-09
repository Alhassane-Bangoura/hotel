'use client';

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { ChevronDown, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export function AdminCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Adjust for Monday start (0=Sun, 1=Mon, ..., 6=Sat)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const startOfMonth = new Date(year, month, 1).toISOString();
                const endOfMonth = new Date(year, month + 1, 0).toISOString();

                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, rooms(name)')
                    .or(`check_in.gte.${startOfMonth},check_out.lte.${endOfMonth}`)
                    .eq('status', 'confirmed');

                if (error) throw error;
                setBookings(data || []);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [month, year]);

    const isDayBooked = (day: number) => {
        const date = new Date(year, month, day);
        return bookings.some(b => {
            const checkIn = new Date(b.check_in);
            const checkOut = new Date(b.check_out);
            return date >= checkIn && date <= checkOut;
        });
    };

    return (
        <Card className="border-none shadow-xl shadow-[#1a2b4b]/5 p-8">
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Calendrier</h4>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-1 hover:text-primary transition-colors">
                        <ChevronDown className="h-4 w-4 rotate-90" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-1 hover:text-primary transition-colors">
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                    </button>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex justify-between items-center px-4 py-3 bg-[#1a2b4b] text-white rounded-2xl shadow-lg">
                    <span className="text-xs font-black uppercase tracking-widest">{monthNames[month]} {year}</span>
                    <ChevronDown className="h-4 w-4 text-primary" />
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <span key={d}>{d}</span>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {/* Padding for start of month */}
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`pad-${i}`} className="aspect-square" />
                    ))}

                    {/* Days of month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const booked = isDayBooked(day);
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                        return (
                            <div 
                                key={day} 
                                className={`aspect-square flex flex-col items-center justify-center text-[10px] font-black rounded-xl cursor-pointer transition-all relative group ${
                                    booked ? 'bg-primary/10 text-primary border border-primary/20' : 
                                    isToday ? 'bg-primary text-[#1a2b4b] shadow-lg shadow-primary/30' : 
                                    'text-slate-600 hover:bg-slate-50 hover:text-[#1a2b4b]'
                                }`}
                            >
                                {day}
                                {booked && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
                        {loading ? 'Chargement...' : `${bookings.length} réservations confirmées`}
                    </p>
                </div>
            </div>
        </Card>
    );
}
