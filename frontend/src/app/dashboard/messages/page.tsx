'use client';

import { useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatWindow } from '@/components/ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<{ id: string, name: string } | null>(null);

    return (
        <div className="min-h-screen bg-[#f8f7f5] dark:bg-[#0f172a] p-4 sm:p-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl md:text-6xl font-black text-[#1a2b4b] dark:text-white tracking-tighter uppercase leading-[0.8]">
                            Centre de <br /><span className="text-primary italic">Messagerie</span>
                        </h1>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-6">Communication directe · LabéBooking</p>
                    </motion.div>
                    
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-[2rem] shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20">
                            <ShieldCheck className="h-4 w-4" /> Sécurisé par RLS
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                            <Zap className="h-4 w-4" /> Temps réel actif
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[700px]">
                    {/* Conversations List */}
                    <div className={`lg:col-span-4 h-full ${selectedChat ? 'hidden lg:block' : 'block'}`}>
                        <ChatList onSelectConversation={(id, name) => setSelectedChat({ id, name })} />
                    </div>

                    {/* Chat Window */}
                    <div className={`lg:col-span-8 h-full ${!selectedChat ? 'hidden lg:block' : 'block'}`}>
                        {selectedChat ? (
                            <ChatWindow 
                                conversationId={selectedChat.id} 
                                recipientName={selectedChat.name}
                                onClose={() => setSelectedChat(null)}
                            />
                        ) : (
                            <div className="h-full bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-10">
                                <div className="size-32 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-10 group">
                                    <MessageSquare className="h-14 w-14 text-slate-200 group-hover:scale-110 group-hover:text-primary transition-all duration-500" />
                                </div>
                                <h3 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight mb-4">Sélectionnez une conversation</h3>
                                <p className="text-slate-400 max-w-xs text-sm font-medium italic">
                                    Communiquez directement avec les hôteliers pour poser vos questions ou confirmer vos horaires.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
