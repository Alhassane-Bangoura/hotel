'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Headphones, TrendingUp, Sparkles } from 'lucide-react';

export function BookingCard({ price, hotelName }: { price: number, hotelName: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const nights = 3;
    const total = price * nights;

    const handleBooking = () => {
        const id = window.location.pathname.split('/').pop();
        router.push(`/bookings/new?id=${id}`);
    };

    return (
        <motion.aside 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 sticky top-12"
        >
            <div className="bg-white dark:bg-slate-900 border-t-8 border-primary rounded-[2.5rem] shadow-2xl overflow-hidden shadow-black/10">
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 bg-[#1a2b4b]/5">
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{price.toLocaleString()}</span>
                        <span className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">GNF / nuit</span>
                    </div>
                </div>

                <div className="p-10 space-y-10">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span>Séjour de {nights} nuits</span>
                            <span className="text-[#1a2b4b] dark:text-white">{(price * nights).toLocaleString()} GNF</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">Service & Taxes</span>
                            <span className="text-green-600 bg-green-50 px-3 py-1 rounded-lg">OFFERT</span>
                        </div>
                        
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-1">Total à payer</span>
                                <span className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">{total.toLocaleString()} GNF</span>
                            </div>
                            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBooking}
                        className="w-full bg-primary hover:shadow-2xl hover:shadow-primary/40 text-[#1a2b4b] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group"
                    >
                        Confirmer ma suite
                        <TrendingUp className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>

                    <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-[#1a2b4b] dark:text-slate-300">
                            <div className="bg-green-50 p-2.5 rounded-xl">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            Confirmation directe
                        </div>
                        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-[#1a2b4b] dark:text-slate-300">
                            <div className="bg-primary/10 p-2.5 rounded-xl">
                                <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            Paiement local sécurisé
                        </div>
                        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-[#1a2b4b] dark:text-slate-300">
                            <div className="bg-blue-50 p-2.5 rounded-xl">
                                <Headphones className="h-4 w-4 text-blue-600" />
                            </div>
                            H-Labé assistance 24/7
                        </div>
                    </div>
                </div>

                <div className="bg-[#1a2b4b] p-5 text-center">
                    <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.4em]">Propulsé par Hôtel Labé Platform</p>
                </div>
            </div>

            {/* Scarcity / Social Proof */}
            <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-8 p-6 bg-red-50 dark:bg-red-950/20 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-[2rem] flex items-center gap-5"
            >
                <div className="bg-red-500 h-3 w-3 rounded-full animate-ping" />
                <p className="text-[11px] font-black text-red-900 dark:text-red-300 uppercase tracking-widest leading-relaxed">
                    Exclusivité : <span className="underline">Seulement 2 unités restantes</span> pour cette configuration !
                </p>
            </motion.div>
        </motion.aside>
    );
}
