'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SubscriptionConfig {
    channelName: string;
    table: string;
    filter?: string;
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    callback: (payload: any) => void;
}

/**
 * Hook de gestion temps réel centralisé et optimisé.
 * Gère automatiquement le cycle de vie des abonnements, évite les doublons 
 * et assure un nettoyage propre pour économiser les ressources (CPU/RAM).
 */
export function useRealtimeSubscription({ 
    channelName, 
    table, 
    filter, 
    event = '*', 
    callback 
}: SubscriptionConfig) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        console.log(`[Realtime] Initialisation canal: ${channelName}`);
        
        const channel = supabase.channel(channelName)
            .on(
                'postgres_changes', 
                { 
                    event: event, 
                    schema: 'public', 
                    table: table,
                    filter: filter 
                }, 
                (payload) => {
                    console.log(`[Realtime] Evénement détecté sur ${table}`);
                    callbackRef.current(payload);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`[Realtime] Abonnement actif: ${channelName}`);
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error(`[Realtime] Erreur sur le canal: ${channelName}`);
                }
            });

        return () => {
            console.log(`[Realtime] Nettoyage canal: ${channelName}`);
            supabase.removeChannel(channel);
        };
    }, [channelName, table, filter, event]);
}
