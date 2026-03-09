'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Hotel, Heart, Users, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-slate-950 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-navy-deep/60 z-10"></div>
                    <Image
                        src="/hero_hotel_bg_1772792881651.png"
                        alt="Labé Cityscape"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative z-20 text-center text-white container px-6">
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6">À propos de Labé Booking</h1>
                    <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
                        Le premier portail de réservation hôtelière dédié à l'hospitalité du Fouta-Djallon.
                    </p>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-24 container px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Notre Mission</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-deep dark:text-white mb-8 leading-tight">
                            Connecter les voyageurs à l'authenticité de la Moyenne-Guinée.
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Labé Booking est né d'une volonté simple : moderniser l'accès aux services hôteliers dans l'une des régions les plus touristiques de la Guinée. Nous croyons que trouver un logement confortable ne devrait pas être un obstacle pour découvrir les merveilles du Fouta.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: Heart, title: "Passion locale", desc: "Une équipe qui connaît Labé sur le bout des doigts." },
                                { icon: ShieldCheck, title: "Transparence", desc: "Des tarifs réels et des avis vérifiés." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-navy-deep dark:text-white mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative h-[450px]">
                        <Image
                            src="/hotel_building_split_1772792915358.png"
                            alt="Hospitality in Labé"
                            fill
                            className="rounded-3xl object-cover shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container px-6 text-center">
                    <h2 className="text-3xl font-bold mb-16">Pourquoi nous faire confiance ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: CheckCircle, title: "+20 Hôtels partenaires", desc: "De la résidence étoilée à l'auberge conviviale." },
                            { icon: Users, title: "Support 24/7", desc: "Une assistance locale disponible pour tous vos besoins." },
                            { icon: MapPin, title: "Expertise régionale", desc: "Nous recommandons uniquement ce que nous connaissons." }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <card.icon className="h-10 w-10 text-primary mx-auto mb-6" />
                                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 container px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Prêt à découvrir Labé ?</h2>
                    <p className="text-lg text-slate-500 mb-10">
                        Que ce soit pour un voyage d'affaires, une mission humanitaire ou des vacances en famille, nous avons la chambre qu'il vous faut.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/hotels">
                            <Button size="lg" className="px-12 h-14 font-bold">Voir les hôtels</Button>
                        </Link>
                        <Link href="/login?tab=register">
                            <Button size="lg" variant="outline" className="px-12 h-14 font-bold">Créer un compte</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
