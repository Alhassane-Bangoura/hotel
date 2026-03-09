'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    LayoutDashboard, Bed, Calendar, Settings, Plus, Edit2, Trash2,
    TrendingUp, CheckCircle, Clock, XCircle, LogOut, Hotel
} from 'lucide-react';

const RESERVATIONS = [
    { id: 'LH-ABC123', guest: 'Mamadou Diallo', room: 'Chambre Double Confort', checkIn: '2026-03-10', checkOut: '2026-03-13', nights: 3, total: 240000, status: 'confirmed' },
    { id: 'LH-DEF456', guest: 'Aissatou Barry', room: 'Suite Exécutive', checkIn: '2026-03-15', checkOut: '2026-03-16', nights: 1, total: 150000, status: 'pending' },
    { id: 'LH-GHI789', guest: 'Ibrahim Sow', room: 'Chambre Simple Standard', checkIn: '2026-03-05', checkOut: '2026-03-07', nights: 2, total: 100000, status: 'confirmed' },
    { id: 'LH-JKL012', guest: 'Fatoumata Camara', room: 'Chambre Double Deluxe', checkIn: '2026-02-28', checkOut: '2026-03-01', nights: 1, total: 100000, status: 'cancelled' },
];

const ROOMS = [
    { id: 'r1', name: 'Chambre Simple Standard', type: 'simple', price: 50000, capacity: 1, status: 'available' },
    { id: 'r2', name: 'Chambre Double Confort', type: 'double', price: 80000, capacity: 2, status: 'occupied' },
    { id: 'r3', name: 'Suite Exécutive', type: 'suite', price: 150000, capacity: 3, status: 'available' },
    { id: 'r4', name: 'Chambre Double Deluxe', type: 'double', price: 100000, capacity: 2, status: 'available' },
];

type Tab = 'overview' | 'rooms' | 'bookings' | 'settings';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = { confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée' };
const STATUS_ICONS = { confirmed: CheckCircle, pending: Clock, cancelled: XCircle };

const totalRevenue = RESERVATIONS.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.total, 0);
const confirmedCount = RESERVATIONS.filter(r => r.status === 'confirmed').length;

export default function HotelDashboardPage() {
    const [tab, setTab] = useState<Tab>('overview');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Hotel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Hôtel le Bafing</h1>
                        <p className="text-sm text-muted-foreground">Tableau de bord hôtelier</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" /> Déconnexion
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
                {[
                    { id: 'overview', label: 'Aperçu', icon: LayoutDashboard },
                    { id: 'rooms', label: 'Chambres', icon: Bed },
                    { id: 'bookings', label: 'Réservations', icon: Calendar },
                    { id: 'settings', label: 'Paramètres', icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setTab(id as Tab)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        <Icon className="h-3.5 w-3.5" />{label}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div className="flex flex-col gap-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Revenus ce mois', value: totalRevenue.toLocaleString('fr-GN') + ' GNF', icon: TrendingUp, change: '+12%', color: 'text-green-600' },
                            { label: 'Réservations', value: RESERVATIONS.length, icon: Calendar, change: '+3 ce mois', color: 'text-blue-600' },
                            { label: 'Confirmées', value: confirmedCount, icon: CheckCircle, change: `${confirmedCount}/${RESERVATIONS.length}`, color: 'text-emerald-600' },
                            { label: 'Chambres dispo', value: `${ROOMS.filter(r => r.status === 'available').length}/${ROOMS.length}`, icon: Bed, change: 'disponibles', color: 'text-orange-600' },
                        ].map(({ label, value, icon: Icon, change, color }) => (
                            <Card key={label}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                                            <p className="text-xl font-extrabold mt-0.5">{value}</p>
                                            <p className={`text-xs font-medium mt-1 ${color}`}>{change}</p>
                                        </div>
                                        <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center`}>
                                            <Icon className={`h-4 w-4 ${color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Recent bookings preview */}
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-base">Dernières réservations</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-col divide-y">
                                {RESERVATIONS.slice(0, 3).map(r => {
                                    const Icon = STATUS_ICONS[r.status as keyof typeof STATUS_ICONS];
                                    return (
                                        <div key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                            <Icon className={`h-4 w-4 ${r.status === 'confirmed' ? 'text-green-500' : r.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{r.guest}</p>
                                                <p className="text-xs text-muted-foreground">{r.room} · {r.checkIn}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{r.total.toLocaleString('fr-GN')} GNF</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status as keyof typeof STATUS_STYLES]}`}>{STATUS_LABELS[r.status as keyof typeof STATUS_LABELS]}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {tab === 'rooms' && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button className="gap-2"><Plus className="h-4 w-4" /> Ajouter une chambre</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ROOMS.map(room => (
                            <Card key={room.id}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bed className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold leading-tight">{room.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{room.type} · {room.capacity} pers.</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${room.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {room.status === 'available' ? 'Disponible' : 'Occupée'}
                                            </span>
                                        </div>
                                        <p className="font-bold text-primary mt-1.5">{room.price.toLocaleString('fr-GN')} GNF/nuit</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs"><Edit2 className="h-3 w-3" />Modifier</Button>
                                            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" />Supprimer</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'bookings' && (
                <div className="flex flex-col gap-4">
                    {RESERVATIONS.map(r => {
                        const Icon = STATUS_ICONS[r.status as keyof typeof STATUS_ICONS];
                        return (
                            <Card key={r.id}>
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{r.guest}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status as keyof typeof STATUS_STYLES]}`}>{STATUS_LABELS[r.status as keyof typeof STATUS_LABELS]}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{r.room}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Du {r.checkIn} au {r.checkOut} · {r.nights} nuit{r.nights > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-primary">{r.total.toLocaleString('fr-GN')} GNF</p>
                                            <p className="text-xs text-muted-foreground font-mono">{r.id}</p>
                                            {r.status === 'pending' && (
                                                <div className="flex gap-2 mt-2 justify-end">
                                                    <Button size="sm" className="h-7 text-xs gap-1"><CheckCircle className="h-3 w-3" />Confirmer</Button>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive"><XCircle className="h-3 w-3" />Refuser</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {tab === 'settings' && (
                <Card>
                    <CardHeader><CardTitle>Paramètres de l'hôtel</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm">Modifiez les informations de votre établissement.</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Nom de l\'hôtel', value: 'Hôtel le Bafing' },
                                { label: 'Adresse', value: 'Avenue du Fouta, Pounthioun, Labé' },
                                { label: 'Téléphone', value: '+224 620 000 000' },
                            ].map(({ label, value }) => (
                                <div key={label} className="space-y-1.5">
                                    <label className="text-sm font-medium">{label}</label>
                                    <input defaultValue={value} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                                </div>
                            ))}
                        </div>
                        <Button>Enregistrer les modifications</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
