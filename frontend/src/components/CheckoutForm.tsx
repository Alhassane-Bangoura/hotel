import { User } from 'lucide-react';

interface CheckoutFormData {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    specialRequests: string;
}

interface CheckoutFormProps {
    data: CheckoutFormData;
    onChange: (data: CheckoutFormData) => void;
}

export function CheckoutForm({ data, onChange }: CheckoutFormProps) {
    const handleChange = (field: keyof CheckoutFormData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#1a2b4b] dark:text-white">
                <div className="bg-[#f49d25]/10 p-2 rounded-xl">
                    <User className="h-6 w-6 text-[#f49d25]" />
                </div>
                Informations du client
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label>
                    <input
                        required
                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#f49d25] focus:ring-0 transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="Mamadou Diallo"
                        type="text"
                        value={data.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Adresse e-mail</label>
                    <input
                        required
                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#f49d25] focus:ring-0 transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="m.diallo@email.com"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Numéro de téléphone</label>
                    <input
                        required
                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#f49d25] focus:ring-0 transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="+224 620 00 00 00"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Pays de résidence</label>
                    <select 
                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#f49d25] focus:ring-0 transition-all font-black text-slate-700 dark:text-slate-200 appearance-none"
                        value={data.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                    >
                        <option>Guinée</option>
                        <option>France</option>
                        <option>Sénégal</option>
                        <option>Côte d'Ivoire</option>
                    </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Demandes spéciales (Optionnel)</label>
                    <textarea
                        className="w-full p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-transparent focus:border-[#f49d25] focus:ring-0 transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        placeholder="Ex: Arrivée tardive, allergie alimentaire, lit bébé..."
                        rows={4}
                        value={data.specialRequests}
                        onChange={(e) => handleChange('specialRequests', e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
