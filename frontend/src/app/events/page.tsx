'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Users, MapPin, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const EVENTS = [
    {
        id: 1, name: 'Forum Économique de Labé 2026', type: 'forum', startDate: '2026-04-10', endDate: '2026-04-12',
        description: 'Grand forum réunissant décideurs, entrepreneurs et investisseurs de la région du Fouta Djallon.',
        hotels: ['Hôtel le Bafing', 'Résidence Fouta'], participants: 350, color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 2, name: 'Conférence Santé - Guinée 2026', type: 'conference', startDate: '2026-05-02', endDate: '2026-05-03',
        description: 'Conférence nationale dédiée aux professionnels de santé, avec ateliers et présentations scientifiques.',
        hotels: ['Hôtel Central Labé'], participants: 120, color: 'from-emerald-500 to-teal-600'
    },
    {
        id: 3, name: 'Grand Mariage Diallo-Barry', type: 'mariage', startDate: '2026-06-15', endDate: '2026-06-16',
        description: 'Cérémonie de mariage traditionnelle avec réception de luxe. Hôtels partenaires offrent des tarifs spéciaux.',
        hotels: ['Villa des Collines', 'Hôtel le Bafing'], participants: 500, color: 'from-rose-500 to-pink-600'
    },
    {
        id: 4, name: 'Mission Administrative Régionale', type: 'administratif', startDate: '2026-03-20', endDate: '2026-03-25',
        description: 'Venue de fonctionnaires et représentants officiels pour des réunions de coordination régionale.',
        hotels: ['Hôtel du Plateau', 'Auberge Diallo'], participants: 80, color: 'from-violet-500 to-purple-600'
    },
];

const EVENT_TYPES: Record<string, string> = {
    forum: 'Forum', conference: 'Conférence', mariage: 'Mariage', administratif: 'Administratif'
};

export default function EventsPage() {
    const [filter, setFilter] = useState('tous');
    const types = ['tous', ...Object.keys(EVENT_TYPES)];
    const filtered = filter === 'tous' ? EVENTS : EVENTS.filter(e => e.type === filter);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Événements à Labé</h1>
                <p className="text-muted-foreground mt-1">Trouvez un hébergement adapté aux événements à venir</p>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
                {types.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filter === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}`}>
                        {t === 'tous' ? 'Tous les événements' : EVENT_TYPES[t]}
                    </button>
                ))}
            </div>

            {/* Events list */}
            <div className="flex flex-col gap-5">
                {filtered.map(event => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="flex flex-col md:flex-row">
                            <div className={`bg-gradient-to-br ${event.color} md:w-48 h-32 md:h-auto flex flex-col items-center justify-center text-white p-4 shrink-0`}>
                                <span className="text-xs uppercase tracking-widest font-bold opacity-80">{EVENT_TYPES[event.type]}</span>
                                <p className="text-2xl font-extrabold mt-1">{new Date(event.startDate).getDate()}</p>
                                <p className="text-sm font-medium opacity-80">{new Date(event.startDate).toLocaleString('fr-FR', { month: 'short', year: 'numeric' })}</p>
                            </div>
                            <CardContent className="p-5 flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{event.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{event.description}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{event.startDate} → {event.endDate}</span>
                                            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" />{event.participants} participants</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />Labé, Guinée</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                                            {event.hotels.map(h => (
                                                <span key={h} className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium">{h}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link href={`/hotels?event=${event.id}`} className="shrink-0 w-full sm:w-auto">
                                        <Button size="sm" className="gap-1.5 w-full">Voir hôtels <ChevronRight className="h-3.5 w-3.5" /></Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
