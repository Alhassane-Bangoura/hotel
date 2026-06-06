'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    LayoutDashboard, Bed, Calendar, Settings, Plus, Edit2, Trash2,
    TrendingUp, CheckCircle, Clock, XCircle, LogOut, Hotel, Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { hotelService } from '@/services/hotelService';
import { bookingService } from '@/services/bookingService';

type Tab = 'overview' | 'rooms' | 'bookings' | 'settings';

const STATUS_STYLES = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
};
const STATUS_LABELS = { confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée' };
const STATUS_ICONS = { confirmed: CheckCircle, pending: Clock, cancelled: XCircle };

import { useRouter } from 'next/navigation';

export default function HotelDashboardPage() {
    const { user, logout } = useAuthStore();
    const [tab, setTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    const [hotel, setHotel] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!user) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const managedHotel = await hotelService.getManagedHotel(user.id);
                if (managedHotel) {
                    setHotel(managedHotel);
                    const [s, b] = await Promise.all([
                        hotelService.getHotelStats(managedHotel.id),
                        bookingService.getHotelBookings(managedHotel.id)
                    ]);
                    setStats(s);
                    setBookings(b);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, mounted]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="text-center py-20">
                <Hotel className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold">Aucun hôtel géré</h2>
                <p className="text-slate-500">Vous n'avez pas encore d'établissement enregistré.</p>
                <Button className="mt-6">Enregistrer mon hôtel</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Hotel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{hotel.name}</h1>
                        <p className="text-sm text-muted-foreground">Tableau de bord hôtelier · {hotel.city}</p>
                    </div>
                </div>
                <Button onClick={logout} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
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
                            { label: 'Revenus totaux', value: stats?.totalRevenue.toLocaleString('fr-GN') + ' GNF', icon: TrendingUp, color: 'text-green-600' },
                            { label: 'Réservations', value: stats?.totalBookings, icon: Calendar, color: 'text-blue-600' },
                            { label: 'Confirmées', value: stats?.confirmedCount, icon: CheckCircle, color: 'text-emerald-600' },
                            { label: 'Chambres', value: hotel.rooms?.length || 0, icon: Bed, color: 'text-orange-600' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <Card key={label}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                                            <p className="text-xl font-extrabold mt-0.5">{value}</p>
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
                                {bookings.slice(0, 5).map(r => {
                                    const Icon = STATUS_ICONS[r.status as keyof typeof STATUS_ICONS] || Clock;
                                    return (
                                        <div key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                            <Icon className={`h-4 w-4 ${r.status === 'confirmed' ? 'text-green-500' : r.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{r.profiles?.name || 'Client Inconnu'}</p>
                                                <p className="text-xs text-muted-foreground">{r.rooms?.name} · {r.check_in}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{r.total_price.toLocaleString('fr-GN')} GNF</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status as keyof typeof STATUS_STYLES] || 'bg-slate-100'}`}>{STATUS_LABELS[r.status as keyof typeof STATUS_LABELS] || r.status}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {bookings.length === 0 && <p className="text-center py-6 text-sm text-slate-400">Aucune réservation pour le moment.</p>}
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
                        {(hotel.rooms || []).map((room: any) => (
                            <Card key={room.id}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bed className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="font-bold leading-tight">{room.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{room.capacity} pers.</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-primary mt-1.5">{room.price.toLocaleString('fr-GN')} GNF/nuit</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs"><Edit2 className="h-3 w-3" />Modifier</Button>
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
                    {bookings.map(r => {
                        const Icon = STATUS_ICONS[r.status as keyof typeof STATUS_ICONS] || Clock;
                        return (
                            <Card key={r.id}>
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{r.profiles?.name || 'Client Inconnu'}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status as keyof typeof STATUS_STYLES] || 'bg-slate-100'}`}>{STATUS_LABELS[r.status as keyof typeof STATUS_LABELS] || r.status}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{r.rooms?.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Du {r.check_in} au {r.check_out}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-primary">{r.total_price.toLocaleString('fr-GN')} GNF</p>
                                            <p className="text-xs text-muted-foreground font-mono">{r.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
