'use client';

import Link from 'next/link';
import { Hotel, MapPin, Phone, MessageSquare, Facebook, Instagram, Twitter } from 'lucide-react';

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
                            <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all">
                                <Instagram className="h-5 w-5" />
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
                                <span className="text-slate-500">+224 622 00 00 00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-primary shrink-0" />
                                <span className="text-slate-500">WhatsApp Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2024 Labé Booking. Tous droits réservés.</p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <p>Propulsé par GuineaTech</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
