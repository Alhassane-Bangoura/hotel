-- Communication & Automation Extensions

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN (
    'booking_confirmed', 
    'booking_cancelled', 
    'booking_reminder', 
    'hotel_verified', 
    'onboarding_approved', 
    'incident_alert',
    'system'
  )) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  link TEXT, -- Optional link to redirect user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Favorites Table (Retention)
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, hotel_id)
);

-- RLS Policies

-- Notifications: Only the recipient can view and update
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Favorites: Only the owner can manage
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Real-time Enablement
-- Note: Realtime must be enabled in the Supabase dashboard for these tables.
-- In SQL, we can add them to the 'supabase_realtime' publication.
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
