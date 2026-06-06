/**
 * Bridge de communication WhatsApp (Canal n°1 en Guinée)
 * Permet de basculer la communication vers WhatsApp de manière structurée.
 */
export const WhatsAppBridge = {
    /**
     * Génère un lien de contact direct pour un hôtel
     */
    contactHotel: (phone: string, hotelName: string, bookingRef?: string) => {
        const message = encodeURIComponent(
            `Bonjour ${hotelName}, je vous contacte via LabéBooking au sujet de ma réservation ${bookingRef || ''}.`
        );
        return `https://wa.me/${phone}?text=${message}`;
    },

    /**
     * Lien de support plateforme
     */
    contactSupport: (issueType: string) => {
        const message = encodeURIComponent(
            `Bonjour Support LabéBooking, j'ai un problème concernant : ${issueType}.`
        );
        // Numéro de support fictif à remplacer par le vrai numéro de la plateforme
        return `https://wa.me/224600000000?text=${message}`;
    },

    /**
     * Envoi de notification de réservation (via lien de partage pour l'instant)
     */
    shareBooking: (phone: string, details: any) => {
        const message = encodeURIComponent(
            `🎉 Nouvelle réservation LabéBooking !\n\nClient : ${details.clientName}\nChambre : ${details.roomName}\nDates : ${details.checkIn} au ${details.checkOut}\nTotal : ${details.total} GNF`
        );
        return `https://wa.me/${phone}?text=${message}`;
    }
};
