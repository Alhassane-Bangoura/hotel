import { useState } from 'react';
import { CreditCard, Store, Check } from 'lucide-react';

interface PaymentMethodsProps {
    value: string;
    onChange: (value: string) => void;
}

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
    return (
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-[#1a2b4b] dark:text-white">
                <div className="bg-[#f49d25]/10 p-2 rounded-xl">
                    <CreditCard className="h-6 w-6 text-[#f49d25]" />
                </div>
                Mode de paiement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { id: 'orange_money', name: 'Orange Money', logo: 'ORANGE', color: 'bg-orange-500' },
                    { id: 'mtn_money', name: 'Mobile Money', logo: 'MTN', color: 'bg-yellow-400 text-black' },
                    { id: 'cash', name: 'Sur place', Icon: Store }
                ].map((method) => (
                    <label key={method.id} className="relative cursor-pointer group">
                        <input
                            type="radio"
                            name="payment"
                            checked={value === method.id}
                            onChange={() => onChange(method.id)}
                            className="peer sr-only"
                        />
                        <div className="p-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl group-hover:border-[#f49d25]/50 peer-checked:border-[#f49d25] peer-checked:bg-[#f49d25]/5 transition-all h-full flex flex-col items-center justify-center gap-4">
                            {method.logo ? (
                                <div className={`h-10 w-16 ${method.color} rounded-lg flex items-center justify-center text-[11px] font-black shadow-sm`}>
                                    {method.logo}
                                </div>
                            ) : (
                                method.Icon && <method.Icon className="h-10 w-10 text-[#1a2b4b] dark:text-slate-400 group-hover:text-[#f49d25] transition-colors" />
                            )}
                            <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{method.name}</span>

                            {/* Selected Indicator */}
                            <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                                <div className="bg-[#f49d25] rounded-full p-1 shadow-lg shadow-[#f49d25]/30">
                                    <Check className="h-4 w-4 text-white font-black" />
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}
