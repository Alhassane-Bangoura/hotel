import { supabase } from '@/lib/supabaseClient';

export const storageService = {
    /**
     * Upload une image vers un bucket Supabase Storage
     * @param bucket 'hotels' | 'rooms'
     * @param path 'hotel_id/image_name'
     * @param file Le fichier image
     */
    uploadImage: async (bucket: 'hotels' | 'rooms', path: string, file: File) => {
        // 1. Validation du type de fichier
        if (!file.type.startsWith('image/')) {
            throw new Error('Le fichier doit être une image.');
        }

        // 2. Validation de la taille (ex: 2Mo max)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('L\'image est trop lourde (2Mo maximum).');
        }

        // 3. Nettoyage du nom de fichier pour éviter les injections
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const fullPath = `${path}/${fileName}`;

        // 4. Upload with a 10s timeout
        const uploadPromise = supabase.storage
            .from(bucket)
            .upload(fullPath, file, {
                cacheControl: '3600',
                upsert: false
            });

        const timeoutPromise = new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error("Le serveur de stockage de votre projet Supabase ne répond pas. Veuillez vérifier si le bucket 'rooms' ou 'hotels' est créé dans votre console Supabase.")), 8000)
        );

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

        if (error) {
            console.error('Storage Error:', error);
            throw new Error(error.message || 'Erreur lors de l\'upload de l\'image.');
        }

        // 5. Récupération de l'URL publique
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fullPath);

        return publicUrl;
    },

    deleteImage: async (bucket: 'hotels' | 'rooms', path: string) => {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    }
};
