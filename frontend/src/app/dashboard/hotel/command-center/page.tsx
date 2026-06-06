'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, Zap, ShieldAlert, CheckCircle2, 
    MessageSquare, Bed, UserCheck, RefreshCcw,
    TrendingUp, Bell, Search, Filter, 
    ArrowRight, Loader2, Sparkles, LayoutGrid
} from 'lucide-react';
import { hotelCommandService } from '@/services/hotelCommandService';
import { hotelBusinessService } from '@/services/hotelBusinessService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

import { useRouter } from 'next/navigation';

export default function HotelCommandCenter() {
    const { user } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hotel, setHotel] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const { data: hotelData } = await supabase
                .from('hotels')
                .select('*')
                .eq('user_id', user?.id)
                .maybeSingle();
            
            if (hotelData) {
                setHotel(hotelData);
                const [dashData, businessStats] = await Promise.all([
                    hotelCommandService.getUnifiedDashboard(hotelData.id),
                    hotelBusinessService.getDashboardStats(hotelData.id)
                ]);
                setData(dashData);
                setStats(businessStats);
            } else {
                router.push('/hotels/onboarding');
                return;
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.id, router]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!user) {
            router.push('/login');
            return;
        }

        fetchData();
    }, [user, mounted, fetchData]);

    // Abonnements temps réel optimisés
    useRealtimeSubscription({
        channelName: `hotel-ops-${hotel?.id}`,
        table: 'hotel_activity_log',
        filter: hotel?.id ? `hotel_id=eq.${hotel.id}` : undefined,
        callback: fetchData
    });

    useRealtimeSubscription({
        channelName: `hotel-alerts-${hotel?.id}`,
        table: 'hotel_alerts',
        filter: hotel?.id ? `hotel_id=eq.${hotel.id}` : undefined,
        callback: fetchData
    });

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f172a]">
                <div className="space-y-6 text-center">
                    <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                    <p className="font-black text-slate-500 uppercase tracking-[0.5em] text-[10px]">Initialisation du Cockpit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 lg:p-12 font-jakarta overflow-hidden">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LEFT: Cockpit Navigation & Stats */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                                <Zap className="h-8 w-8 text-[#1a2b4b]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">COMMAND</h1>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Center Unified</p>
                            </div>
                        </div>
                        
                        <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] p-8 text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Statut Établissement</p>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-black text-white uppercase tracking-tight">{hotel?.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Occupation</p>
                                    <p className="text-xl font-black text-primary">{(stats?.occupancyRate || 0).toFixed(0)}%</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Revenus</p>
                                    <p className="text-xl font-black text-white">{((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Menu Opérationnel</p>
                        {[
                            { label: 'Tableau de bord', icon: LayoutGrid, active: true },
                            { label: 'Calendrier Pro', icon: Bed },
                            { label: 'Messagerie', icon: MessageSquare },
                            { label: 'Maintenance', icon: Sparkles },
                        ].map((item, i) => (
                            <button key={i} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left ${item.active ? 'bg-primary text-[#1a2b4b] font-black shadow-lg shadow-primary/10' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-bold'}`}>
                                <item.icon className="h-5 w-5" />
                                <span className="text-[11px] uppercase tracking-widest">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MIDDLE: Operational Center */}
                <div className="lg:col-span-6 space-y-10">
                    {/* Alerts Banner */}
                    {data?.alerts.length > 0 && (
                        <div className="space-y-4">
                            {data.alerts.map((alert: any) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={alert.id}
                                    className={`p-6 rounded-[2rem] flex items-center justify-between border-l-8 ${alert.priority === 'critical' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-orange-500/10 border-orange-500 text-orange-500'}`}
                                >
                                    <div className="flex items-center gap-6 text-left">
                                        <ShieldAlert className="h-8 w-8 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{alert.type}</p>
                                            <h4 className="text-sm font-black uppercase tracking-tight text-white">{alert.message}</h4>
                                        </div>
                                    </div>
                                    <Button onClick={() => hotelCommandService.resolveAlert(alert.id)} className="bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase px-6">Résoudre</Button>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Check-ins', value: data?.criticalOps.pendingCheckins, icon: UserCheck, color: 'text-blue-400' },
                            { label: 'Nettoyage', value: data?.criticalOps.dirtyRooms, icon: Sparkles, color: 'text-purple-400' },
                            { label: 'Messages', value: '2', icon: MessageSquare, color: 'text-emerald-400' },
                            { label: 'Alertes', value: data?.alerts.length, icon: Bell, color: 'text-red-400' },
                        ].map((q, i) => (
                            <Card key={i} className="bg-slate-900 border-slate-800 rounded-3xl p-6 hover:border-primary/50 transition-all text-center">
                                <div className={`size-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 ${q.color}`}>
                                    <q.icon className="h-6 w-6" />
                                </div>
                                <p className="text-2xl font-black text-white">{q.value}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{q.label}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Activity Feed */}
                    <Card className="bg-slate-900 border-slate-800 rounded-[3.5rem] p-10 text-left">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                                <Activity className="h-6 w-6 text-primary" />
                                Flux d'activité Direct
                            </h3>
                            <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(244,157,37,0.5)]" />
                        </div>
                        
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {data?.activityFeed.map((log: any) => (
                                <div key={log.id} className="flex gap-6 items-start p-4 hover:bg-slate-800/50 rounded-2xl transition-all border-l-2 border-transparent hover:border-primary">
                                    <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-white uppercase tracking-tight">{log.content}</p>
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                                            {new Date(log.created_at).toLocaleTimeString()} · {log.type}
                                        </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-700" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* RIGHT: Quick Controls & Staff */}
                <div className="lg:col-span-3 space-y-10">
                    <Card className="bg-primary p-10 rounded-[3.5rem] text-left relative overflow-hidden shadow-2xl">
                        <TrendingUp className="absolute -right-8 -bottom-8 h-40 w-40 text-[#1a2b4b] opacity-10" />
                        <h4 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter leading-none mb-6">Actions <br />Rapides</h4>
                        <div className="space-y-4 relative z-10">
                            <Button className="w-full py-6 bg-[#1a2b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Arrivée Client</Button>
                            <Button variant="outline" className="w-full py-6 border-[#1a2b4b]/20 text-[#1a2b4b] rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/20">Blocage Chambre</Button>
                        </div>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 rounded-[3rem] p-10 text-left">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Équipe en Service</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Moussa B.', role: 'Manager', status: 'Online' },
                                { name: 'Aissatou D.', role: 'Réception', status: 'Busy' },
                                { name: 'Alpha K.', role: 'Entretien', status: 'Online' },
                            ].map((staff, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-xs">
                                        {staff.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-white uppercase">{staff.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">{staff.role}</p>
                                    </div>
                                    <div className={`size-2 rounded-full ${staff.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500'}`} />
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-10 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-primary">Gérer le personnel</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
