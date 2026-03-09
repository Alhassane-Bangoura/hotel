'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReviewForm } from '@/components/ReviewForm';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle, Copy, MapPin, Calendar, Users, Hotel, Download, ArrowLeft, PhoneCall, ShieldCheck, Eye, LogOut, LayoutDashboard, CreditCard, Sparkles } from 'lucide-react';

export default function BookingSuccessPage() {
    const { user } = useAuthStore();
    const [bookingNumber, setBookingNumber] = useState("");
    
    useEffect(() => {
        setBookingNumber(`RES-${Math.floor(100000 + Math.random() * 900000)}`);
    }, []);

    const hotelId = "00000000-0000-0000-0000-000000000000";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(bookingNumber);
    };

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827] antialiased">
            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
                {/* Success Header */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center bg-green-500/10 text-green-500 p-8 rounded-[2rem] mb-10 ring-8 ring-green-500/5 shadow-2xl shadow-green-500/20">
                        <CheckCircle className="h-16 w-16" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#1a2b4b] dark:text-white mb-6 tracking-tighter uppercase leading-[0.8]">
                        Voyage <br /><span className="text-primary">Confirmé</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed italic">
                        Votre suite vous attend. Un récapitulatif a été envoyé à <span className="font-black text-[#1a2b4b] dark:text-slate-200">{user?.email || 'votre email'}</span>.
                    </p>
                </motion.div>

                {/* Booking Number Banner */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16 overflow-hidden rounded-[3rem] bg-[#1a2b4b] shadow-2xl relative group border-4 border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
                    <div className="p-10 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div>
                            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.4em] mb-3">Passport de séjour</p>
                            <h2 className="text-white text-3xl font-black uppercase tracking-tighter">Référence: <span className="text-primary italic">{bookingNumber}</span></h2>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="bg-primary hover:bg-white text-[#1a2b4b] px-8 py-4 rounded-2xl transition-all flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95"
                        >
                            <Copy className="h-5 w-5" />
                            Copier le code
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Reservation Summary Card */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group"
                        >
                            <div className="h-64 w-full relative overflow-hidden">
                                <Image
                                    src="/room_standard_1772793062441.png"
                                    alt="Luxury Room"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-8 left-8 bg-primary text-[#1a2b4b] text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-[0.2em] shadow-2xl">
                                    Signature Suite
                                </div>
                            </div>
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#1a2b4b] dark:text-white mb-4 uppercase tracking-tight leading-none">Hôtel Labé Luxury</h3>
                                        <p className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Quartier Tata, Labé — Guinée
                                        </p>
                                    </div>
                                    <div className="bg-primary/10 text-primary px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                                        3 Nuits total
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                                    <div className="space-y-2">
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">Arrivée</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-sm uppercase">12 Juil 2024</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">Départ</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-sm uppercase">15 Juil 2024</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">Pax</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-sm uppercase">2 Adultes</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">Unité</p>
                                        <p className="font-black text-primary text-sm uppercase">Suite 104</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Guest Info Card */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10"
                        >
                            <div className="flex items-center gap-5 mb-10">
                                <div className="bg-primary/10 p-4 rounded-2xl">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Passport Détenteur</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Propriétaire</label>
                                    <p className="text-[#1a2b4b] dark:text-slate-200 font-black text-xl uppercase tracking-tight">{user?.name || 'Veuillez vous connecter'}</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Email Sécurisé</label>
                                    <p className="text-[#1a2b4b] dark:text-slate-200 font-black text-lg leading-none break-all">{user?.email || '-'}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Review System */}
                        <ReviewForm 
                            hotelId={hotelId} 
                            bookingId={bookingNumber} 
                        />
                    </div>

                    {/* Right Column: Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-10"
                    >
                        {/* Payment Detail Card */}
                        <div className="bg-[#1a2b4b] text-white rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
                            <Sparkles className="absolute top-6 right-6 h-8 w-8 text-primary opacity-20 animate-pulse" />
                            <div className="flex items-center gap-5 mb-10">
                                <div className="bg-primary p-4 rounded-2xl">
                                    <CreditCard className="h-6 w-6 text-[#1a2b4b]" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">Facturation</h3>
                            </div>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Séjour 3 nuits</span>
                                    <span>1 140 000 GNF</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Service Labé</span>
                                    <span className="text-primary italic">INCLUS</span>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <span className="font-black text-white/50 uppercase tracking-[0.2em] text-[10px]">Total réglé</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter">1 260 000</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-[2rem] p-6 flex items-center gap-6 border border-white/10 shadow-inner">
                                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-[10px] font-black text-white shadow-2xl shadow-orange-500/30">
                                    PAY
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Réglé via</p>
                                    <p className="text-sm font-black text-white uppercase italic">Digital Pay</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-5">
                            <Link href="/dashboard" className="w-full">
                                <motion.button 
                                    whileHover={{ y: -5 }}
                                    className="w-full bg-white dark:bg-slate-800 hover:shadow-2xl text-[#1a2b4b] dark:text-white font-black py-6 px-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px]"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-primary" />
                                    Accéder au Dashboard
                                </motion.button>
                            </Link>

                            <button className="w-full bg-[#1a2b4b] text-white font-black py-6 px-8 rounded-[2rem] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 group">
                                <Download className="h-5 w-5 text-primary group-hover:animate-bounce" />
                                Reçu de Voyage (PDF)
                            </button>

                            <Link href="/" className="w-full">
                                <button className="w-full text-slate-400 hover:text-primary font-black py-4 transition-all flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] group">
                                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-3 transition-transform" />
                                    Retour Accueil
                                </button>
                            </Link>
                        </div>

                        {/* Help section */}
                        <div className="p-8 bg-primary/5 border-2 border-dashed border-primary/20 rounded-[2.5rem] shadow-sm">
                            <p className="text-[11px] font-black text-[#1a2b4b] dark:text-slate-200 mb-4 uppercase tracking-[0.2em]">Karamoko Support</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium italic">
                                "Notre équipe locale à Labé est déjà en train de préparer votre arrivée."
                            </p>
                            <a href="tel:+224620000000" className="text-lg font-black text-primary flex items-center gap-4 hover:tracking-widest transition-all">
                                <PhoneCall className="h-6 w-6" />
                                620 00 00 00
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
