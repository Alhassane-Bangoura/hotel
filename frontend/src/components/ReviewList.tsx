'use client';

import React, { useEffect, useState } from 'react';
import { Star, User } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Card } from './ui/Card';

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles: {
        name: string;
    } | null;
}

export function ReviewList({ hotelId }: { hotelId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, profiles(name)')
                    .eq('hotel_id', hotelId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setReviews(data || []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [hotelId]);

    if (loading) return <div className="text-center py-10 font-bold text-slate-400 uppercase tracking-widest text-xs">Chargement des avis...</div>;
    
    if (reviews.length === 0) return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Aucun avis pour le moment. Soyez le premier !</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white flex items-center gap-4 mb-8">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Avis Clients ({reviews.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <Card key={review.id} className="p-6 border-none shadow-xl shadow-[#1a2b4b]/5 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">
                                        {review.profiles?.name || 'Client Anonyme'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`h-3 w-3 ${i < review.rating ? 'text-primary fill-primary' : 'text-slate-100 dark:text-slate-800'}`} 
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            "{review.comment}"
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
