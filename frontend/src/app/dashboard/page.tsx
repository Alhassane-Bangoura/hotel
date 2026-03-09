'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, CheckCircle, Clock, XCircle, ChevronRight, User, 
    Phone, Mail, MapPin, CreditCard, Settings, LogOut, 
    ExternalLink, Star, ShieldCheck, Zap, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingService, Booking } from '@/services/bookingService';
import { useToast } from '@/components/ui/Toast';

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmée', icon: CheckCircle, class: 'bg-green-500/10 text-green-500 border-green-500/20' },
    pending: { label: 'Attente', icon: Clock, class: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    cancelled: { label: 'Annulée', icon: XCircle, class: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export default function ClientDashboardPage() {
    const { user, logout } = useAuthStore();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user) {
                const data = await bookingService.getUserBookings(user.id);
                setBookings(data);
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    const handleCancel = async (id: string) => {
        showToast('Demande d\'annulation envoyée à l\'administrateur', 'success');
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            {/* Header / Hero */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-slate-100 dark:border-slate-800"
            >
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Espace Privé</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                        Heureux de vous <br /><span className="text-primary italic">Revoir,</span> {user?.name.split(' ')[0]}
                    </h1>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl shadow-black/5 border border-black/5">
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content: Reservations */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white flex items-center gap-4">
                            <Calendar className="h-6 w-6 text-primary" />
                            Historique des séjours
                        </h2>
                        <span className="bg-[#1a2b4b] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {bookings.length} Réservation(s)
                        </span>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {bookings.map((b, i) => {
                                const s = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                                return (
                                    <motion.div 
                                        key={b.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all"
                                    >
                                        <div className="p-8 flex flex-col md:flex-row gap-8">
                                            {/* Status & ID */}
                                            <div className="md:w-48 shrink-0 space-y-4">
                                                <div className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${s.class}`}>
                                                    <s.icon className="h-3 w-3" />
                                                    {s.label}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono">
                                                    Ref: {b.id.slice(0, 8)}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                                                    {b.hotelName || 'Hôtel Sélectionné'}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                                                    <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> {b.checkIn} — {b.checkOut}</span>
                                                    <span className="flex items-center gap-2"><User className="h-3 w-3" /> {b.guests} Voyageurs</span>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="md:text-right flex md:flex-col justify-between items-end gap-2">
                                                <div>
                                                    <span className="text-2xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">
                                                        {b.totalPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">GNF</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-primary/10 rounded-xl transition-all text-slate-400 hover:text-primary">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </button>
                                                    {b.status === 'pending' && (
                                                        <button 
                                                            onClick={() => handleCancel(b.id)}
                                                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            Annuler
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar: Profile & Stats */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 space-y-10"
                    >
                        <div className="flex items-center gap-6 pb-10 border-b border-slate-50 dark:border-slate-800">
                            <div className="relative group">
                                <div className="h-20 w-20 rounded-[1.5rem] bg-primary flex items-center justify-center text-4xl font-black text-[#1a2b4b] shadow-2xl shadow-primary/20">
                                    {user?.name[0]}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-lg border-4 border-white dark:border-slate-900 shadow-xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{user?.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Membre Silver</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: 'Contact sécurisé', value: user?.email },
                                { icon: Phone, label: 'Mobile vérifié', value: '+224 620 000 000' },
                                { icon: MapPin, label: 'Région actuelle', value: 'Conakry, Guinée' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl h-fit">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-[#1a2b4b] dark:text-slate-200">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-5 bg-[#1a2b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Éditer mon profil
                        </button>
                    </motion.div>

                    {/* Trust card */}
                    <div className="bg-primary p-10 rounded-[3rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <Star className="absolute top-6 right-6 h-12 w-12 text-[#1a2b4b]/10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700" />
                        <h4 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter mb-4 leading-none">Programme <br />Signature</h4>
                        <p className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest leading-relaxed mb-8">
                            Bénéficiez de -15% sur tous les hôtels à Labé dès votre prochain séjour.
                        </p>
                        <ShieldCheck className="h-8 w-8 text-[#1a2b4b]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
