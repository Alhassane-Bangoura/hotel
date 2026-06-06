'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, UserCheck, UserMinus, Sparkles, 
    Clock, ChevronRight, Loader2, RefreshCcw,
    CheckCircle2, AlertCircle, Bed, Phone
} from 'lucide-react';
import { hotelOperationsService } from '@/services/hotelOperationsService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HotelOperationsPage() {
    const { user } = useAuthStore();
    const [ops, setOps] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOps = async () => {
        try {
            const { data: hotel } = await supabase
                .from('hotels')
                .select('id')
                .eq('user_id', user?.id)
                .single();
            
            if (hotel) {
                const data = await hotelOperationsService.getDailyOperations(hotel.id);
                setOps(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchOps();
    }, [user]);

    const handleStatusUpdate = async (type: 'op' | 'hk', id: string, status: string) => {
        setUpdatingId(id);
        try {
            if (type === 'op') {
                await hotelOperationsService.updateOperationalStatus(id, status as any);
            } else {
                await hotelOperationsService.updateHousekeepingStatus(id, status as any);
            }
            await fetchOps();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f7f5] dark:bg-[#0f172a]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] p-6 lg:p-12 space-y-12 font-jakarta">
            {/* Header Operations */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                        Daily <br /><span className="text-primary italic">Ops</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-8">
                        <span className="flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            <Clock className="h-3.5 w-3.5" /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                        <button onClick={fetchOps} className="text-slate-400 hover:text-primary transition-all">
                            <RefreshCcw className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest px-8 py-6 border-slate-200"><Calendar className="h-4 w-4" /> Voir Calendrier</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
                {/* Column 1: Arrivals (Check-ins) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                            <UserCheck className="h-6 w-6 text-green-500" />
                            Arrivées <span className="text-slate-300">({ops?.arrivals.length})</span>
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {ops?.arrivals.map((b: any) => (
                            <Card key={b.id} className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden group">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center font-black">
                                            {b.profiles?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{b.profiles?.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Bed className="h-3.5 w-3.5" /> {b.rooms?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={() => handleStatusUpdate('op', b.id, 'checked_in')}
                                            disabled={updatingId === b.id}
                                            className="w-full py-4 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest"
                                        >
                                            {updatingId === b.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmer Check-in'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {ops?.arrivals.length === 0 && <p className="text-center py-10 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Aucune arrivée prévue.</p>}
                    </div>
                </div>

                {/* Column 2: Departures (Check-outs) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                            <UserMinus className="h-6 w-6 text-orange-500" />
                            Départs <span className="text-slate-300">({ops?.departures.length})</span>
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {ops?.departures.map((b: any) => (
                            <Card key={b.id} className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black">
                                            {b.profiles?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{b.profiles?.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{b.rooms?.name}</p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handleStatusUpdate('op', b.id, 'checked_out')}
                                        variant="outline"
                                        className="w-full py-4 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-xl font-black text-[9px] uppercase tracking-widest"
                                    >
                                        Finaliser Check-out
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {ops?.departures.length === 0 && <p className="text-center py-10 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Aucun départ prévu.</p>}
                    </div>
                </div>

                {/* Column 3: Housekeeping (Cleanup) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                            Nettoyage <span className="text-slate-300">({ops?.housekeeping.length})</span>
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {ops?.housekeeping.map((r: any) => (
                            <Card key={r.id} className="border-none shadow-xl rounded-[2rem] bg-[#1a2b4b] text-white overflow-hidden">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black uppercase tracking-tight">{r.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${r.housekeeping_status === 'dirty' ? 'bg-red-500' : 'bg-primary text-[#1a2b4b]'}`}>
                                            {r.housekeeping_status === 'dirty' ? 'À Nettoyer' : 'En cours'}
                                        </span>
                                    </div>
                                    <Button 
                                        onClick={() => handleStatusUpdate('hk', r.id, 'clean')}
                                        className="w-full py-4 bg-primary text-[#1a2b4b] rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                    >
                                        Marquer comme PROPRE
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        {ops?.housekeeping.length === 0 && (
                            <div className="text-center py-20 space-y-4 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic px-8">Tout est propre ! Beau travail d'équipe.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
