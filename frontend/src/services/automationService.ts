import { notificationService } from './notificationService';
import { emailService } from './emailService';

/**
 * Moteur d'automatisation des workflows plateforme
 * Centralise les triggers de communication pour assurer la coordination.
 */
export const automationService = {
    
    // Trigger lors d'une nouvelle réservation
    onBookingCreated: async (booking: any, user: any, hotel: any) => {
        try {
            // 1. Notification au client
            await notificationService.notify({
                user_id: user.id,
                title: 'Réservation confirmée !',
                message: `Votre séjour à ${hotel.name} est validé. Préparez vos bagages !`,
                type: 'booking_confirmed',
                link: `/dashboard`
            });

            // 2. Notification à l'hôtelier
            await notificationService.notify({
                user_id: hotel.user_id,
                title: 'Nouvelle réservation !',
                message: `${user.name} vient de réserver une chambre.`,
                type: 'booking_confirmed',
                link: `/dashboard/hotel/command-center`
            });

            // 3. Email transactionnel
            await emailService.sendBookingConfirmation(user.email, {
                userName: user.name,
                hotelName: hotel.name,
                checkIn: booking.check_in,
                check_out: booking.check_out,
                totalPrice: booking.total_price
            });

            console.log('[AUTOMATION] Workflow réservation terminé avec succès.');
        } catch (error) {
            console.error('[AUTOMATION] Erreur workflow réservation:', error);
        }
    },

    // Trigger lors de la validation d'un hôtel
    onHotelVerified: async (hotel: any) => {
        try {
            await notificationService.notify({
                user_id: hotel.user_id,
                title: 'Félicitations !',
                message: `Votre hôtel ${hotel.name} a été vérifié et est maintenant visible sur la plateforme.`,
                type: 'hotel_verified',
                link: `/dashboard/hotel/command-center`
            });

            await emailService.sendHotelOnboardingWelcome(hotel.owner_email, hotel.name);
        } catch (error) {
            console.error('[AUTOMATION] Erreur workflow vérification hôtel:', error);
        }
    },

    // Rappel de check-in (Peut être appelé par un cron job / Edge Function)
    triggerCheckInReminders: async () => {
        // Logique de recherche des check-ins de demain et envoi notifications
        console.log('[AUTOMATION] Exécution des rappels check-in...');
    }
};
