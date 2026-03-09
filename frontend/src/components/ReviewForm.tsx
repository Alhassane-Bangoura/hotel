'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './ui/Toast';

interface ReviewFormProps {
    hotelId: string;
    bookingId?: string;
    onSuccess?: () => void;
}

export function ReviewForm({ hotelId, bookingId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current user if possible, else anonymous for demo
            const { data: { user } } = await supabase.auth.getUser();
            
            const { error } = await supabase
                .from('reviews')
                .insert([
                    {
                        hotel_id: hotelId,
                        booking_id: bookingId,
                        user_id: user?.id,
                        rating,
                        comment
                    }
                ]);

            if (error) throw error;
            
            setSubmitted(true);
            showToast('Avis envoyé avec succès !', 'success');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error submitting review:', error);
            showToast('Erreur lors de l’envoi de votre avis.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="size-16 rounded-full bg-primary text-[#1a2b4b] flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 fill-current" />
                </div>
                <h4 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tight">Merci pour votre avis !</h4>
                <p className="text-sm text-slate-500 font-medium mt-2">Votre retour nous aide à améliorer nos services.</p>
            </div>
        );
    }

    return (
        <Card className="border-none shadow-2xl shadow-[#f49d25]/5 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem]">
            <h4 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight mb-2">Votre expérience</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Partagez votre avis avec la communauté</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Note globale</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="group transition-transform active:scale-90"
                            >
                                <Star 
                                    className={`h-8 w-8 transition-colors ${
                                        star <= rating 
                                        ? 'text-primary fill-primary' 
                                        : 'text-slate-200 dark:text-slate-700'
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commentaire</label>
                    <Textarea 
                        required
                        placeholder="Racontez-nous votre séjour..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="rounded-2xl border-slate-100 dark:border-slate-800 min-h-[120px] px-4 py-3 font-medium focus:ring-primary/20"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#1a2b4b] text-white dark:bg-primary dark:text-[#1a2b4b] rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-[#1a2b4b]/10 dark:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {loading ? 'Envoi...' : (
                        <>
                            Envoyer l'avis
                            <Send className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}
