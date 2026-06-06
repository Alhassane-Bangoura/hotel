'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Calendar, Users, Clock, ShieldCheck, Zap, Lock, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { PaymentMethods } from '@/components/PaymentMethods';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { paymentService } from '@/services/paymentService';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';

function CheckoutPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const { user } = useAuthStore();
    
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [room, setRoom] = useState<any>(null);
    const [paymentProgress, setPaymentProgress] = useState({ message: '', percent: 0 });
    
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        country: 'Guinée',
        specialRequests: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('orange_money');

    const roomId = searchParams.get('id');

    useEffect(() => {
        const fetchRoom = async () => {
            if (roomId) {
                try {
                    setPageLoading(true);
                    const data = await hotelService.getRoomById(roomId);
                    setRoom(data || null);
                } catch (error) {
                    console.error('Error fetching room:', error);
                    showToast('Erreur lors de la récupération de la chambre', 'error');
                } finally {
                    setPageLoading(false);
                }
            } else {
                router.push('/hotels');
            }
        };
        fetchRoom();
    }, [roomId, router]);

    const handleConfirm = async () => {
        if (!user) {
            showToast('Veuillez vous connecter pour réserver', 'error');
            return;
        }

        if (!formData.fullName || !formData.email || !formData.phone) {
            showToast('Veuillez remplir les informations obligatoires', 'error');
            return;
        }

        if (!room) return;

        setLoading(true);
        try {
            const nights = 3; // Dynamique
            const totalPrice = room.price * nights;
            
            // 1. Création initiale de la réservation (statut pending)
            const bookingData = {
                user_id: user.id,
                room_id: room.id,
                hotel_id: room.hotel_id,
                check_in: '2024-07-12',
                check_out: '2024-07-15',
                total_price: totalPrice,
                guests: 2,
                status: 'pending' as const
            };

            const booking = await bookingService.createBooking(bookingData);
            
            // 2. Simulation du paiement professionnel
            await paymentService.processSimulatedPayment(
                {
                    booking_id: booking.id,
                    method: paymentMethod as any,
                    amount: totalPrice
                },
                (message, percent) => {
                    setPaymentProgress({ message, percent });
                }
            );
            
            showToast('Réservation confirmée avec succès !', 'success');
            router.push('/bookings/success');
        } catch (error: any) {
            console.error('Checkout error:', error);
            showToast(error.message || 'Une erreur est survenue', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Sécurisation de votre réservation...</p>
            </div>
        );
    }

    if (!room) return null;

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12 w-full">
                {/* Breadcrumbs */}
                <motion.nav 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-12"
                >
                    <span onClick={() => router.push('/hotels')} className="hover:text-primary cursor-pointer transition-colors">Hôtels</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="hover:text-primary cursor-pointer transition-colors">{room.hotels?.city || 'Guinée'}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#1a2b4b] dark:text-slate-200 uppercase">Finalisation</span>
                </motion.nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
                    {/* Left Column: Guest Info & Payment */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-7 space-y-12 md:space-y-16"
                    >
                        <header className="space-y-4 text-left">
                            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#1a2b4b] dark:text-white mb-4 tracking-tighter uppercase leading-[0.8]">
                                Finalisez <br /><span className="text-primary underline decoration-8 underline-offset-[12px]">votre séjour</span>
                            </h2>
                            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl italic mt-8">
                                "La dernière étape avant de vivre l'exceptionnel à {room.hotels?.name}."
                            </p>
                        </header>

                        <div className="space-y-24 mt-16">
                            <section>
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="bg-primary h-12 w-3 rounded-full shadow-lg shadow-primary/20" />
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white">Détails personnels</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
                                    <CheckoutForm data={formData} onChange={setFormData} />
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="bg-primary h-12 w-3 rounded-full shadow-lg shadow-primary/20" />
                                    <h3 className="text-3xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white">Paiement Mobile Money</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
                                    <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} />
                                </div>
                            </section>
                        </div>
                    </motion.div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:col-span-5">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="sticky top-28"
                        >
                            <div className="bg-[#1a2b4b] dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-4 border-white dark:border-slate-800">
                                {/* Room Preview Header */}
                                <div className="relative h-64 group">
                                    <Image
                                        src={room.image_url || room.hotels?.image_url}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b] via-transparent to-transparent opacity-90" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-4 py-1.5 bg-primary text-[#1a2b4b] rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
                                                {room.name}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">{room.hotels?.name}</h3>
                                    </div>
                                </div>

                                <div className="p-8 sm:p-10 space-y-10 text-white">
                                    {/* Trip Details */}
                                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                        <div className="space-y-2">
                                            <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Arrivée</p>
                                            <p className="font-black text-white uppercase text-sm flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" /> 12 Juil. 2024
                                            </p>
                                        </div>
                                        <div className="space-y-2 text-right md:text-left">
                                            <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Départ</p>
                                            <p className="font-black text-white uppercase text-sm">15 Juil. 2024</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Durée</p>
                                            <p className="font-black text-white flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-primary" /> 3 NUITS
                                            </p>
                                        </div>
                                        <div className="space-y-2 text-right md:text-left">
                                            <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Invités</p>
                                            <p className="font-black text-white flex items-center gap-2 text-sm justify-end md:justify-start">
                                                <Users className="h-4 w-4 text-primary" /> {room.capacity} MAX
                                            </p>
                                        </div>
                                    </div>

                                    {/* Financials */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40">
                                            <span>Tarif chambre × 3</span>
                                            <span className="text-white">{(room.price * 3).toLocaleString()} GNF</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-white/40">
                                            <span>Frais plateforme</span>
                                            <span className="text-primary italic">INCLUS</span>
                                        </div>
                                        <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                            <div>
                                                <span className="font-black uppercase tracking-[0.2em] text-white/40 text-[10px] block mb-2">Total à payer</span>
                                                <span className="text-5xl font-black text-primary tracking-tighter italic">
                                                    {(room.price * 3).toLocaleString()} <span className="text-xs not-italic">GNF</span>
                                                </span>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <ShieldCheck className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="w-full py-7 bg-primary text-[#1a2b4b] font-black rounded-2xl shadow-[0_20px_40px_rgba(244,157,37,0.3)] hover:shadow-[0_30px_60px_rgba(244,157,37,0.4)] transition-all text-xs uppercase tracking-[0.4em] disabled:opacity-50 flex items-center justify-center gap-4 group"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirmer ma réservation'}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-3 transition-transform" />
                                    </motion.button>

                                    {/* Micro trust indicators */}
                                    <div className="flex flex-col gap-4 pt-4 opacity-60">
                                        {[
                                            { icon: Lock, label: 'Connexion 100% sécurisée', color: 'text-white' },
                                            { icon: Zap, label: 'Confirmation immédiate', color: 'text-white' }
                                        ].map((badge, i) => (
                                            <div key={i} className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white">
                                                <badge.icon className="h-3 w-3 text-primary" />
                                                {badge.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#111827] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Chargement sécurisé...</p>
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    );
}
