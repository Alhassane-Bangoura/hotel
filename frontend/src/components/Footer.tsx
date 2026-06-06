'use client';


import Link from 'next/link';
import { Hotel, MapPin, Phone, MessageSquare, Facebook } from 'lucide-react';



export function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="text-primary">
                                <Hotel className="h-8 w-8" />
                            </div>
                            <h2 className="text-navy-deep dark:text-white text-xl font-display font-extrabold tracking-tight">Labé<span className="text-primary">Booking</span></h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Le premier portail de réservation hôtelière dédié à la ville de Labé et ses environs. Vivez l'hospitalité du Fouta-Djallon.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/alhassane.bangoura.533661" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://www.tiktok.com/@bangoura.alhassan5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.83.99 1.97 1.7 3.23 2.06v3.8c-1.12-.13-2.22-.55-3.17-1.19-.9-.6-1.6-1.42-2.07-2.39-.06 2.51-.04 5.03-.05 7.54-.03 1.29-.31 2.59-.88 3.75-.72 1.48-1.92 2.72-3.41 3.39-1.57.72-3.37.94-5.07.63-1.8-.32-3.48-1.32-4.6-2.78-1.19-1.56-1.74-3.56-1.52-5.52.2-1.8 1.04-3.51 2.4-4.75 1.42-1.3 3.35-2.01 5.3-1.97v3.91c-.69-.02-1.39.11-2.02.43-.88.45-1.54 1.25-1.78 2.21-.33 1.27.05 2.65.95 3.55.85.86 2.08 1.28 3.28 1.1 1.23-.19 2.29-1.09 2.68-2.27.27-.82.26-1.71.26-2.57L12.525.02Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-navy-deep dark:text-white mb-6 uppercase tracking-wider text-sm">Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="/hotels" className="text-slate-500 hover:text-primary transition-colors">Réservation d'hôtels</Link></li>
                            <li><Link href="/events" className="text-slate-500 hover:text-primary transition-colors">Salles de conférence</Link></li>
                            <li><Link href="/events" className="text-slate-500 hover:text-primary transition-colors">Organisation de mariages</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors">Transfert aéroport</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-navy-deep dark:text-white mb-6 uppercase tracking-wider text-sm">Informations</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors">À propos</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors">Blog & Actualités</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors">Confidentialité</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-navy-deep dark:text-white mb-6 uppercase tracking-wider text-sm">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-500">Avenue de la République, Labé, Guinée</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-500">+224 622 46 55 82</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-500">WhatsApp Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2026 Labé Booking. Tous droits réservés.</p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <p>Propulsé par GuineaTech</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

