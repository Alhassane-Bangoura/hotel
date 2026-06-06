'use client';

import type { ReactNode } from "react";
import { usePathname } from 'next/navigation';
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileNavigation } from "./MobileNavigation";
import { ErrorBoundary } from "./ErrorBoundary";

export function MainLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    
    // Hide public layout elements for hotel operations and admin panels
    const isOperationalDashboard = pathname?.startsWith('/dashboard/hotel') || pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/admin');

    if (isOperationalDashboard) {
        return (
            <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
                <main className="flex-1">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
            <MobileNavigation />
            <Footer />
        </div>
    );
}
