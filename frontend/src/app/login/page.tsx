'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Hotel, Mail, Lock, Phone, ShieldCheck, CreditCard, UserCheck, User, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState<'login' | 'register'>(
        tabParam === 'register' ? 'register' : 'login'
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'client' | 'hotel' | 'organizer'>('client');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (activeTab === 'login') {
                await authService.signIn(email, password);
                router.push('/dashboard');
            } else {
                await authService.signUp(email, password, name, role);
                alert('Inscription réussie ! Veuillez vérifier votre email.');
                setActiveTab('login');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Une erreur est survenue lors de l\'authentification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f7f5] dark:bg-[#111827] min-h-screen flex items-center justify-center p-0 md:p-6 lg:p-12">
            <div className="flex flex-col lg:flex-row w-full max-w-[1440px] min-h-[850px] bg-white dark:bg-slate-900 overflow-hidden shadow-2xl rounded-none md:rounded-3xl lg:rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                {/* Left Side: Immersive Image (Hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-16 text-white overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/room_executive_1772793107544.png"
                            alt="Luxury Hotel Labé"
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b] via-[#1a2b4b]/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f49d25] p-3 rounded-2xl shadow-xl">
                                <Hotel className="h-8 w-8 text-[#1a2b4b]" />
                            </div>
                            <span className="text-3xl font-black tracking-tight uppercase">Hôtel Labé</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
                                Réservez votre <span className="text-[#f49d25]">confort</span> à Labé
                            </h1>
                            <p className="text-xl text-slate-200 max-w-md font-medium leading-relaxed opacity-90">
                                Accédez aux meilleures chambres du Fouta Djallon avec un service personnalisé et sécurisé.
                            </p>
                        </div>

                        <div className="pt-10 flex gap-12">
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-black text-[#f49d25]">500+</span>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Chambres disponibles</span>
                            </div>
                            <div className="w-px h-16 bg-white/20"></div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl font-black text-[#f49d25]">4.9/5</span>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Note clients</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="lg:hidden flex justify-between items-center mb-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#f49d25] p-2 rounded-xl">
                                <Hotel className="h-5 w-5 text-[#1a2b4b]" />
                            </div>
                            <span className="font-black text-[#1a2b4b] dark:text-white uppercase tracking-widest text-xs">Hôtel Labé</span>
                        </div>
                    </div>

                    <div className="max-w-md w-full mx-auto flex flex-col h-full">
                        {/* Tab Switcher */}
                        <div className="flex border-b-2 border-slate-50 dark:border-slate-800 mb-12">
                            <button
                                onClick={() => { setActiveTab('login'); setError(null); }}
                                className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'login' ? 'border-[#f49d25] text-[#1a2b4b] dark:text-white' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => { setActiveTab('register'); setError(null); }}
                                className={`flex-1 py-5 text-sm font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'register' ? 'border-[#f49d25] text-[#1a2b4b] dark:text-white' : 'border-transparent text-slate-300 hover:text-slate-500'}`}
                            >
                                Inscription
                            </button>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h2 className="text-4xl font-black text-[#1a2b4b] dark:text-white tracking-tighter">
                                    {activeTab === 'login' ? 'Bon retour !' : 'Rejoignez-nous'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">
                                    {activeTab === 'login' ? 'Veuillez entrer vos identifiants pour accéder à votre espace.' : 'Créez votre compte pour commencer à réserver vos séjours.'}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                    <AlertCircle className="h-5 w-5" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="space-y-6">
                                {activeTab === 'register' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nom complet</label>
                                            <div className="relative group">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#f49d25] transition-colors" />
                                                <input
                                                    className="w-full pl-16 pr-6 py-5 bg-[#f8f7f5] dark:bg-slate-800/50 border-2 border-transparent focus:border-[#f49d25]/30 rounded-2xl focus:ring-0 text-[#1a2b4b] dark:text-white font-bold transition-all outline-none"
                                                    placeholder="Jean Dupont"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Je suis un...</label>
                                            <select
                                                className="w-full px-6 py-5 bg-[#f8f7f5] dark:bg-slate-800/50 border-2 border-transparent focus:border-[#f49d25]/30 rounded-2xl focus:ring-0 text-[#1a2b4b] dark:text-white font-bold transition-all outline-none appearance-none"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value as any)}
                                            >
                                                <option value="client">Client (Voyageur)</option>
                                                <option value="hotel">Hôtelier (Gérant d'hôtel)</option>
                                                <option value="organizer">Organisateur d'événements</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Adresse e-mail</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#f49d25] transition-colors" />
                                        <input
                                            className="w-full pl-16 pr-6 py-5 bg-[#f8f7f5] dark:bg-slate-800/50 border-2 border-transparent focus:border-[#f49d25]/30 rounded-2xl focus:ring-0 text-[#1a2b4b] dark:text-white font-bold transition-all outline-none"
                                            placeholder="jean.dupont@email.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mot de passe</label>
                                        {activeTab === 'login' && (
                                            <button type="button" className="text-[10px] font-black text-[#f49d25] hover:underline uppercase tracking-widest">Oublié ?</button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#f49d25] transition-colors" />
                                        <input
                                            className="w-full pl-16 pr-6 py-5 bg-[#f8f7f5] dark:bg-slate-800/50 border-2 border-transparent focus:border-[#f49d25]/30 rounded-2xl focus:ring-0 text-[#1a2b4b] dark:text-white font-bold transition-all outline-none"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                {activeTab === 'login' && (
                                    <div className="flex items-center gap-3 px-1">
                                        <input className="h-5 w-5 rounded-lg text-[#f49d25] focus:ring-[#f49d25] border-slate-200 bg-[#f8f7f5] dark:bg-slate-800 dark:border-slate-700 pointer-events-auto cursor-pointer" id="remember" type="checkbox" />
                                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer" htmlFor="remember">Se souvenir de moi</label>
                                    </div>
                                )}

                                <div className="pt-6 space-y-4">
                                    <button
                                        disabled={loading}
                                        className="w-full bg-[#f49d25] text-[#1a2b4b] font-black py-6 rounded-[1.5rem] shadow-xl shadow-[#f49d25]/20 hover:shadow-[#f49d25]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (activeTab === 'login' ? 'Se connecter' : 'Créer un compte')}
                                    </button>

                                    <button type="button" className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1a2b4b] dark:text-slate-200 font-black py-6 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm">
                                        <Phone className="h-5 w-5 text-[#f49d25]" />
                                        Via Téléphone
                                    </button>
                                </div>
                            </form>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] shadow-inner">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 leading-tight">Sécurité Totale</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] shadow-inner">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 leading-tight">Paiement Protégé</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f49d25]/10 flex items-center justify-center text-[#f49d25] shadow-inner">
                                        <UserCheck className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 leading-tight">Confidentialité</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-16 flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                            <Link href="/terms" className="hover:text-[#f49d25] transition-colors">Conditions</Link>
                            <Link href="/privacy" className="hover:text-[#f49d25] transition-colors">Confidentialité</Link>
                            <Link href="/help" className="hover:text-[#f49d25] transition-colors">Support</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#f8f7f5] dark:bg-[#111827]">
                <Loader2 className="h-10 w-10 animate-spin text-[#f49d25]" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}
