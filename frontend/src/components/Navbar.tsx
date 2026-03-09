'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useState } from 'react';
import { Menu, X, Hotel, Calendar, LogOut, LayoutDashboard, ShieldCheck, Building2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

const NAV_LINKS = [
    { href: '/hotels', label: 'Hôtels', icon: Hotel },
    { href: '/events', label: 'Événements', icon: Calendar },
    { href: '/about', label: 'À propos', icon: Hotel },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useUser();

    return (
        <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
            <div className="container flex h-20 items-center justify-between">
                {/* Logo & Brand */}
                <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <div className="text-primary">
                        <Hotel className="h-9 w-9" />
                    </div>
                    <h2 className="text-navy-deep dark:text-white text-xl font-display font-extrabold tracking-tight">
                        Labé<span className="text-primary">Booking</span>
                    </h2>
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map(({ href, label }) => (
                        <Link key={href} href={href} className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium transition-colors text-sm">
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop auth actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href={user.role === 'hotel' ? '/dashboard/hotel' : user.role === 'admin' ? '/admin' : '/dashboard'}>
                                <Button className="shadow-lg shadow-primary/20 gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Mon Compte
                                </Button>
                            </Link>
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
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-4 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold text-slate-700 dark:text-slate-200">
                            <Icon className="h-5 w-5 text-primary" />{label}
                        </Link>
                    ))}
                    <div className="border-t pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link href={user.role === 'hotel' ? '/dashboard/hotel' : '/dashboard'} onClick={() => setMenuOpen(false)}>
                                    <Button className="w-full gap-2 py-6 rounded-xl shadow-lg shadow-primary/20"><LayoutDashboard className="h-5 w-5" />Mon espace</Button>
                                </Link>
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
        </header>
    );
}
