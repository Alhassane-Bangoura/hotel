-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- ... (garde le reste identique jusqu'à la fin de payments)

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (Refined)

-- ...

-- Reviews
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews." ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('client', 'hotel', 'organizer', 'admin')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Hotels table
CREATE TABLE public.hotels (
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

-- Rooms table
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT, -- simple, double, suite
  price DECIMAL NOT NULL,
  capacity INTEGER DEFAULT 1,
  description TEXT,
  status TEXT CHECK (status IN ('available', 'maintenance')) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  method TEXT CHECK (method IN ('orange_money', 'mtn_money', 'cash')),
  transaction_reference TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'success', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (Basic examples, need refinement)

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Hotels
CREATE POLICY "Hotels are viewable by everyone." ON public.hotels
  FOR SELECT USING (true);

CREATE POLICY "Hotels can manage their own profile." ON public.hotels
  FOR ALL USING (auth.uid() = user_id);

-- Rooms
CREATE POLICY "Rooms are viewable by everyone." ON public.rooms
  FOR SELECT USING (true);

-- Bookings
CREATE POLICY "Users can see their own bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hotels can see bookings for their rooms." ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rooms 
      JOIN public.hotels ON rooms.hotel_id = hotels.id
      WHERE rooms.id = bookings.room_id AND hotels.user_id = auth.uid()
    )
  );
