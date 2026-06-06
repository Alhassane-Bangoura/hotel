-- Hotel Command Center Extensions

-- Activity Log for the Unified Feed
CREATE TABLE public.hotel_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'booking', 'check_in', 'check_out', 'housekeeping', 'message', 'alert'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Realtime Alerts
CREATE TABLE public.hotel_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'urgent_cleaning', 'late_arrival', 'unread_message', 'maintenance'
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Command Center
ALTER TABLE public.hotel_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels can view their own activity logs" ON public.hotel_activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE id = hotel_id AND user_id = auth.uid())
  );

CREATE POLICY "Hotels can view their own alerts" ON public.hotel_alerts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.hotels WHERE id = hotel_id AND user_id = auth.uid())
  );

-- Function to automatically log activities
CREATE OR REPLACE FUNCTION public.log_hotel_activity()
RETURNS trigger AS $$
BEGIN
  IF TG_TABLE_NAME = 'bookings' THEN
    IF TG_OP = 'INSERT' THEN
      INSERT INTO public.hotel_activity_log (hotel_id, type, content)
      VALUES (NEW.hotel_id, 'booking', 'Nouvelle réservation reçue');
    ELSIF NEW.operational_status = 'checked_in' AND OLD.operational_status != 'checked_in' THEN
      INSERT INTO public.hotel_activity_log (hotel_id, type, content)
      VALUES (NEW.hotel_id, 'check_in', 'Client enregistré (Check-in)');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_activity
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.log_hotel_activity();
