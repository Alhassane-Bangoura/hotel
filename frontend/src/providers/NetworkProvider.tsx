'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineService } from '@/services/offlineService';
import { Wifi, WifiOff, CloudSync, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkContextType {
    isOnline: boolean;
    isSyncing: boolean;
    lowConnectivity: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
    isOnline: true,
    isSyncing: false,
    lowConnectivity: false
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lowConnectivity, setLowConnectivity] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncData();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Initial check
        setIsOnline(navigator.onLine);
        if (navigator.onLine) syncData();

        // Check for low connectivity (Slow 3G, etc.)
        if ('connection' in navigator) {
            const conn = (navigator as any).connection;
            setLowConnectivity(conn.effectiveType === '2g' || conn.saveData);
            conn.addEventListener('change', () => {
                setLowConnectivity(conn.effectiveType === '2g' || conn.saveData);
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const syncData = async () => {
        setIsSyncing(true);
        try {
            await offlineService.syncPendingActions();
        } catch (err) {
            console.error('Sync failed', err);
        } finally {
            setTimeout(() => setIsSyncing(false), 2000);
        }
    };

    return (
        <NetworkContext.Provider value={{ isOnline, isSyncing, lowConnectivity }}>
            {children}
            
            {/* Status Indicator Bar */}
            <AnimatePresence>
                {(!isOnline || isSyncing) && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]"
                    >
                        <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${
                            !isOnline ? 'bg-red-500/90 border-red-400 text-white' : 'bg-[#1a2b4b]/90 border-slate-700 text-primary'
                        }`}>
                            {!isOnline ? (
                                <>
                                    <WifiOff className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Mode Hors-Ligne Actif</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Synchronisation en cours...</span>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </NetworkContext.Provider>
    );
}

export const useNetwork = () => useContext(NetworkContext);
