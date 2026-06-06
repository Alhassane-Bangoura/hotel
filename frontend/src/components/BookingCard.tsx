'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CreditCard, Headphones, TrendingUp, Sparkles, ShieldCheck, Zap, Info } from 'lucide-react';
import { Button } from './ui/Button';

import { useAuthStore } from '@/store/useAuthStore';

export function BookingCard({ price, hotelName }: { price: number, hotelName: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useAuthStore();
    const nights = 3;
    const total = price * nights;

    const handleBooking = () => {
        const id = window.location.pathname.split('/').pop();
        if (!isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(`/bookings/new?id=${id}`)}`);
        } else {
            router.push(`/bookings/new?id=${id}`);
        }
    };

    return (
        <>
            {/* Desktop & Tablet Sidebar */}
            <motion.aside 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:block sticky top-28"
            >
                <div className="bg-white dark:bg-slate-900 border-t-8 border-primary rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Header with Price */}
                    <div className="p-10 bg-[#1a2b4b]/5 dark:bg-[#1a2b4b]/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-3">Tarif exclusif</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{price.toLocaleString()}</span>
                            <div className="flex flex-col">
                                <span className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">GNF</span>
                                <span className="text-slate-400 font-bold text-[10px] uppercase">/ nuit</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Summary Info */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                <span className="flex items-center gap-2"><TrendingUp className="h-3 w-3 text-primary" /> Séjour de {nights} nuits</span>
                                <span className="text-[#1a2b4b] dark:text-white">{(price * nights).toLocaleString()} GNF</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                <span className="text-slate-500">Frais & Taxes LabéBooking</span>
                                <span className="text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30 font-bold">OFFERT</span>
                            </div>
                            
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">Total à payer</span>
                                    <span className="text-4xl font-black text-primary tracking-tighter">{total.toLocaleString()} GNF</span>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-2xl animate-pulse">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Main CTA */}
                        <Button 
                            onClick={handleBooking}
                            className="w-full h-20 bg-[#1a2b4b] hover:bg-[#1a2b4b]/95 dark:bg-primary dark:text-[#1a2b4b] text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-black/20"
                        >
                            Réserver maintenant
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </Button>

                        {/* Trust Badges */}
                        <div className="space-y-5 pt-4 border-t border-slate-50 dark:border-slate-800">
                            {[
                                { icon: ShieldCheck, label: "Paiement sécurisé", color: "text-green-500", bg: "bg-green-50" },
                                { icon: Zap, label: "Confirmation immédiate", color: "text-orange-500", bg: "bg-orange-50" },
                                { icon: Headphones, label: "Support local 24/7", color: "text-blue-500", bg: "bg-blue-50" }
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#1a2b4b] dark:text-slate-400">
                                    <div className={`${badge.bg} dark:bg-slate-800 p-2.5 rounded-xl`}>
                                        <badge.icon className={`h-4 w-4 ${badge.color}`} />
                                    </div>
                                    {badge.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1a2b4b] p-5 text-center">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.4em]">Sûr • Rapide • Guinéen</p>
                    </div>
                </div>

                {/* Scarcity Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-red-50 dark:bg-red-950/20 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-[2.5rem] flex items-center gap-4"
                >
                    <div className="relative">
                        <div className="bg-red-500 h-3 w-3 rounded-full animate-ping absolute" />
                        <div className="bg-red-600 h-3 w-3 rounded-full relative" />
                    </div>
                    <p className="text-[10px] font-black text-red-900 dark:text-red-300 uppercase tracking-widest leading-relaxed">
                        Forte demande : <span className="underline">Dernières chambres</span> pour ces dates !
                    </p>
                </motion.div>
            </motion.aside>

            {/* Mobile Sticky Footer - Premium UX */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] p-4 pb-safe-area-inset-bottom">
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4"
                >
                    <div className="pl-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                        <p className="text-xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">
                            {total.toLocaleString()} <span className="text-[10px] uppercase tracking-normal">GNF</span>
                        </p>
                    </div>
                    <Button 
                        onClick={handleBooking}
                        className="flex-1 bg-[#1a2b4b] dark:bg-primary text-white dark:text-[#1a2b4b] h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20"
                    >
                        Réserver ma suite
                    </Button>
                </motion.div>
            </div>
        </>
    );
}

import { ArrowRight } from "lucide-react";
