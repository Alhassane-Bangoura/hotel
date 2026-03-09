import { MapPin, Calendar, Users } from 'lucide-react';

export function SearchSummary() {
    return (
        <header className="sticky top-0 z-50 bg-[#1e293b] shadow-lg py-4 px-6 md:px-12 -mx-6 md:-mx-12">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-white border-r border-slate-700 pr-6 mr-2 last:border-0 last:pr-0 last:mr-0">
                        <MapPin className="h-8 w-8 text-[#f49d25]" />
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Destination</p>
                            <p className="font-semibold text-sm">Labé, Guinée</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-white border-r border-slate-700 pr-6 mr-2 last:border-0 last:pr-0 last:mr-0 hidden md:flex">
                        <Calendar className="h-5 w-5 text-[#f49d25]" />
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Dates</p>
                            <p className="font-semibold text-sm">12 Oct — 15 Oct</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-white hidden sm:flex">
                        <Users className="h-5 w-5 text-[#f49d25]" />
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Voyageurs</p>
                            <p className="font-semibold text-sm">2 Adultes, 1 Chambre</p>
                        </div>
                    </div>
                </div>

                <button className="px-6 py-2 border-2 border-[#f49d25] text-[#f49d25] hover:bg-[#f49d25] hover:text-white transition-all font-bold rounded-lg text-xs uppercase tracking-widest">
                    Modifier
                </button>
            </div>
        </header>
    );
}
