'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Send, Mic, Image as ImageIcon, Phone, Video, 
    MoreVertical, ChevronLeft, Check, CheckCheck, 
    X, Loader2, Play, Pause, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, ChatMessage } from '@/services/chatService';
import { Button } from './ui/Button';
import { useUser } from '@/hooks/useUser';

interface ChatWindowProps {
    conversationId: string;
    recipientName: string;
    onClose?: () => void;
}

export function ChatWindow({ conversationId, recipientName, onClose }: ChatWindowProps) {
    const { user } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await chatService.getMessages(conversationId);
                setMessages(data);
                setLoading(false);
                chatService.markAsRead(conversationId);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMessages();

        const subscription = chatService.subscribeToMessages(conversationId, (payload) => {
            const newMessage = payload.new as ChatMessage;
            setMessages(prev => [...prev, newMessage]);
            if (newMessage.sender_id !== user?.id) {
                chatService.markAsRead(conversationId);
            }
        });

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [conversationId, user?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !user) return;

        const messageData = {
            conversation_id: conversationId,
            sender_id: user.id,
            content: inputText,
            type: 'text' as const,
        };

        setInputText('');
        await chatService.sendMessage(messageData);
    };

    const handleVoiceRecord = () => {
        setIsRecording(!isRecording);
        // Logic for recording audio would go here
        if (isRecording) {
            console.log("Stopping recording and sending...");
        } else {
            console.log("Starting voice recording...");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Uploading image:", file.name);
            // Logic for uploading image would go here
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    {onClose && (
                        <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-primary transition-all">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}
                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary text-sm uppercase">
                        {recipientName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight">{recipientName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">En ligne</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                        <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                        <Video className="h-4 w-4" />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5"
            >
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chargement de la conversation...</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] sm:max-w-[70%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 sm:p-5 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${
                                        isMe 
                                        ? 'bg-[#1a2b4b] text-white rounded-tr-none shadow-xl shadow-[#1a2b4b]/10' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                                    }`}>
                                        {msg.type === 'text' && msg.content}
                                        {msg.type === 'image' && (
                                            <div className="rounded-xl overflow-hidden mb-2">
                                                <img src={msg.media_url} alt="Shared" className="max-w-full" />
                                            </div>
                                        )}
                                        {msg.type === 'voice' && (
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <button className={`p-3 rounded-full ${isMe ? 'bg-primary/20 text-primary' : 'bg-primary text-[#1a2b4b]'}`}>
                                                    <Play className="h-4 w-4 fill-current" />
                                                </button>
                                                <div className="flex-1 h-1 bg-slate-300/30 rounded-full overflow-hidden">
                                                    <div className="h-full w-1/2 bg-primary" />
                                                </div>
                                                <span className="text-[9px] font-black opacity-60">0:12</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 px-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            msg.is_read 
                                            ? <CheckCheck className="h-3 w-3 text-primary" />
                                            : <Check className="h-3 w-3 text-slate-300" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="bg-white dark:bg-slate-900 p-2 pl-6 rounded-[2rem] shadow-xl shadow-black/5 flex items-center gap-4 border border-slate-100 dark:border-slate-800 focus-within:border-primary/50 transition-all">
                    <button className="text-slate-400 hover:text-primary transition-all relative">
                        <Paperclip className="h-5 w-5" />
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    </button>
                    <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Répondre..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 text-[#1a2b4b] dark:text-white placeholder:italic"
                    />
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleVoiceRecord}
                            className={`p-4 rounded-2xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`}
                        >
                            <Mic className="h-5 w-5" />
                        </button>
                        <Button 
                            onClick={handleSend}
                            disabled={!inputText.trim()}
                            className="p-4 bg-primary text-[#1a2b4b] rounded-2xl shadow-lg shadow-primary/20 active:scale-90 transition-all"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { supabase } from '@/lib/supabaseClient';
