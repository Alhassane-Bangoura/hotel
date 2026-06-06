'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, BedDouble, Calendar, ShieldCheck, Info, X, Loader2 } from 'lucide-react';
import { notificationService, Notification } from '@/services/notificationService';
import { supabase } from '@/lib/supabaseClient';

const ICON_MAP: Record<string, React.ElementType> = {
    booking_confirmed: Calendar,
    booking_cancelled: X,
    booking_reminder: Bell,
    hotel_verified: ShieldCheck,
    onboarding_approved: ShieldCheck,
    incident_alert: Info,
    system: Info,
};

const COLOR_MAP: Record<string, string> = {
    booking_confirmed: 'bg-emerald-50 text-emerald-600',
    booking_cancelled: 'bg-red-50 text-red-500',
    booking_reminder: 'bg-blue-50 text-blue-600',
    hotel_verified: 'bg-primary/10 text-primary',
    onboarding_approved: 'bg-primary/10 text-primary',
    incident_alert: 'bg-orange-50 text-orange-500',
    system: 'bg-slate-100 text-slate-500',
};

export function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Fetch user and notifications
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    const data = await notificationService.getUserNotifications();
                    setNotifications(data || []);
                }
            } catch (err) {
                console.error('Notifications fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // Realtime subscription
    useEffect(() => {
        if (!userId) return;

        const channel = notificationService.subscribeToNotifications(userId, (payload) => {
            const newNotif = payload.new as Notification;
            setNotifications(prev => [newNotif, ...prev]);
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkRead = async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await notificationService.delete(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "À l'instant";
        if (mins < 60) return `Il y a ${mins}min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Il y a ${hours}h`;
        return `Il y a ${Math.floor(hours / 24)}j`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="relative p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all hover:bg-primary/10"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-white px-1"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-[calc(100%+12px)] w-[380px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-black/10 border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">
                                    Notifications
                                </h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5">
                                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Tout lire
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                            {loading ? (
                                <div className="py-16 flex flex-col items-center gap-3 opacity-50">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chargement...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-16 text-center space-y-3">
                                    <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                        <Bell className="h-7 w-7 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Aucune notification
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const Icon = ICON_MAP[notif.type] || Info;
                                    const colorClass = COLOR_MAP[notif.type] || 'bg-slate-100 text-slate-500';
                                    return (
                                        <motion.div
                                            key={notif.id}
                                            layout
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                            className={`flex items-start gap-4 p-5 cursor-pointer transition-all group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                                !notif.is_read ? 'bg-primary/5 dark:bg-primary/5' : ''
                                            }`}
                                        >
                                            <div className={`p-2.5 rounded-xl shrink-0 ${colorClass}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight leading-tight">
                                                    {notif.title}
                                                </p>
                                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                                    {timeAgo(notif.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 shrink-0">
                                                {!notif.is_read && (
                                                    <span className="size-2 bg-primary rounded-full" />
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notif.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
                                    Voir toutes les notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
