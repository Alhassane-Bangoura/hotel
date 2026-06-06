'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Hotel, Calendar, User, Search, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/partners', label: 'Hôtels', icon: Hotel },
    { href: '/hotels', label: 'Recherche', icon: Search },
    { href: '/events', label: 'Événements', icon: Calendar },
    { href: '/dashboard', label: 'Profil', icon: User },
];

export function MobileNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const [isRouting, setIsRouting] = useState(false);
    const [routingStep, setRoutingStep] = useState(1);

    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }
        setIsRouting(true);
        setRoutingStep(1);

        // Step 1: Session verification
        setTimeout(() => {
            setRoutingStep(2);
            // Step 2: Role analyzing
            setTimeout(() => {
                setRoutingStep(3);
                // Step 3: Redirect
                setTimeout(() => {
                    setIsRouting(false);
                    if (user.role === 'hotel') {
                        router.push('/dashboard/hotel/command-center');
                    } else if (user.role === 'admin') {
                        router.push('/admin/platform');
                    } else {
                        router.push('/dashboard');
                    }
                }, 800);
            }, 1000);
        }, 1000);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-6 py-3 pb-safe-area-inset-bottom dark:bg-slate-950/95 dark:border-slate-800">
            <nav className="flex items-center justify-between max-w-lg mx-auto">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link 
                            key={href} 
                            href={href}
                            onClick={label === 'Profil' ? handleProfileClick : undefined}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300 relative",
                                isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300",
                                isActive ? "bg-primary/10" : "bg-transparent"
                            )}>
                                <Icon className={cn("h-6 w-6", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                isActive ? "opacity-100" : "opacity-60"
                            )}>
                                {label}
                            </span>
                            {isActive && (
                                <div className="absolute -top-3 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <AnimatePresence>
                {isRouting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-white/5 shadow-2xl p-10 max-w-md w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-navy-deep/5 pointer-events-none" />
                            
                            {/* Animated Glowing Loader */}
                            <div className="relative inline-flex items-center justify-center mb-8">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                                {routingStep < 3 ? (
                                    <div className="relative">
                                        <Loader2 className="h-16 w-16 text-primary animate-spin" />
                                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full opacity-20 pointer-events-none" />
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-green-500/10 text-green-500 p-4 rounded-full ring-8 ring-green-500/5 shadow-2xl shadow-green-500/20"
                                    >
                                        <ShieldCheck className="h-12 w-12" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-2xl font-black text-navy-deep dark:text-white uppercase tracking-tight">
                                    {routingStep === 1 && "Vérification Securisée"}
                                    {routingStep === 2 && "Analyse du Profil"}
                                    {routingStep === 3 && "Accès Autorisé"}
                                </h3>
                                
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium italic min-h-[40px] px-4 flex items-center justify-center">
                                    {routingStep === 1 && "Nous authentifions vos cookies de session et jetons sécurisés..."}
                                    {routingStep === 2 && `Analyse des privilèges : Rôle détecté : [ ${user?.role === 'hotel' ? 'Gérant d\'Hôtel' : user?.role === 'admin' ? 'Administrateur' : 'Voyageur'} ]`}
                                    {routingStep === 3 && "Préparation de votre espace de travail. Redirection..."}
                                </p>
                            </div>

                            {/* Micro-bar */}
                            <div className="mt-8 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ 
                                        width: routingStep === 1 ? "33%" : routingStep === 2 ? "66%" : "100%" 
                                    }}
                                    transition={{ duration: 0.8 }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
