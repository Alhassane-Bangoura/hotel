'use client';

import { useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export const useErrorHandler = () => {
    const { showToast } = useToast();

    const handleError = useCallback((error: any, customMessage?: string) => {
        console.error('Handled Error:', error);

        let message = customMessage || 'Une erreur inattendue est survenue.';

        if (typeof error === 'string') {
            message = error;
        } else if (error?.message) {
            // Mapping des erreurs Supabase courantes vers des messages conviviaux
            if (error.message.includes('Invalid login credentials')) {
                message = 'Email ou mot de passe incorrect.';
            } else if (error.message.includes('User already registered')) {
                message = 'Cet email est déjà utilisé.';
            } else if (error.message.includes('JWT expired')) {
                message = 'Votre session a expiré. Veuillez vous reconnecter.';
            } else {
                message = error.message;
            }
        }

        showToast(message, 'error');
    }, [showToast]);

    return { handleError };
};
