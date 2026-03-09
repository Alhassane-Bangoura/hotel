'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Calendar, Users, Clock, ShieldCheck, Zap, Lock, Loader2, Sparkles } from 'lucide-react';
import { CheckoutForm } from '@/components/CheckoutForm';
import { PaymentMethods } from '@/components/PaymentMethods';
import { hotelService, Hotel } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/components/ui/Toast';

function CheckoutPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const { user } = useAuthStore();
    
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [room, setRoom] = useState<Hotel | null>(null);
    
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        country: 'Guinée',
        specialRequests: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('orange_money');

    const roomId = searchParams.get('id');

    useEffect(() => {
        const fetchRoom = async () => {
            if (roomId) {
                setPageLoading(true);
                const data = await hotelService.getHotelById(roomId);
                setRoom(data || null);
                setPageLoading(false);
            } else {
                router.push('/hotels');
            }
        };
        fetchRoom();
    }, [roomId, router]);

    const handleConfirm = async () => {
        if (!formData.fullName || !formData.email || !formData.phone) {
            showToast('Veuillez remplir les informations obligatoires', 'error');
            return;
        }

        if (!room) return;

        setLoading(true);
        try {
            const bookingData = {
                userId: user?.id || 'guest',
                hotelId: room.id,
                checkIn: '2024-07-12', // Simulated dates
                checkOut: '2024-07-15',
                totalPrice: room.price * 3,
                guests: 2
            };

            const result = await bookingService.createBooking(bookingData);
            
            showToast('Réservation confirmée via ' + paymentMethod.replace('_', ' ').toUpperCase(), 'success');
            setTimeout(() => {
                router.push('/bookings/success');
            }, 1000);
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Une erreur est survenue lors de la réservation', 'error');
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
                    <span className="hover:text-primary cursor-pointer transition-colors">Guinée</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#1a2b4b] dark:text-slate-200 uppercase">Finalisation</span>
                </motion.nav>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
                    {/* Left Column: Guest Info & Payment */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-7 space-y-12 md:space-y-16"
                    >
                        <header className="space-y-4 text-center md:text-left">
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1a2b4b] dark:text-white mb-4 tracking-tighter uppercase leading-[0.9]">Dernière étape <br /><span className="text-primary">Avant Labé</span></h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl italic">
                                "Le voyage d'une vie commence souvent par une simple réservation bien faite."
                            </p>
                        </header>

                        <div className="space-y-20">
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-primary h-8 w-2 rounded-full" />
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white text-xs">Identité du voyageur</h3>
                                </div>
                                <CheckoutForm data={formData} onChange={setFormData} />
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-primary h-8 w-2 rounded-full" />
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-[#1a2b4b] dark:text-white text-xs">Moyen de paiement local</h3>
                                </div>
                                <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} />
                            </section>
                        </div>
                    </motion.div>

                    {/* Right Column: Summary Card */}
                    <div className="md:col-span-12 lg:col-span-5">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="sticky top-12"
                        >
                            <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 border border-slate-100 dark:border-slate-800">
                                {/* Room Preview */}
                                <div className="relative h-72 group overflow-hidden">
                                    <Image
                                        src={room.image}
                                        alt={room.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b]/80 to-transparent" />
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <span className="px-5 py-2 bg-primary text-[#1a2b4b] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl mb-4 inline-block">
                                            Votre sélection
                                        </span>
                                        <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">{room.name}</h3>
                                        <div className="flex items-center gap-2 text-white/70 font-black text-[10px] mt-2 uppercase tracking-widest">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            {room.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-10 space-y-10">
                                    {/* Trip Details Grid */}
                                    <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-100 dark:border-slate-800">
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Check-in</p>
                                            <p className="font-black text-[#1a2b4b] dark:text-white uppercase text-sm">12 Juil. 2024</p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Check-out</p>
                                            <p className="font-black text-[#1a2b4b] dark:text-white uppercase text-sm">15 Juil. 2024</p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Nuits</p>
                                            <p className="font-black text-[#1a2b4b] dark:text-white flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-primary" /> 3 NUITS
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Capacité</p>
                                            <p className="font-black text-[#1a2b4b] dark:text-white flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-primary" /> 2 ADULTES
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                            <span>Prix de base × 3</span>
                                            <span className="text-[#1a2b4b] dark:text-white">{(room.price * 3).toLocaleString()} GNF</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                                            <span>Frais de plateforme</span>
                                            <span className="text-green-600">OFFERT</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                                            <span className="font-black uppercase tracking-[0.2em] text-slate-400 text-xs">Total final</span>
                                            <div className="text-right">
                                                <span className="text-4xl font-black text-primary tracking-tighter">{(room.price * 3).toLocaleString()} <span className="text-xs">GNF</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleConfirm}
                                        disabled={loading}
                                        className="w-full py-6 bg-primary text-[#1a2b4b] font-black rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all text-xs uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center gap-4"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sceller ma réservation'}
                                        <Sparkles className="h-4 w-4" />
                                    </motion.button>

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-1 gap-4 pt-4">
                                        {[
                                            { icon: Lock, label: 'Connexion SSL Sécurisée', color: 'text-green-500' },
                                            { icon: Zap, label: 'Validation Instantanée', color: 'text-orange-500' },
                                            { icon: ShieldCheck, label: 'Assurance Annulation Incluse', color: 'text-blue-500' }
                                        ].map((badge, i) => (
                                            <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                                                    <badge.icon className={`h-4 w-4 ${badge.color}`} />
                                                </div>
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
