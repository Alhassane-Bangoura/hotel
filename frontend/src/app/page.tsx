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
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 1 }}
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
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-2xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-[1.2] md:leading-[1.1] tracking-tight max-w-5xl mx-auto px-4"
          >
            Trouvez et réservez votre <br className="sm:hidden" /> chambre à Labé <span className="text-primary underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8">en quelques secondes</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 1, y: 20 }}
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
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight text-xs">Les sélections les plus prisées cette semaine en Moyenne-Guinée.</p>
          </div>
          <Link href="/hotels" className="text-primary font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, idx) => {
            const REAL_ROOMS_DATA = [
              {
                name: "Suite Diplomatique",
                image: "/room_suite_diplomatique_1772792992712.png",
                price: 850000,
                location: "Quartier Tata, Labé"
              },
              {
                name: "Chambre Executive Premium",
                image: "/room_executive_1772793107544.png",
                price: 550000,
                location: "Quartier Bowloko, Labé"
              },
              {
                name: "Chambre Standard Cosy",
                image: "/room_standard_1772793062441.png",
                price: 350000,
                location: "Quartier Kouroula, Labé"
              }
            ];
            
            const details = REAL_ROOMS_DATA[idx % REAL_ROOMS_DATA.length];
            const roomImage = details.image;
            const roomName = details.name;
            const roomPrice = room.price && room.price > 0 ? room.price : details.price;
            const roomLocation = room.location && room.location !== "Labé, Guinée" ? room.location : details.location;

            return (
              <motion.div 
                key={room.id}
                initial={{ opacity: 1, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-primary/5 transition-all border border-slate-100 dark:border-slate-700 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={roomImage}
                    alt={roomName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    <div className="bg-primary text-[#1a2b4b] text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                      Populaire
                    </div>
                    {idx === 0 && (
                      <div className="bg-destructive text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg flex items-center gap-2 animate-pulse">
                        <Zap className="h-3 w-3 fill-current" /> Plus que 2 chambres
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-[#1a2b4b] text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest z-10 shadow-lg flex items-center gap-2">
                    <Verified className="h-3 w-3 text-primary" /> Confirmation immédiate
                  </div>
                </div>
                <div className="p-8 text-left">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-black text-[#1a2b4b] dark:text-white mb-2 uppercase tracking-tight">{roomName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <MapPin className="h-4 w-4 text-primary" /> {roomLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="block text-primary font-black text-2xl whitespace-nowrap">{roomPrice.toLocaleString()}</span>
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
            );
          })}
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-24 container mx-auto px-6 overflow-hidden">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-left">
              <span className="inline-block bg-primary text-[#1a2b4b] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-6">Offres Limitées</span>
              <h2 className="font-display text-3xl md:text-5xl font-black text-[#1a2b4b] dark:text-white mb-6 uppercase leading-tight tracking-tighter">
                Profitez de -20% sur vos séjours de <span className="text-primary">plus de 3 nuits</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 font-medium max-w-xl">
                Réservez dès maintenant pour bénéficier de nos tarifs préférentiels "Early Bird" sur les meilleurs établissements de Labé.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/hotels">
                  <Button className="bg-[#1a2b4b] dark:bg-white dark:text-[#1a2b4b] px-8 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10">
                    Découvrir les offres
                  </Button>
                </Link>
                <div className="flex items-center gap-3 px-6 h-16 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold text-[#1a2b4b] dark:text-white uppercase tracking-wider">Expire dans 48h</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
              <Image 
                src="/hero_hotel_bg_1772792881651.png" 
                alt="Special Offer" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b]/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white text-left">
                <p className="text-5xl font-black mb-2">-20%</p>
                <p className="uppercase tracking-[0.3em] text-[10px] font-black opacity-80">Sur toute la ville de Labé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Destinations (Scalability) */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#1a2b4b] dark:text-white mb-4 uppercase tracking-tight">Explorez Labé</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Découvrez les quartiers emblématiques de la capitale du Fouta</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Daka", img: "/hero_hotel_bg_1772792881651.png", count: "8 Hôtels" },
            { name: "Tata", img: "/hotel_building_split_1772792915358.png", count: "12 Hôtels" },
            { name: "Kouroula", img: "/room_suite_diplomatique_1772792992712.png", count: "6 Hôtels" },
            { name: "Konkola", img: "/room_executive_1772793107544.png", count: "9 Hôtels" }
          ].map((city, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="relative h-48 md:h-64 rounded-[2rem] overflow-hidden group cursor-pointer"
            >
              <Image src={city.img} alt={city.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-1">{city.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{city.count}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div 
          initial={{ opacity: 1, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#1a2b4b] rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center shadow-2xl shadow-[#1a2b4b]/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px]"></div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl sm:text-4xl md:text-7xl font-black text-white mb-8 leading-tight max-w-4xl mx-auto tracking-tighter px-4 uppercase">
              La référence du voyage en Guinée
            </h2>
            <p className="text-slate-300 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-medium px-4 leading-relaxed">
              Assurez votre confort dès aujourd'hui dans les meilleurs établissements de Labé et partout ailleurs très prochainement.
            </p>
            <Link href="/hotels">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary hover:bg-primary/90 text-[#1a2b4b] px-16 h-20 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 transition-all uppercase tracking-widest">
                  Réserver maintenant
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
