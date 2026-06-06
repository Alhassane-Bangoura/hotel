'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { MessageSquare, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Conversation {
    id: string;
    booking_id: string;
    client_id: string;
    hotel_id: string;
    last_message_at: string;
    hotel_name?: string;
    client_name?: string;
}

export function ChatList({ onSelectConversation }: { onSelectConversation: (id: string, name: string) => void }) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch conversations with hotel/client names
            const { data, error } = await supabase
                .from('conversations')
                .select('*, hotels(name), profiles:client_id(name)')
                .or(`client_id.eq.${user.id},hotel_id.in.(select id from hotels where user_id='${user.id}')`)
                .order('last_message_at', { ascending: false });

            if (error) {
                console.error(error);
            } else {
                setConversations(data.map(c => ({
                    ...c,
                    hotel_name: c.hotels?.name,
                    client_name: c.profiles?.name
                })));
            }
            setLoading(false);
        };

        fetchConversations();

        // Subscribe to conversation updates (new messages update last_message_at)
        const sub = supabase
            .channel('public:conversations')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, fetchConversations)
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 space-y-6">
                <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter">Messages</h3>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Rechercher un hôtel..."
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronisation...</p>
                    </div>
                ) : conversations.length > 0 ? (
                    conversations.map((c, i) => (
                        <motion.button
                            key={c.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelectConversation(c.id, c.hotel_name || c.client_name || 'Utilisateur')}
                            className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left group border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-base shrink-0 group-hover:scale-110 transition-transform">
                                {(c.hotel_name || c.client_name || 'U').charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-xs font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight truncate">
                                        {c.hotel_name || c.client_name}
                                    </h4>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {new Date(c.last_message_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] text-slate-500 truncate italic">Cliquez pour voir la conversation</p>
                                    <div className="size-2 bg-primary rounded-full animate-pulse shrink-0" />
                                </div>
                            </div>
                        </motion.button>
                    ))
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-10 leading-loose">Aucune conversation active pour vos réservations.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
