'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <div className="h-20 w-20 bg-red-50 dark:bg-red-950/30 rounded-3xl flex items-center justify-center mb-6">
                        <AlertTriangle className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-[#1a2b4b] dark:text-white uppercase tracking-tight mb-4">Oups ! Quelque chose a mal tourné.</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 italic">
                        L'application a rencontré une erreur inattendue. Nos équipes ont été notifiées.
                    </p>
                    <Button 
                        onClick={() => window.location.reload()}
                        className="gap-3"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Recharger la page
                    </Button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 p-4 bg-slate-100 dark:bg-black/20 rounded-xl text-left text-[10px] overflow-auto max-w-full text-red-400">
                            {this.state.error?.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
