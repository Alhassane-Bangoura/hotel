'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, Hotel, Bed, Camera, ShieldCheck, 
    ChevronRight, ChevronLeft, MapPin, Loader2, Info, XCircle, Plus, Trash2, Check, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { onboardingService } from '@/services/onboardingService';
import { storageService } from '@/services/storageService';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabaseClient';

const STEPS = [
    { id: 1, label: 'L\'Hôtel', icon: Hotel, description: 'Infos de base' },
    { id: 2, label: 'Les Chambres', icon: Bed, description: 'Votre inventaire' },
    { id: 3, label: 'Documents', icon: Camera, description: 'Vérification' },
    { id: 4, label: 'Validation', icon: ShieldCheck, description: 'Confirmation' },
];

export default function HotelOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hotelId, setHotelId] = useState<string | null>(null);
    const router = useRouter();
    const { showToast } = useToast();
    const [cities, setCities] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [commonAmenities, setCommonAmenities] = useState<string[]>([]);
    const [roomsData, setRoomsData] = useState<any[]>([
        { name: '', type: 'simple', price: '', capacity: '', description: '', amenities: [] }
    ]);

    const [hotelData, setHotelData] = useState({
        name: '',
        city_id: '690e4558-54a4-4574-999e-01bd672894b5', // Default to Labe UUID
        address: '',
        description: '',
    });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const { data, error } = await supabase.from('cities').select('*');
                if (!error && data) {
                    setCities(data);
                    if (data.length > 0) {
                        setHotelData(prev => ({ ...prev, city_id: data[0].id }));
                    }
                }
            } catch (err) {
                console.error("Error loading cities:", err);
            }
        };
        fetchCities();
    }, []);

    const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleStep1 = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            console.log("Submitting hotel onboarding draft:", hotelData);
            const data = await onboardingService.createHotelDraft(hotelData);
            console.log("Success creating hotel draft:", data);
            setHotelId(data.id);
            nextStep();
        } catch (err: any) {
            console.error("Failed to create hotel draft:", err);
            const msg = err?.message || 'Erreur lors de la création de l\'hôtel';
            setErrorMsg(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async () => {
        if (!hotelId) {
            showToast("Veuillez d'abord créer l'hôtel à l'étape 1.", "error");
            return;
        }
        // Validation: verify all rooms have names, prices, and capacities specified
        for (let i = 0; i < roomsData.length; i++) {
            const r = roomsData[i];
            if (!r.name || !r.name.trim()) {
                const msg = `Veuillez spécifier le nom ou numéro de la chambre #${i + 1}.`;
                setErrorMsg(msg);
                showToast(msg, 'error');
                return;
            }
            if (!r.price || Number(r.price) <= 0) {
                const msg = `Veuillez spécifier un prix valide supérieur à 0 pour la chambre #${i + 1}.`;
                setErrorMsg(msg);
                showToast(msg, 'error');
                return;
            }
            if (!r.capacity || Number(r.capacity) <= 0) {
                const msg = `Veuillez spécifier une capacité supérieure à 0 pour la chambre #${i + 1}.`;
                setErrorMsg(msg);
                showToast(msg, 'error');
                return;
            }
        }

        setLoading(true);
        setErrorMsg(null);
        try {
            console.log("Adding rooms to hotel draft:", hotelId, roomsData);
            const finalizedRooms = roomsData.map(r => ({
                name: r.name,
                type: r.type,
                price: Number(r.price),
                capacity: Number(r.capacity),
                description: r.description,
                images: r.images || [],
                amenities: Array.from(new Set([...(r.amenities || []), ...commonAmenities]))
            }));
            const data = await onboardingService.addRooms(hotelId, finalizedRooms);
            console.log("Success adding rooms:", data);
            nextStep();
        } catch (err: any) {
            console.error("Failed to add rooms:", err);
            const msg = err?.message || 'Erreur lors de l\'ajout des chambres';
            setErrorMsg(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomImageUpload = async (index: number, file: File) => {
        if (!hotelId) {
            showToast("Veuillez d'abord créer l'hôtel.", "error");
            return;
        }
        try {
            updateRoomField(index, 'uploading', true);
            const publicUrl = await storageService.uploadImage('rooms', hotelId, file);
            
            setRoomsData(prev => prev.map((room, i) => {
                if (i === index) {
                    const currentImages = room.images || [];
                    if (currentImages.length < 3) {
                        return { ...room, images: [...currentImages, publicUrl] };
                    }
                }
                return room;
            }));
            
            showToast(`Photo pour la chambre #${index + 1} ajoutée avec succès !`, 'success');
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Erreur lors du téléchargement de l'image.", 'error');
        } finally {
            updateRoomField(index, 'uploading', false);
        }
    };

    const addRoomTemplateImage = (index: number, url: string) => {
        setRoomsData(prev => prev.map((room, i) => {
            if (i === index) {
                const currentImages = room.images || [];
                if (currentImages.length < 3 && !currentImages.includes(url)) {
                    return { ...room, images: [...currentImages, url] };
                }
            }
            return room;
        }));
    };

    const removeRoomImage = (roomIndex: number, imageIndex: number) => {
        setRoomsData(prev => prev.map((room, i) => {
            if (i === roomIndex && room.images) {
                const newImages = [...room.images];
                newImages.splice(imageIndex, 1);
                return { ...room, images: newImages };
            }
            return room;
        }));
    };

    const addRoomField = () => {
        setRoomsData(prev => [
            ...prev,
            { name: '', type: 'simple', price: '', capacity: '', description: '', amenities: [], images: [] }
        ]);
    };

    const removeRoomField = (index: number) => {
        if (roomsData.length > 1) {
            setRoomsData(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateRoomField = (index: number, key: string, value: any) => {
        setRoomsData(prev => prev.map((room, i) => i === index ? { ...room, [key]: value } : room));
    };

    const toggleCommonAmenity = (amenity: string) => {
        setCommonAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] pt-28 md:pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter">Bienvenue, <span className="text-primary italic">Partenaire</span></h1>
                    <p className="text-slate-500 font-medium italic">"Rejoignez la plus grande plateforme hôtelière de Guinée en 5 minutes."</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
                    {STEPS.map((s, i) => (
                        <div key={s.id} className="flex flex-col items-center gap-3 relative flex-1">
                            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-primary text-[#1a2b4b] shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <s.icon className="h-5 w-5" />
                                {step > s.id && <CheckCircle className="absolute -top-1 -right-1 size-5 text-green-500 fill-white" />}
                            </div>
                            <div className="text-center hidden sm:block">
                                <p className="text-[9px] font-black uppercase tracking-widest leading-none">{s.label}</p>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`absolute left-1/2 w-full h-[2px] top-6 -z-10 ${step > s.id ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-10 md:p-16 space-y-10 text-left">
                                {step === 1 && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Votre établissement</h2>
                                            <p className="text-slate-500 text-sm">Commençons par les informations de base de votre hôtel.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Nom de l'hôtel</label>
                                                <input 
                                                    value={hotelData.name}
                                                    onChange={e => setHotelData({...hotelData, name: e.target.value})}
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-slate-900 dark:text-white placeholder:italic outline-none" 
                                                    placeholder="ex: Hôtel le Bafing"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Ville</label>
                                                    <select 
                                                        value={hotelData.city_id}
                                                        onChange={e => setHotelData({...hotelData, city_id: e.target.value})}
                                                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer outline-none"
                                                    >
                                                        {cities.length > 0 ? (
                                                            cities.map(c => (
                                                                <option key={c.id} value={c.id}>{c.name}</option>
                                                            ))
                                                        ) : (
                                                            <>
                                                                <option value="690e4558-54a4-4574-999e-01bd672894b5">Labé</option>
                                                                <option value="d1b49a7b-fd52-4e13-a36c-50f9fecd0dd0">Dalaba</option>
                                                                <option value="fbe171ca-db3a-4cc5-bc86-963e01131d17">Mamou</option>
                                                                <option value="5e7789a0-3276-4e48-a8a9-14edfc3162f4">Pita</option>
                                                            </>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Quartier</label>
                                                    <input 
                                                        value={hotelData.address}
                                                        onChange={e => setHotelData({...hotelData, address: e.target.value})}
                                                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-slate-900 dark:text-white placeholder:italic outline-none" 
                                                        placeholder="ex: Tata"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Description courte</label>
                                                <textarea 
                                                    rows={4}
                                                    value={hotelData.description}
                                                    onChange={e => setHotelData({...hotelData, description: e.target.value})}
                                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold text-slate-900 dark:text-white placeholder:italic resize-none outline-none" 
                                                    placeholder="Décrivez l'expérience unique de votre hôtel..."
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex gap-4">
                                            <Info className="h-6 w-6 text-primary shrink-0" />
                                            <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                                                Les informations fournies ici seront visibles par des milliers de voyageurs à travers toute la Guinée. Soyez précis !
                                            </p>
                                        </div>

                                        {errorMsg && (
                                            <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 flex gap-4 text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                                                <XCircle className="h-6 w-6 shrink-0" />
                                                <div className="text-[11px] font-medium leading-relaxed text-left">
                                                    <p className="font-bold uppercase tracking-wider mb-1">Échec de l'enregistrement</p>
                                                    <p>{errorMsg}</p>
                                                </div>
                                            </div>
                                        )}

                                        <Button 
                                            onClick={handleStep1}
                                            disabled={loading}
                                            className="w-full py-7 bg-[#1a2b4b] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                        >
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                                <>Continuer vers les chambres <ChevronRight className="h-5 w-5 text-primary" /></>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-10 text-left">
                                        <div className="text-center space-y-4">
                                            <Bed className="h-16 w-16 text-primary mx-auto animate-pulse" />
                                            <h2 className="text-3xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Configuration des Chambres</h2>
                                            <p className="text-slate-500 max-w-md mx-auto italic text-sm">Configurez vos chambres. Vous pouvez en ajouter autant que vous le souhaitez !</p>
                                        </div>

                                        {/* 1. Common features section */}
                                        <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                                <h3 className="font-black text-xs uppercase tracking-wider text-[#1a2b4b] dark:text-white">Équipements Communs à toutes vos chambres</h3>
                                            </div>
                                            <p className="text-[10px] text-slate-500 italic">"Cochez ce qui est commun à TOUTES les chambres pour gagner du temps."</p>
                                            
                                            <div className="flex flex-wrap gap-2.5">
                                                {['WiFi', 'Eau Chaude', 'Clim', 'TV', 'Petit-déjeuner', 'Mini-bar'].map((amenity) => {
                                                    const isChecked = commonAmenities.includes(amenity);
                                                    return (
                                                        <button
                                                            key={amenity}
                                                            type="button"
                                                            onClick={() => toggleCommonAmenity(amenity)}
                                                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-2 ${
                                                                isChecked 
                                                                    ? 'bg-primary border-primary text-[#1a2b4b] shadow-md shadow-primary/20' 
                                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            {isChecked && <Check className="h-3 w-3 stroke-[3px]" />}
                                                            {amenity}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* 2. Room entries */}
                                        <div className="space-y-6">
                                            {roomsData.map((room, index) => (
                                                <div 
                                                    key={index} 
                                                    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-black/5 space-y-6 relative group overflow-hidden"
                                                >
                                                    {/* Header */}
                                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                                        <span className="bg-[#1a2b4b] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                            Chambre #{index + 1}
                                                        </span>
                                                        {roomsData.length > 1 && (
                                                            <button 
                                                                type="button"
                                                                onClick={() => removeRoomField(index)}
                                                                className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Fields Grid */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        {/* Room Name */}
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom / Numéro de la chambre</label>
                                                            <input 
                                                                type="text"
                                                                required
                                                                value={room.name}
                                                                onChange={e => updateRoomField(index, 'name', e.target.value)}
                                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white"
                                                                placeholder="ex: Chambre Standard 102"
                                                            />
                                                        </div>

                                                        {/* Room Type */}
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de chambre</label>
                                                            <select
                                                                value={room.type}
                                                                onChange={e => updateRoomField(index, 'type', e.target.value)}
                                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white outline-none"
                                                            >
                                                                <option value="simple">Chambre Simple (1 lit)</option>
                                                                <option value="double">Chambre Double (2 lits)</option>
                                                                <option value="suite">Suite Royale</option>
                                                            </select>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix par nuit (GNF)</label>
                                                            <input 
                                                                type="number"
                                                                required
                                                                min="0"
                                                                value={room.price}
                                                                onChange={e => updateRoomField(index, 'price', e.target.value)}
                                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white"
                                                                placeholder="ex: 250000"
                                                            />
                                                        </div>

                                                        {/* Capacity */}
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacité (personnes max)</label>
                                                            <input 
                                                                type="number"
                                                                required
                                                                min="1"
                                                                value={room.capacity}
                                                                onChange={e => updateRoomField(index, 'capacity', e.target.value)}
                                                                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white"
                                                                placeholder="ex: 2"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Specific details */}
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Équipement spécifique / Description (Optionnel)</label>
                                                        <input 
                                                            type="text"
                                                            value={room.description}
                                                            onChange={e => updateRoomField(index, 'description', e.target.value)}
                                                            className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold text-slate-900 dark:text-white"
                                                            placeholder="ex: Vue panoramique sur la ville, Balcon privé, Jacuzzi..."
                                                        />
                                                    </div>

                                                    {/* Room Image */}
                                                    <div className="space-y-4 pt-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Photo de la chambre</label>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                                                            <div className="sm:col-span-7">
                                                                {/* Display current images */}
                                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                                    {room.images && room.images.map((imgUrl, imgIdx) => (
                                                                        <div key={imgIdx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group">
                                                                            <img 
                                                                                src={imgUrl} 
                                                                                alt={`Aperçu chambre #${index + 1} - Photo ${imgIdx + 1}`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeRoomImage(index, imgIdx)}
                                                                                    className="bg-red-600 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                                                                                    title="Supprimer la photo"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Upload Box (if less than 3 images) */}
                                                                {(!room.images || room.images.length < 3) && (
                                                                    <label className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group overflow-hidden bg-slate-50 dark:bg-slate-800/20">
                                                                        {room.uploading ? (
                                                                            <div className="flex flex-col items-center gap-3">
                                                                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Envoi en cours...</span>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <Camera className="h-8 w-8 text-slate-400 group-hover:scale-110 transition-transform" />
                                                                                <div className="text-center px-4">
                                                                                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Ajouter une photo ({room.images?.length || 0}/3)</span>
                                                                                    <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-1">PNG, JPG (Max 2 Mo)</span>
                                                                                </div>
                                                                                <input 
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    className="hidden"
                                                                                    onChange={async (e) => {
                                                                                        const file = e.target.files?.[0];
                                                                                        if (file) {
                                                                                            await handleRoomImageUpload(index, file);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </label>
                                                                )}
                                                            </div>

                                                            <div className="sm:col-span-5 space-y-3">
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Ou choisir un modèle premium :</span>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {[
                                                                        { label: 'Simple', url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80', gradient: 'from-blue-500 to-indigo-600' },
                                                                        { label: 'Double', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80', gradient: 'from-purple-500 to-indigo-700' },
                                                                        { label: 'Suite', url: 'https://images.unsplash.com/photo-1611891487122-2075b96244e1?auto=format&fit=crop&q=80', gradient: 'from-amber-500 to-yellow-600' }
                                                                    ].map((tpl, tIdx) => (
                                                                        <button
                                                                            key={tIdx}
                                                                            type="button"
                                                                            onClick={() => addRoomTemplateImage(index, tpl.url)}
                                                                            className={`relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${tpl.gradient} border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all shadow-md flex flex-col items-center justify-center p-2 group shrink-0 ${room.images?.includes(tpl.url) ? 'ring-2 ring-primary border-primary' : ''}`}
                                                                            title={`Modèle ${tpl.label}`}
                                                                        >
                                                                            <Bed className="h-5 w-5 text-white/95 group-hover:scale-110 transition-transform mb-1" />
                                                                            <span className="text-[7px] text-white font-black uppercase tracking-widest">{tpl.label}</span>
                                                                            <div className="absolute inset-0 bg-[#1a2b4b]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <span className="text-[6px] text-white font-black uppercase tracking-widest bg-[#1a2b4b] px-1.5 py-0.5 rounded shadow">Choisir</span>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add room action button */}
                                        <button 
                                            type="button"
                                            onClick={addRoomField}
                                            className="w-full py-5 border-2 border-dashed border-primary/30 text-primary hover:border-primary hover:bg-primary/5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                                        >
                                            <Plus className="h-4 w-4" /> Ajouter une autre chambre
                                        </button>

                                        {/* Error Display */}
                                        {errorMsg && (
                                            <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 flex gap-4 text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                                                <XCircle className="h-6 w-6 shrink-0" />
                                                <div className="text-[11px] font-medium leading-relaxed text-left">
                                                    <p className="font-bold uppercase tracking-wider mb-1">Échec de l'enregistrement</p>
                                                    <p>{errorMsg}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <Button 
                                            onClick={handleStep2}
                                            disabled={loading}
                                            className="w-full py-7 bg-primary text-[#1a2b4b] hover:bg-primary/95 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 transition-all"
                                        >
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                                <>Continuer vers les documents <ChevronRight className="h-5 w-5 stroke-[3px]" /></>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-8">
                                        <h2 className="text-3xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">Photos & Documents</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="aspect-square bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-400 group hover:border-primary/50 cursor-pointer transition-all">
                                                <Camera className="h-10 w-10 group-hover:scale-125 transition-transform" />
                                                <p className="text-[9px] font-black uppercase tracking-widest text-center">Façade <br />Hôtel</p>
                                            </div>
                                            <div className="aspect-square bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-400 group hover:border-primary/50 cursor-pointer transition-all">
                                                <Info className="h-10 w-10 group-hover:scale-125 transition-transform" />
                                                <p className="text-[9px] font-black uppercase tracking-widest text-center">Permis <br />Exploitation</p>
                                            </div>
                                        </div>
                                        <Button onClick={nextStep} className="w-full py-7 bg-[#1a2b4b] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs">Soumettre pour vérification</Button>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-12 text-center py-10">
                                        <div className="relative inline-block">
                                            <ShieldCheck className="h-32 w-32 text-green-500 animate-bounce" />
                                            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 -z-10" />
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tighter italic">C'est envoyé !</h2>
                                            <p className="text-slate-500 max-w-sm mx-auto font-medium italic">
                                                Votre dossier est maintenant entre les mains de nos experts. Vous recevrez une confirmation sous 24h.
                                            </p>
                                        </div>
                                        <Button onClick={() => router.push('/dashboard/hotel/command-center')} className="w-full py-7 bg-primary text-[#1a2b4b] rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs">Accéder à mon tableau de bord</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Help Button */}
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Un problème ? <span className="text-primary cursor-pointer hover:underline">Contacter le support partenaire</span></p>
                </div>
            </div>
        </div>
    );
}
