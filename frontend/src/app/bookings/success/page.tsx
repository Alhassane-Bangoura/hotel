'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReviewForm } from '@/components/ReviewForm';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle, Copy, MapPin, Calendar, Users, Hotel, Download, ArrowLeft, PhoneCall, ShieldCheck, Eye, LogOut, LayoutDashboard, CreditCard, Sparkles, Verified, MessageCircle } from 'lucide-react';

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
                    <h1 className="text-5xl md:text-8xl font-black text-[#1a2b4b] dark:text-white mb-6 tracking-tighter uppercase leading-[0.8] drop-shadow-sm">
                        Séjour <br /><span className="text-primary underline decoration-8 underline-offset-8">Confirmé</span>
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed italic">
                        "Votre suite de luxe est prête. Préparez vos valises, Labé vous attend."
                    </p>
                </motion.div>

                {/* Booking Number Banner - "The Passport" */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16 overflow-hidden rounded-[3rem] bg-[#1a2b4b] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] relative group border-4 border-white/5"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="h-32 w-32 text-primary" />
                    </div>
                    <div className="p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                        <div>
                            <p className="text-primary text-[10px] uppercase font-black tracking-[0.5em] mb-4">Votre Passport de Voyage</p>
                            <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter">Référence <br /><span className="text-primary text-4xl md:text-7xl italic font-serif">#{bookingNumber.split('-')[1]}</span></h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={copyToClipboard}
                                className="bg-white hover:bg-primary text-[#1a2b4b] px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95"
                            >
                                <Copy className="h-5 w-5" />
                                Copier le code
                            </button>
                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest text-center">Présentez ce code à la réception</p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Reservation Summary Card */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800 overflow-hidden group"
                        >
                            <div className="h-72 w-full relative overflow-hidden">
                                <Image
                                    src="/room_standard_1772793062441.png"
                                    alt="Luxury Room"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                    <div>
                                        <p className="text-primary font-black text-[10px] uppercase tracking-widest mb-2">Sélectionné</p>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tight">Hôtel Labé Luxury</h3>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                        <Verified className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 lg:p-12">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Arrivée</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-base uppercase">12 Juil 2024</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Départ</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-base uppercase">15 Juil 2024</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Passagers</p>
                                        <p className="font-black text-[#1a2b4b] dark:text-white text-base uppercase">2 Adultes</p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">Statut</p>
                                        <p className="font-black text-green-500 text-base uppercase flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4" /> Garanti
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* WhatsApp Support (Crucial for Guinea) */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-green-500/5 border-4 border-dashed border-green-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10"
                        >
                            <div className="bg-green-500 p-6 rounded-[2rem] shadow-xl shadow-green-500/20">
                                <PhoneCall className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight mb-2">Besoin d'aide immédiate ?</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic mb-6">"Notre conciergerie à Labé vous répond sur WhatsApp."</p>
                                <a 
                                    href="https://wa.me/224620000000" 
                                    target="_blank"
                                    className="inline-flex items-center gap-4 bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Ouvrir WhatsApp
                                </a>
                            </div>
                        </motion.div>

                        {/* Review System */}
                        <div className="pt-10">
                            <ReviewForm 
                                hotelId={hotelId} 
                                bookingId={bookingNumber} 
                            />
                        </div>
                    </div>

                    {/* Right Column: Sidebar Actions */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-10"
                    >
                        {/* Summary Action Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl p-10 border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white mb-8 flex items-center gap-4">
                                <LayoutDashboard className="h-5 w-5 text-primary" /> Prochaines étapes
                            </h3>
                            <div className="space-y-6">
                                <Link href="/dashboard">
                                    <button className="w-full bg-[#1a2b4b] text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                        Voir mes réservations
                                    </button>
                                </Link>
                                <button className="w-full bg-slate-100 dark:bg-slate-700 text-[#1a2b4b] dark:text-white py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-200 transition-all">
                                    <Download className="h-5 w-5" /> Télécharger PDF
                                </button>
                                <Link href="/">
                                    <button className="w-full text-slate-400 hover:text-primary py-4 font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-3 transition-transform" /> Retour accueil
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Safety Badge */}
                        <div className="bg-[#1a2b4b] rounded-[2.5rem] p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 blur-3xl"></div>
                            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-6" />
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2">Sécurité LabéBooking</p>
                            <p className="text-[9px] text-white/50 font-medium leading-relaxed uppercase">Votre transaction est protégée par un cryptage SSL de niveau bancaire.</p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
