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


import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';


export default function ClientDashboardPage() {
    const { user, logout, setUser } = useAuthStore();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');
    const [editedCity, setEditedCity] = useState('Conakry, Guinée');
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {
        if (user) {
            setEditedName(user.name || '');
            setEditedPhone(user.phone || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setUpdatingProfile(true);
        try {
            await authService.updateProfile(user.id, {
                name: editedName,
                phone: editedPhone
            });

            setUser({
                ...user,
                name: editedName,
                phone: editedPhone
            });

            showToast('Profil mis à jour avec succès !', 'success');
            setIsEditing(false);
        } catch (err: any) {
            console.error(err);
            showToast(err.message || 'Erreur lors de la mise à jour.', 'error');
        } finally {
            setUpdatingProfile(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!user) {
            router.push('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const data = await bookingService.getUserBookings(user.id);
                setBookings(data as any);
            } catch (err) {
                console.error(err);
                showToast('Erreur lors du chargement des réservations', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user, mounted]);

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
                        Heureux de vous <br /><span className="text-primary italic">Revoir,</span> {user?.name ? user.name.split(' ')[0] : 'Voyageur'}
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
                                                    {b.hotel_name || 'Hôtel Sélectionné'}
                                                </h3>
                                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                                    {b.room_name || 'Chambre de Luxe'}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-[10px] uppercase font-black text-slate-500 tracking-widest pt-2">
                                                    <span className="flex items-center gap-2"><Clock className="h-3 w-3 text-primary" /> {b.check_in} — {b.check_out}</span>
                                                    <span className="flex items-center gap-2"><User className="h-3 w-3 text-primary" /> {b.guests} Voyageurs</span>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="md:text-right flex md:flex-col justify-between items-end gap-2">
                                                <div>
                                                    <span className="text-2xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">
                                                        {b.total_price.toLocaleString()}
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

                            {bookings.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 space-y-8 shadow-xl shadow-black/5"
                                >
                                    <div className="w-20 h-20 rounded-[1.8rem] bg-primary/10 flex items-center justify-center text-primary mx-auto animate-bounce">
                                        <Calendar className="h-10 w-10" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-3">
                                        <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white">Aucun séjour réservé pour le moment</h3>
                                        <p className="text-sm font-medium text-slate-400 italic leading-relaxed">
                                            "Vous n'avez pas encore effectué de réservation d'hôtel à Labé sur la plate-forme. Parcourez nos merveilleux établissements !"
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/partners')}
                                        className="px-10 py-5 bg-[#1a2b4b] dark:bg-primary hover:bg-[#1a2b4b]/90 hover:scale-[1.03] active:scale-[0.97] dark:hover:bg-primary/95 text-white dark:text-[#1a2b4b] font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 mx-auto"
                                    >
                                        Réserver mon premier séjour à Labé
                                    </button>
                                </motion.div>
                            )}
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
                        {!isEditing ? (
                            <>
                                <div className="flex items-center gap-6 pb-10 border-b border-slate-50 dark:border-slate-800">
                                    <div className="relative group">
                                        <div className="h-20 w-20 rounded-[1.5rem] bg-primary flex items-center justify-center text-4xl font-black text-[#1a2b4b] shadow-2xl shadow-primary/20">
                                            {user?.name?.[0] || 'U'}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 h-6 w-6 rounded-lg border-4 border-white dark:border-slate-900 shadow-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{user?.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Membre Silver</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-5">
                                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl h-fit">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Contact sécurisé</p>
                                            <p className="text-sm font-black text-[#1a2b4b] dark:text-slate-200">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl h-fit">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Mobile vérifié</p>
                                            <p className="text-sm font-black text-[#1a2b4b] dark:text-slate-200">{user?.phone || '+224 620 000 000'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-5">
                                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl h-fit">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">Région actuelle</p>
                                            <p className="text-sm font-black text-[#1a2b4b] dark:text-slate-200">{editedCity}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-5 bg-[#1a2b4b] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Éditer mon profil
                                </button>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight pb-6 border-b border-slate-50 dark:border-slate-800">
                                    Modifier le Profil
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-[#1a2b4b] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Nom complet"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile</label>
                                        <input
                                            type="text"
                                            value={editedPhone}
                                            onChange={(e) => setEditedPhone(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-[#1a2b4b] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Ex: +224 620 00 00 00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Région</label>
                                        <input
                                            type="text"
                                            value={editedCity}
                                            onChange={(e) => setEditedCity(e.target.value)}
                                            className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-bold text-[#1a2b4b] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                            placeholder="Ex: Conakry, Guinée"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                        disabled={updatingProfile}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 py-4 bg-[#f49d25] hover:bg-[#f49d25]/90 text-[#1a2b4b] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#f49d25]/15 transition-all flex items-center justify-center gap-2"
                                        disabled={updatingProfile}
                                    >
                                        {updatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enregistrer'}
                                    </button>
                                </div>
                            </div>
                        )}
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
