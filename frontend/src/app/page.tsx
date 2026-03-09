'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HotelSearch } from '@/components/HotelSearch';
import { Button } from '@/components/ui/Button';
import { useHotelStore } from '@/store/useHotelStore';
import { hotelService } from '@/services/hotelService';
import {
  CheckCircle,
  Verified,
  Wallet,
  Headphones,
  Clock,
  ShieldCheck,
  Zap,
  MapPin,
  ArrowRight,
  Star,
  Hotel
} from 'lucide-react';

export default function HomePage() {
  const { hotels, setHotels, setLoading } = useHotelStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const data = await hotelService.getHotels();
      setHotels(data);
      setLoading(false);
    };
    fetchFeatured();
  }, [setHotels, setLoading]);

  const featuredRooms = hotels.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
          <Image
            src="/hero_hotel_bg_1772792881651.png"
            alt="Luxury Hotel"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-20 container mx-auto text-center text-white pt-12 md:pt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-2xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-[1.2] md:leading-[1.1] tracking-tight max-w-5xl mx-auto px-4"
          >
            Trouvez et réservez votre <br className="sm:hidden" /> chambre à Labé <span className="text-primary underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8">en quelques secondes</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-light px-4"
          >
            Le luxe et le confort guinéen à portée de clic. Découvrez les meilleurs établissements de la Moyenne-Guinée.
          </motion.p>

          <div className="mt-8">
            <HotelSearch />
          </div>

          {/* Trust Badges */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 flex flex-wrap justify-center gap-6 md:gap-12 px-4 text-white/90"
          >
            {[
              { icon: Verified, text: "Confirmation instantanée" },
              { icon: Wallet, text: "Paiement Mobile Money" },
              { icon: Headphones, text: "Support local 7j/7" },
            ].map((badge, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
              >
                <badge.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background dark:bg-slate-900/50 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a2b4b] dark:text-white mb-4 uppercase tracking-tight">Pourquoi nous choisir ?</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { icon: Clock, title: "Temps réel", desc: "Accédez aux stocks actualisés chaque seconde." },
            { icon: ShieldCheck, title: "Sécurisé", desc: "Paiement Orange Money 100% sécurisé." },
            { icon: Zap, title: "Rapide", desc: "Confirmation en moins de 2 minutes." },
            { icon: Hotel, title: "Qualité", desc: "Hôtels visités et vérifiés par nos soins." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl shadow-black/5 border border-slate-50 dark:border-slate-700 hover:border-primary/50 transition-all group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-[#1a2b4b] transition-colors">
                <feature.icon className="h-7 w-7 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <h2 className="font-display text-4xl font-black text-[#1a2b4b] dark:text-white mb-4 uppercase tracking-tighter">Chambres à la une</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight text-xs">Les sélections les plus prisées cette semaine à Labé.</p>
          </div>
          <Link href="/hotels" className="text-primary font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-primary/5 transition-all border border-slate-100 dark:border-slate-700 group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-primary text-[#1a2b4b] text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest z-10 shadow-lg">
                  Populaire
                </div>
              </div>
              <div className="p-8 text-left">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white mb-2 uppercase tracking-tight">{room.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                      <MapPin className="h-4 w-4 text-primary" /> {room.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-primary font-black text-2xl whitespace-nowrap">{room.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">GNF / nuit</span>
                  </div>
                </div>
                <Link href={`/hotels/${room.id}`}>
                  <Button className="w-full bg-[#1a2b4b] text-white hover:bg-[#1a2b4b]/90 dark:bg-primary dark:text-[#1a2b4b] h-14 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-black/10 active:scale-95 transition-all">
                    Détails & Réservation
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#1a2b4b] rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center shadow-2xl shadow-[#1a2b4b]/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px]"></div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-7xl font-black text-white mb-8 leading-tight max-w-4xl mx-auto tracking-tighter px-4 uppercase">
              Le voyage de vos rêves commence ici
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-medium px-4 leading-relaxed">
              Rejoignez des milliers de voyageurs satisfaits et assurez votre confort dès aujourd'hui dans les meilleurs hôtels de Labé.
            </p>
            <Link href="/hotels">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary hover:bg-primary/90 text-[#1a2b4b] px-16 h-20 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all uppercase tracking-widest">
                  Explorer les offres
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
