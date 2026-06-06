'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useState } from 'react';
import { Menu, X, Hotel, Calendar, LogOut, LayoutDashboard, ShieldCheck, Building2, Bell, Home, Search, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { NotificationDropdown } from './NotificationDropdown';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/partners', label: 'Hôtels à Labé', icon: Hotel },
    { href: '/hotels', label: 'Rechercher', icon: Search },
    { href: '/events', label: 'Événements', icon: Calendar },
    { href: '/about', label: 'À propos', icon: Hotel },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const [isRouting, setIsRouting] = useState(false);
    const [routingStep, setRoutingStep] = useState(1);

    const handleAccountClick = (e: React.MouseEvent) => {
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
                // Step 3: Success and redirect
                setTimeout(() => {
                    setIsRouting(false);
                    // Determine route based on user.role
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
        <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
            <div className="container px-4 sm:px-6 flex h-16 md:h-20 items-center justify-between">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <div className="text-primary">
                        <Hotel className="h-7 w-7 md:h-9 md:h-9" />
                    </div>
                    <h2 className="text-navy-deep dark:text-white text-lg md:text-xl font-display font-extrabold tracking-tight">
                        Labé<span className="text-primary">Booking</span>
                    </h2>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map(({ href, label }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href) && !(href === '/hotels' && pathname.startsWith('/hotels/onboarding')));
                        return (
                            <Link 
                                key={href} 
                                href={href} 
                                className={`font-semibold transition-all duration-300 text-sm relative py-2 ${
                                    isActive 
                                        ? "text-primary font-black" 
                                        : "text-slate-600 dark:text-slate-300 hover:text-primary"
                                }}`}
                            >
                                {label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                    <Link href="/hotels/onboarding" className="flex items-center gap-2 text-primary font-bold transition-colors text-sm group">
                        <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Devenir Partenaire
                    </Link>
                </nav>

                {/* Desktop auth actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <NotificationDropdown />
                            <Button onClick={handleAccountClick} className="shadow-lg shadow-primary/20 gap-2">
                                {user.role === 'admin' ? <ShieldCheck className="h-4 w-4 text-[#1a2b4b]" /> : <LayoutDashboard className="h-4 w-4" />}
                                {user.role === 'admin' ? 'Administration' : 'Mon Compte'}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Déconnexion" className="text-slate-500 hover:text-destructive">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login"><Button variant="ghost" className="font-semibold">Connexion</Button></Link>
                            <Link href="/login?tab=register"><Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary/20">S'inscrire</Button></Link>
                        </div>
                    )}
                </div>

                {/* Mobile burger button */}
                <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden border-t bg-white dark:bg-slate-900 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href) && !(href === '/hotels' && pathname.startsWith('/hotels/onboarding')));
                        return (
                            <Link 
                                key={href} 
                                href={href} 
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-300 font-semibold ${
                                    isActive 
                                        ? "bg-primary/10 text-primary" 
                                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                                }}`}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-primary stroke-[2.5px]' : 'text-slate-400 dark:text-slate-500'}`} />
                                {label}
                            </Link>
                        );
                    })}
                    <div className="border-t pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Button onClick={handleAccountClick} className="w-full gap-2 py-6 rounded-xl shadow-lg shadow-primary/20">
                                    <LayoutDashboard className="h-5 w-5" />Mon espace
                                </Button>
                                <Button className="w-full gap-2 py-6 rounded-xl" variant="ghost" onClick={() => { signOut(); setMenuOpen(false); }}><LogOut className="h-5 w-5" />Déconnexion</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="outline" className="w-full py-6 rounded-xl">Connexion</Button></Link>
                                <Link href="/login?tab=register" onClick={() => setMenuOpen(false)}><Button className="w-full py-6 rounded-xl bg-primary shadow-lg shadow-primary/20">S'inscrire</Button></Link>
                            </>
                        )}
                    </div>
                </div>
            )}

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
        </header>
    );
}
