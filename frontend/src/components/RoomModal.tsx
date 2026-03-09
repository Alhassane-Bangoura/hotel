'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './ui/Toast';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    hotelId?: string;
    initialData?: any;
}

export function RoomModal({ isOpen, onClose, onSuccess, hotelId, initialData }: RoomModalProps) {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'simple',
        price: initialData?.price || '',
        capacity: initialData?.capacity || '1',
        description: initialData?.description || ''
    });

    // Reset form when initialData changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData?.name || '',
                type: initialData?.type || 'simple',
                price: initialData?.price || '',
                capacity: initialData?.capacity?.toString() || '1',
                description: initialData?.description || ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData?.id) {
                // Update existing room
                const { error } = await supabase
                    .from('rooms')
                    .update({
                        name: formData.name,
                        type: formData.type,
                        price: parseFloat(formData.price),
                        capacity: parseInt(formData.capacity),
                        description: formData.description
                    })
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                // Insert new room
                const targetHotelId = hotelId || '00000000-0000-0000-0000-000000000000';
                const { error } = await supabase
                    .from('rooms')
                    .insert([
                        {
                            hotel_id: targetHotelId,
                            name: formData.name,
                            type: formData.type,
                            price: parseFloat(formData.price),
                            capacity: parseInt(formData.capacity),
                            description: formData.description,
                            status: 'available'
                        }
                    ]);
                if (error) throw error;
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving room:', error);
            showToast('Erreur lors de l’enregistrement de la chambre', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">
                            {initialData ? 'Modifier la Chambre' : 'Ajouter une Chambre'}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {initialData ? 'Optimisation des détails' : 'Nouveaux revenus en vue'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de la chambre</label>
                                <Input 
                                    required
                                    placeholder="Ex: Suite Royale 102" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="rounded-2xl border-slate-100 dark:border-slate-800 h-12 px-4 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                                <select 
                                    className="w-full h-12 rounded-2xl border border-slate-100 dark:border-slate-800 bg-transparent px-4 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="simple">Simple</option>
                                    <option value="double">Double</option>
                                    <option value="suite">Suite</option>
                                    <option value="executive">Executive</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prix (GNF / nuit)</label>
                                <Input 
                                    required
                                    type="number"
                                    placeholder="500 000" 
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="rounded-2xl border-slate-100 dark:border-slate-800 h-12 px-4 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacité (Pers.)</label>
                                <Input 
                                    required
                                    type="number"
                                    placeholder="2" 
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                    className="rounded-2xl border-slate-100 dark:border-slate-800 h-12 px-4 font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <Textarea 
                                placeholder="Détails sur les équipements..." 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="rounded-2xl border-slate-100 dark:border-slate-800 min-h-[100px] px-4 py-3 font-medium"
                            />
                        </div>
                    </div>

                    <footer className="pt-4 flex gap-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-slate-100"
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-primary text-[#1a2b4b] rounded-2xl h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
