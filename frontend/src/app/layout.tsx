import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/MainLayout";
import { UserProvider } from "@/hooks/useUser";
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: "Premium Labé Booking - Hôtel & Chambres",
  description: "Plateforme premium pour la réservation d'hôtels et d'événements à Labé, Guinée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <UserProvider>
          <ToastProvider>
            <MainLayout>{children}</MainLayout>
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
