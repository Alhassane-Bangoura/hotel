'use client';

export function FilterSidebar() {
    return (
        <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm sticky top-28 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg dark:text-white">Filtres</h2>
                    <button className="text-[#f49d25] text-xs font-bold uppercase hover:underline">Réinitialiser</button>
                </div>

                {/* Price Slider Placeholder */}
                <div className="mb-8">
                    <p className="text-sm font-bold mb-4 dark:text-slate-200">Budget (GNF / nuit)</p>
                    <div className="space-y-4">
                        <div className="relative h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                            <div className="absolute inset-y-0 left-1/4 right-1/4 bg-[#f49d25] rounded-full"></div>
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#f49d25] rounded-full shadow-md cursor-pointer"></div>
                            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#f49d25] rounded-full shadow-md cursor-pointer"></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-500">
                            <span>200k</span>
                            <span>1,500k+</span>
                        </div>
                    </div>
                </div>

                {/* Neighborhoods */}
                <div className="mb-8">
                    <p className="text-sm font-bold mb-4 dark:text-slate-200">Quartier</p>
                    <div className="space-y-3">
                        {['Koulidara', 'Tata', 'Pounthioun', 'Dowsaré'].map((q) => (
                            <label key={q} className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="rounded border-slate-300 text-[#f49d25] focus:ring-[#f49d25]" />
                                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-[#f49d25] transition-colors">{q}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Room Type */}
                <div className="mb-8">
                    <p className="text-sm font-bold mb-4 dark:text-slate-200">Type de chambre</p>
                    <div className="grid grid-cols-1 gap-2">
                        {['Standard', 'Suite', 'VIP / Présidentielle'].map((type, i) => (
                            <button key={type} className={`text-left px-4 py-2.5 text-sm rounded-lg transition-all font-semibold ${i === 0 ? 'bg-[#f49d25]/10 text-[#f49d25] border border-[#f49d25]/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Orange Money / Moov</span>
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f49d25]"></div>
                        </div>
                    </label>
                </div>
            </div>
        </aside>
    );
}
