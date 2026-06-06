'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronRight, ChevronLeft, Bed, Wallet, 
    Camera, CheckCircle, Info, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { hotelBusinessService } from '@/services/hotelBusinessService';
import { useToast } from '@/components/ui/Toast';

const STEPS = [
    { id: 1, label: 'Type', icon: Bed },
    { id: 2, label: 'Prix', icon: Wallet },
    { id: 3, label: 'Photos', icon: Camera },
    { id: 4, label: 'Détails', icon: Info },
    { id: 5, label: 'Fin', icon: CheckCircle },
];

export default function NewRoomPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const [roomData, setRoomData] = useState({
        name: '',
        type: 'Standard',
        price: '',
        capacity: 2,
        description: '',
        category: 'Standard'
    });

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Get hotel ID for the user
            const { data: { user } } = await supabase.auth.getUser();
            const { data: hotel } = await supabase.from('hotels').select('id').eq('user_id', user?.id).single();
            
            if (!hotel) throw new Error("Hôtel non trouvé");

            await hotelBusinessService.publishRoom({
                ...roomData,
                hotel_id: hotel.id,
                price: Number(roomData.price)
            });

            showToast('Chambre publiée avec succès !', 'success');
            setStep(5);
        } catch (err) {
            showToast('Erreur lors de la publication', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] py-20 px-4 flex flex-col items-center">
            <div className="max-w-2xl w-full space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter leading-none">
                        Nouvelle <br /><span className="text-primary italic">Chambre</span>
                    </h1>
                    <p className="text-slate-400 font-medium italic">"Publiez votre inventaire sur le réseau national."</p>
                </header>

                {/* Progress */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-3 relative flex-1">
                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${step >= s.id ? 'bg-primary text-[#1a2b4b] shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`absolute left-1/2 w-full h-[2px] top-6 -z-0 ${step > s.id ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-10 md:p-16 space-y-10 text-left">
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Nom de la chambre</label>
                                            <input 
                                                value={roomData.name}
                                                onChange={e => setRoomData({...roomData, name: e.target.value})}
                                                className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold placeholder:italic" 
                                                placeholder="ex: Suite Royale Bafing"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Catégorie</label>
                                                <select 
                                                    value={roomData.category}
                                                    onChange={e => setRoomData({...roomData, category: e.target.value})}
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold appearance-none cursor-pointer">
                                                    <option>Standard</option>
                                                    <option>Deluxe</option>
                                                    <option>Suite</option>
                                                    <option>VIP</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Capacité Max</label>
                                                <input 
                                                    type="number"
                                                    value={roomData.capacity}
                                                    onChange={e => setRoomData({...roomData, capacity: Number(e.target.value)})}
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold" 
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={nextStep} className="w-full py-7 bg-[#1a2b4b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl">Continuer <ChevronRight className="h-4 w-4 text-primary ml-2" /></Button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Prix par nuit (GNF)</label>
                                            <input 
                                                type="number"
                                                value={roomData.price}
                                                onChange={e => setRoomData({...roomData, price: e.target.value})}
                                                className="w-full px-8 py-7 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-3xl font-black text-primary text-center" 
                                                placeholder="0"
                                            />
                                        </div>
                                        <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">Le prix moyen dans votre zone est de 450.000 GNF</p>
                                        <div className="flex gap-4">
                                            <Button onClick={prevStep} variant="outline" className="flex-1 py-7 rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Retour</Button>
                                            <Button onClick={nextStep} className="flex-[2] py-7 bg-[#1a2b4b] text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Valider le prix</Button>
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="text-center space-y-8 py-10">
                                        <div className="relative inline-block">
                                            <Sparkles className="h-32 w-32 text-primary animate-pulse" />
                                            <div className="absolute inset-0 bg-primary blur-3xl opacity-20 -z-10" />
                                        </div>
                                        <h2 className="text-4xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter">Félicitations !</h2>
                                        <p className="text-slate-500 font-medium italic">Votre chambre est désormais visible par tous les voyageurs.</p>
                                        <Button onClick={() => router.push('/dashboard/hotel/business')} className="w-full py-7 bg-primary text-[#1a2b4b] rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Retour au Dashboard Business</Button>
                                    </div>
                                )}

                                {step < 5 && step > 2 && (
                                    <div className="text-center py-20 space-y-8">
                                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Configuration de l'inventaire...</p>
                                        <Button onClick={handleSubmit} className="w-full py-7 bg-[#1a2b4b] text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px]">Finaliser & Publier</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
