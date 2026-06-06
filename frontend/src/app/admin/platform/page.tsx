'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, Hotel, Calendar, Users, ShieldCheck, 
    TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle,
    BarChart3, Settings, LogOut, Wallet, Loader2, Globe,
    ChevronRight, Search, Bell, Download, Filter, Eye
} from 'lucide-react';
import { platformService } from '@/services/platformService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PlatformDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [pendingHotels, setPendingHotels] = useState<any[]>([]);
    const [activity, setActivity] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [s, h, a, i] = await Promise.all([
                    platformService.getGlobalStats(),
                    platformService.getPendingHotels(),
                    platformService.getRecentActivity(),
                    platformService.getIncidents()
                ]);
                setStats(s);
                setPendingHotels(h);
                setActivity(a);
                setIncidents(i);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleVerify = async (id: string, status: 'active' | 'suspended') => {
        await platformService.verifyHotel(id, status);
        // Refresh
        const h = await platformService.getPendingHotels();
        setPendingHotels(h);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f7f5] dark:bg-[#0f172a]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8f7f5] dark:bg-[#0f172a] overflow-hidden font-jakarta">
            {/* Sidebar Platform */}
            <aside className="w-80 bg-[#1a2b4b] text-white flex flex-col shrink-0 border-r border-white/5">
                <div className="p-10 flex items-center gap-4">
                    <div className="bg-primary size-12 rounded-2xl flex items-center justify-center text-[#1a2b4b] shadow-2xl shadow-primary/20">
                        <Globe className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">H-Market</h1>
                        <p className="text-[9px] text-primary font-black uppercase tracking-[0.4em] mt-1">Platform Admin</p>
                    </div>
                </div>

                <nav className="flex-1 px-8 space-y-2 py-6">
                    {[
                        { id: 'stats', label: 'Statistiques', icon: BarChart3 },
                        { id: 'hotels', label: 'Gestion Hôtels', icon: Hotel },
                        { id: 'bookings', label: 'Toutes Réservations', icon: Calendar },
                        { id: 'users', label: 'Utilisateurs', icon: Users },
                        { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
                    ].map((item) => (
                        <button key={item.id} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-all">
                            <item.icon className="h-5 w-5" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-white/5">
                    <button className="w-full flex items-center gap-4 px-6 py-4 text-red-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/10 rounded-2xl transition-all">
                        <LogOut className="h-5 w-5" />
                        Quitter l'administration
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-50 dark:bg-slate-900/50">
                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                            Supervision <br /><span className="text-primary italic">Nationale</span>
                        </h2>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4">Vue globale - Guinée</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest"><Download className="h-4 w-4" /> Rapport Global</Button>
                        <Button className="rounded-2xl gap-2 font-black text-[10px] uppercase tracking-widest"><Settings className="h-4 w-4" /> Paramètres</Button>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-8 text-left">
                    {[
                        { label: 'Hôtels Partenaires', value: stats.totalHotels, icon: Hotel, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Réservations Totales', value: stats.totalBookings, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Utilisateurs Actifs', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Volume d\'Affaires', value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800">
                            <CardContent className="p-8">
                                <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-6`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                                <p className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-12 text-left">
                    {/* Left: Verification & Incidents */}
                    <div className="col-span-8 space-y-12">
                        {/* Pending Verifications */}
                        <Card className="border-none shadow-xl rounded-[3rem] p-10 bg-white dark:bg-slate-800">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                    Vérifications en attente
                                </h3>
                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{pendingHotels.length} dossiers</span>
                            </div>

                            <div className="space-y-4">
                                {pendingHotels.map((h) => (
                                    <div key={h.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-6">
                                            <div className="size-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                <Hotel className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{h.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{h.quartier} · Propriétaire: {h.profiles?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleVerify(h.id, 'active')} variant="outline" className="rounded-xl border-green-500 text-green-500 hover:bg-green-50 text-[10px] font-black uppercase tracking-widest px-6">Approuver</Button>
                                            <Button onClick={() => handleVerify(h.id, 'suspended')} variant="outline" className="rounded-xl border-red-500 text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest px-6">Rejeter</Button>
                                        </div>
                                    </div>
                                ))}
                                {pendingHotels.length === 0 && <p className="text-center py-10 text-slate-400 font-black text-[10px] uppercase tracking-widest">Aucune vérification en attente.</p>}
                            </div>
                        </Card>

                        {/* Supervision Center / Incidents */}
                        <Card className="border-none shadow-xl rounded-[3rem] p-10 bg-white dark:bg-slate-800">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4 mb-10">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                                Centre de Supervision
                            </h3>
                            <div className="space-y-4">
                                {incidents.map((inc) => (
                                    <div key={inc.id} className="p-6 bg-red-50/50 dark:bg-red-950/20 rounded-[2rem] border border-red-100 dark:border-red-900/50 flex items-center justify-between">
                                        <div className="flex gap-6 items-start">
                                            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-widest">{inc.type}</h4>
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[9px] font-black uppercase">{inc.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2 italic">"{inc.description}"</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-4 tracking-widest">{inc.hotels?.name} · Par {inc.profiles?.name}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" className="rounded-xl font-black text-[9px] uppercase tracking-widest px-6">Gérer</Button>
                                    </div>
                                ))}
                                {incidents.length === 0 && <p className="text-center py-10 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">Aucun incident critique détecté.</p>}
                            </div>
                        </Card>
                    </div>

                    {/* Right: Monitoring & Audit Logs */}
                    <div className="col-span-4 space-y-12">
                        <Card className="border-none shadow-xl rounded-[3rem] p-8 bg-[#1a2b4b] text-white">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-4 mb-8">
                                <Clock className="h-5 w-5 text-primary" />
                                Audit Plateforme
                            </h3>
                            <div className="space-y-6">
                                {activity.map((act) => (
                                    <div key={act.id} className="relative pl-8 border-l border-white/10 pb-6 last:pb-0">
                                        <div className="absolute left-[-5px] top-0 size-2.5 bg-primary rounded-full shadow-lg shadow-primary/50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{act.profiles?.name}</p>
                                        <p className="text-[11px] font-medium text-slate-300">{act.action.replace(/_/g, ' ')}</p>
                                        <p className="text-[9px] font-black text-white/30 uppercase mt-2 tracking-widest">
                                            {new Date(act.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="bg-primary p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                            <TrendingUp className="absolute -right-8 -bottom-8 h-40 w-40 text-[#1a2b4b] opacity-10" />
                            <h4 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter leading-none mb-6">Objectif <br />Marché National</h4>
                            <p className="text-[11px] font-black text-[#1a2b4b]/60 uppercase tracking-widest leading-relaxed mb-8">
                                Prochaine ville cible : Conakry. 12 nouveaux établissements en attente d'onboarding.
                            </p>
                            <Button className="w-full py-6 bg-[#1a2b4b] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em]">Ouvrir le centre de croissance</Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
