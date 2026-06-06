import { supabase } from '@/lib/supabaseClient';

export interface SearchResult {
    id: string;
    name: string;
    type: 'hotel' | 'city' | 'area';
    location?: string;
}

const SEARCH_CACHE: Record<string, { data: SearchResult[], timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const searchService = {
    /**
     * Recherche intelligente avec cache et filtrage national
     */
    suggest: async (query: string): Promise<SearchResult[]> => {
        if (query.length < 2) return [];

        // 1. Check cache
        const normalizedQuery = query.toLowerCase().trim();
        if (SEARCH_CACHE[normalizedQuery] && (Date.now() - SEARCH_CACHE[normalizedQuery].timestamp < CACHE_TTL)) {
            return SEARCH_CACHE[normalizedQuery].data;
        }

        // 2. Fetch from Supabase
        const { data: hotels, error } = await supabase
            .from('hotels')
            .select('id, name, quartier')
            .or(`name.ilike.%${normalizedQuery}%,quartier.ilike.%${normalizedQuery}%`)
            .eq('status', 'active')
            .limit(10);

        if (error) {
            console.error('[Search] Error fetching suggestions', error);
            return [];
        }

        const results: SearchResult[] = (hotels || []).map(h => ({
            id: h.id,
            name: h.name,
            type: 'hotel',
            location: h.quartier
        }));

        // 3. Update cache
        SEARCH_CACHE[normalizedQuery] = {
            data: results,
            timestamp: Date.now()
        };

        return results;
    },

    /**
     * Récupérer les destinations populaires
     */
    getPopularDestinations: async () => {
        // En phase MVP on retourne des statiques, plus tard basé sur l'activité réelle
        return [
            { name: 'Labé', count: 45, icon: 'Mountain' },
            { name: 'Conakry', count: 128, icon: 'Waves' },
            { name: 'Dalaba', count: 24, icon: 'Cloud' },
            { name: 'Kindia', count: 32, icon: 'Fruit' },
        ];
    }
};
