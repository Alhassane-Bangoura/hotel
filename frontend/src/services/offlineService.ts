import { supabase } from '@/lib/supabaseClient';

export interface PendingAction {
    id: string;
    type: 'booking_update' | 'housekeeping_update' | 'message_send';
    payload: any;
    timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'hotel_labe_offline_queue';
const CACHE_VERSION = 'v1';

export const offlineService = {
    /**
     * Enregistrer une action en attente de synchronisation
     */
    enqueueAction: (type: PendingAction['type'], payload: any) => {
        const queue: PendingAction[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
        const newAction: PendingAction = {
            id: crypto.randomUUID(),
            type,
            payload,
            timestamp: Date.now()
        };
        queue.push(newAction);
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        console.log(`[Offline] Action enfilée: ${type}`);
        return newAction;
    },

    /**
     * Synchroniser les actions en attente dès que la connexion revient
     */
    syncPendingActions: async () => {
        const queue: PendingAction[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
        if (queue.length === 0) return;

        console.log(`[Offline] Synchronisation de ${queue.length} actions...`);
        
        const remainingQueue: PendingAction[] = [];

        for (const action of queue) {
            try {
                switch (action.type) {
                    case 'housekeeping_update':
                        await supabase.from('rooms').update(action.payload.data).eq('id', action.payload.id);
                        break;
                    case 'booking_update':
                        await supabase.from('bookings').update(action.payload.data).eq('id', action.payload.id);
                        break;
                    case 'message_send':
                        await supabase.from('messages').insert([action.payload]);
                        break;
                }
            } catch (err) {
                console.error(`[Offline] Échec de synchro pour l'action ${action.id}`, err);
                remainingQueue.push(action); // Garder dans la file si échec
            }
        }

        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));
    },

    /**
     * Mise en cache des données essentielles pour consultation offline
     */
    cacheData: (key: string, data: any) => {
        const cacheKey = `hotel_cache_${key}_${CACHE_VERSION}`;
        localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    },

    getCachedData: (key: string) => {
        const cacheKey = `hotel_cache_${key}_${CACHE_VERSION}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;
        return JSON.parse(cached).data;
    }
};
