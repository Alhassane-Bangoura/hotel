-- ============================================================
-- LABÉ HOTEL PLATFORM — SQL SETUP COMPLET
-- Coller entièrement dans Supabase > SQL Editor > Run
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Profiles (liée à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('client', 'hotel', 'organizer', 'admin')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hôtels
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  quartier TEXT,
  phone TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Chambres
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('simple', 'double', 'suite')),
  price DECIMAL NOT NULL,
  capacity INTEGER DEFAULT 1,
  beds INTEGER DEFAULT 1,
  description TEXT,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Événements
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('forum', 'conference', 'mariage', 'administratif', 'autre')),
  start_date DATE,
  end_date DATE,
  description TEXT,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Réservations
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Paiements
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  method TEXT CHECK (method IN ('orange_money', 'mtn_money', 'cash')),
  transaction_reference TEXT UNIQUE,
  amount DECIMAL,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 2. INDEX (performance)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_quartier ON public.hotels(quartier);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hôtels
DROP POLICY IF EXISTS "hotels_select" ON public.hotels;
DROP POLICY IF EXISTS "hotels_insert" ON public.hotels;
DROP POLICY IF EXISTS "hotels_update_delete" ON public.hotels;

CREATE POLICY "hotels_select" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "hotels_insert" ON public.hotels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "hotels_update_delete" ON public.hotels FOR ALL USING (auth.uid() = user_id);

-- Chambres
DROP POLICY IF EXISTS "rooms_select" ON public.rooms;
DROP POLICY IF EXISTS "rooms_manage" ON public.rooms;

CREATE POLICY "rooms_select" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "rooms_manage" ON public.rooms FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.hotels
    WHERE hotels.id = rooms.hotel_id AND hotels.user_id = auth.uid()
  )
);

-- Événements
DROP POLICY IF EXISTS "events_select" ON public.events;
DROP POLICY IF EXISTS "events_manage" ON public.events;

CREATE POLICY "events_select" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_manage" ON public.events FOR ALL USING (auth.uid() = organizer_id);

-- Réservations
DROP POLICY IF EXISTS "bookings_client" ON public.bookings;
DROP POLICY IF EXISTS "bookings_hotel" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;

CREATE POLICY "bookings_client" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "bookings_hotel" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.hotels ON rooms.hotel_id = hotels.id
      WHERE rooms.id = bookings.room_id AND hotels.user_id = auth.uid()
    )
  );

CREATE POLICY "bookings_insert" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_update" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Paiements
DROP POLICY IF EXISTS "payments_select" ON public.payments;
DROP POLICY IF EXISTS "payments_insert" ON public.payments;

CREATE POLICY "payments_select" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "payments_insert" ON public.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. FONCTION + TRIGGER (création profil automatique)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 5. FONCTION — Génération référence réservation unique
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    ref := 'LH-' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE reference = ref) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
