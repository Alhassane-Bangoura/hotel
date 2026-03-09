'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
                {toasts.map(toast => (
                    <div 
                        key={toast.id}
                        className={`flex items-center gap-4 p-4 pr-12 rounded-[1.5rem] shadow-2xl animate-in slide-in-from-right-full duration-300 border backdrop-blur-md ${
                            toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                            toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600' :
                            'bg-[#1a2b4b]/10 border-[#1a2b4b]/20 text-[#1a2b4b]'
                        }`}
                    >
                        {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                        {toast.type === 'error' && <XCircle className="h-5 w-5" />}
                        {toast.type === 'info' && <AlertCircle className="h-5 w-5" />}
                        <span className="text-sm font-black uppercase tracking-tight">{toast.message}</span>
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="absolute top-1/2 -translate-y-1/2 right-4 p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
}
