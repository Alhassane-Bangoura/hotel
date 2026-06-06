/**
 * Service de messagerie transactionnelle (Simulé pour le MVP, prêt pour Resend/SendGrid)
 */
export const emailService = {
    sendBookingConfirmation: async (email: string, bookingDetails: any) => {
        console.log(`[EMAIL] Envoi confirmation de réservation à ${email}`, bookingDetails);
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    },

    sendHotelOnboardingWelcome: async (email: string, hotelName: string) => {
        console.log(`[EMAIL] Bienvenue hôtelier : ${hotelName} (${email})`);
        return true;
    },

    sendIncidentAlert: async (email: string, incidentType: string) => {
        console.log(`[EMAIL] ALERTE INCIDENT à ${email} : ${incidentType}`);
        return true;
    },

    sendWelcome: async (email: string, name: string) => {
        console.log(`[EMAIL] Bienvenue plateforme à ${name} (${email})`);
        return true;
    }
};

/**
 * templates pour l'intégration future
 */
export const EMAIL_TEMPLATES = {
    BOOKING_SUCCESS: (data: any) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h1 style="color: #1a2b4b;">Votre séjour est confirmé !</h1>
            <p>Bonjour ${data.userName},</p>
            <p>Votre réservation pour <strong>${data.hotelName}</strong> a été validée avec succès.</p>
            <div style="background: #f8f7f5; padding: 20px; border-radius: 10px;">
                <p><strong>Check-in:</strong> ${data.checkIn}</p>
                <p><strong>Check-out:</strong> ${data.checkOut}</p>
                <p><strong>Prix Total:</strong> ${data.totalPrice} GNF</p>
            </div>
            <p>L'hôtelier a été prévenu et vous attend.</p>
        </div>
    `
};
