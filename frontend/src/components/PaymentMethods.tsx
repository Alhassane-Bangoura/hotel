import { CreditCard, Store, Check, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentMethodsProps {
    value: string;
    onChange: (value: string) => void;
}

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
    const methods = [
        { 
            id: 'orange_money', 
            name: 'Orange Money', 
            logo: 'ORANGE', 
            color: 'bg-orange-500 text-white', 
            desc: 'Paiement direct via API Orange' 
        },
        { 
            id: 'mtn_money', 
            name: 'MTN MoMo', 
            logo: 'MTN', 
            color: 'bg-yellow-400 text-black', 
            desc: 'Service Mobile Money MTN' 
        },
        { 
            id: 'card', 
            name: 'Carte Bancaire', 
            Icon: CreditCard, 
            color: 'bg-[#1a2b4b] text-white', 
            desc: 'Visa, Mastercard, Amex' 
        },
        { 
            id: 'cash', 
            name: 'Paiement à l\'hôtel', 
            Icon: Store, 
            color: 'bg-slate-100 text-slate-700', 
            desc: 'Payez lors de votre arrivée' 
        }
    ];

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {methods.map((method) => (
                    <label key={method.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="payment"
                            checked={value === method.id}
                            onChange={() => onChange(method.id)}
                            className="peer sr-only"
                        />
                        <motion.div 
                            whileHover={{ y: -4 }}
                            className="p-8 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/[0.03] transition-all h-full flex flex-col items-start gap-6 relative overflow-hidden"
                        >
                            {/* Visual Header */}
                            <div className="flex items-center justify-between w-full">
                                {method.logo ? (
                                    <div className={`h-12 w-20 ${method.color} rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg shadow-black/5 tracking-tighter`}>
                                        {method.logo}
                                    </div>
                                ) : (
                                    <div className={`h-12 w-12 ${method.color} rounded-xl flex items-center justify-center shadow-lg shadow-black/5`}>
                                        {method.Icon && <method.Icon className="h-6 w-6" />}
                                    </div>
                                )}
                                
                                <div className="size-6 border-2 border-slate-200 dark:border-slate-700 rounded-full peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                                    <div className="size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-1">
                                <h4 className="text-lg font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{method.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{method.desc}</p>
                            </div>

                            {/* Selected Indicator Background */}
                            <div className="absolute -right-8 -bottom-8 opacity-0 peer-checked:opacity-10 transition-opacity">
                                {method.Icon ? <method.Icon className="h-32 w-32 text-primary" /> : <div className="text-8xl font-black text-primary">{method.logo}</div>}
                            </div>
                        </motion.div>
                    </label>
                ))}
            </div>

            {/* Trust Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2b4b] dark:text-white leading-none">Paiement 100% Sécurisé</p>
                        <p className="text-[9px] text-slate-400 font-medium mt-1">Vos données sont cryptées via SSL 256 bits</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[8px] font-black text-slate-400">VISA</div>
                    <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[8px] font-black text-slate-400">MC</div>
                    <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[8px] font-black text-slate-400">OM</div>
                </div>
            </div>
        </div>
    );
}
