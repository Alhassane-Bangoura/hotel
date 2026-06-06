'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Users, Bed, Wallet, Calendar, 
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Star, ShieldCheck, Download, Filter, Search,
    Loader2, PieChart, BarChart3, Activity
} from 'lucide-react';
import { hotelBusinessService } from '@/services/hotelBusinessService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HotelBusinessDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            // In a real app, we would get the hotelId from the user profile or context
            // For now, we simulate with a dummy ID or fetch the hotel owned by user
            try {
                const { data: hotel } = await supabase
                    .from('hotels')
                    .select('id')
                    .eq('user_id', user?.id)
                    .single();
                
                if (hotel) {
                    const data = await hotelBusinessService.getDashboardStats(hotel.id);
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f7f5] dark:bg-[#0f172a]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] p-6 lg:p-12 space-y-12 font-jakarta">
            {/* Header Pro */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-7xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                        Business <br /><span className="text-primary italic">Center</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-8">
                        <span className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                            <Activity className="h-3.5 w-3.5" /> Live Performance
                        </span>
                        <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Vue Analytique · 2024</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest px-8 py-6 border-slate-200"><Download className="h-4 w-4" /> Export Rapport</Button>
                    <Button className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest px-8 py-6 shadow-xl shadow-primary/20"><Filter className="h-4 w-4" /> Période</Button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Chiffre d\'Affaires', value: `${stats?.totalRevenue.toLocaleString()} GNF`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
                    { label: 'Taux d\'Occupation', value: `${stats?.occupancyRate.toFixed(1)}%`, icon: Activity, color: 'text-primary', bg: 'bg-primary/10', trend: '+5.2%' },
                    { label: 'Chambres Actives', value: stats?.activeRooms, icon: Bed, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Stable' },
                    { label: 'Note Moyenne', value: '4.8/5', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.1' },
                ].map((kpi, i) => (
                    <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all">
                        <CardContent className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl`}>
                                    <kpi.icon className="h-6 w-6" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${kpi.trend.includes('+') ? 'text-green-500' : 'text-slate-400'}`}>
                                    {kpi.trend}
                                </span>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{kpi.label}</p>
                            <p className="text-3xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{kpi.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
                {/* Main Graph & Activity */}
                <div className="lg:col-span-8 space-y-12">
                    <Card className="border-none shadow-xl rounded-[3.5rem] p-12 bg-white dark:bg-slate-900 min-h-[500px] flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute top-12 left-12">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white mb-2">Flux de Revenus</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparaison mois précédent</p>
                        </div>
                        <BarChart3 className="h-40 w-40 text-slate-100 dark:text-slate-800" />
                        <p className="text-slate-400 italic text-sm mt-8">Visualisation graphique en cours de synchronisation...</p>
                    </Card>

                    <Card className="border-none shadow-xl rounded-[3.5rem] p-10 bg-white dark:bg-slate-900 text-left">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                                <Calendar className="h-6 w-6 text-primary" />
                                Réservations Récentes
                            </h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Voir tout</Button>
                        </div>
                        
                        <div className="space-y-4">
                            {stats?.recentBookings.map((b: any) => (
                                <div key={b.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="size-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-primary border border-slate-100 dark:border-slate-700">
                                            {b.profiles?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{b.profiles?.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{b.rooms?.name} · {b.check_in} au {b.check_out}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#1a2b4b] dark:text-white">{b.total_price.toLocaleString()} GNF</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${b.status === 'confirmed' ? 'text-green-500' : 'text-orange-500'}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Sidebar: Quick Actions & Performance */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-[#1a2b4b] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-left">
                        <TrendingUp className="absolute -right-8 -bottom-8 h-40 w-40 text-white opacity-5" />
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-6">Actions <br />Rapides</h4>
                        <div className="space-y-4 relative z-10">
                            <Button className="w-full py-7 bg-primary text-[#1a2b4b] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20">Publier une chambre</Button>
                            <Button variant="outline" className="w-full py-7 bg-white/5 border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10">Gérer l'inventaire</Button>
                        </div>
                    </div>

                    <Card className="border-none shadow-xl rounded-[3.5rem] p-10 bg-white dark:bg-slate-900 text-left">
                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white mb-10">Top Chambres</h3>
                        <div className="space-y-8">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-[11px] font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight truncate">Suite Royale Bafing</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full w-[85%] bg-primary" />
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400">85%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="p-10 bg-primary/10 rounded-[3.5rem] border-2 border-primary/20 space-y-6 text-left">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            <h4 className="text-sm font-black text-[#1a2b4b] uppercase tracking-widest">Compte Vérifié</h4>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                            "Votre établissement bénéficie d'une visibilité prioritaire sur le marché national grâce au badge de confiance."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
