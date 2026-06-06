import { supabase } from '@/lib/supabaseClient';

export type PaymentMethod = 'orange_money' | 'mtn_money' | 'card' | 'cash';
export type PaymentStatus = 'pending' | 'simulated_paid' | 'pay_at_hotel' | 'success' | 'failed';

export interface PaymentDetails {
    booking_id: string;
    method: PaymentMethod;
    amount: number;
    transaction_reference?: string;
    proof_url?: string;
}

export const paymentService = {
    /**
     * Simule un processus de paiement professionnel
     * @param details Détails du paiement
     * @param onProgress Callback pour afficher la progression de la simulation
     */
    processSimulatedPayment: async (
        details: PaymentDetails, 
        onProgress?: (message: string, percent: number) => void
    ) => {
        const steps = [
            { message: "Initialisation de la transaction sécurisée...", percent: 10 },
            { message: `Connexion au service ${details.method.replace('_', ' ').toUpperCase()}...`, percent: 40 },
            { message: "Vérification des fonds et autorisation...", percent: 70 },
            { message: "Paiement approuvé. Finalisation de la réservation...", percent: 90 },
            { message: "Transaction terminée avec succès.", percent: 100 }
        ];

        // Simulation du délai et de la progression
        for (const step of steps) {
            if (onProgress) onProgress(step.message, step.percent);
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }

        // Enregistrement réel dans la base de données (le paiement est simulé, mais la donnée est réelle)
        const status: PaymentStatus = details.method === 'cash' ? 'pay_at_hotel' : 'simulated_paid';
        const reference = details.transaction_reference || `PAY-${Math.random().toString(36).substring(2).toUpperCase()}-${Date.now()}`;

        const { data, error } = await supabase
            .from('payments')
            .insert([{
                booking_id: details.booking_id,
                method: details.method,
                amount: details.amount,
                transaction_reference: reference,
                status: status,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Mise à jour du statut de la réservation
        await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', details.booking_id);

        return data;
    },

    /**
     * Upload une preuve de paiement
     */
    uploadPaymentProof: async (bookingId: string, file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${bookingId}_proof_${Date.now()}.${fileExt}`;
        const filePath = `payments/proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('payments')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('payments')
            .getPublicUrl(filePath);

        // Update payment record with proof URL
        await supabase
            .from('payments')
            .update({ proof_url: publicUrl })
            .eq('booking_id', bookingId);

        return publicUrl;
    },

    getPaymentByBooking: async (bookingId: string) => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('booking_id', bookingId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};
