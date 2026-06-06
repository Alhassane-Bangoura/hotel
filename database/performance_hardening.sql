-- Fix schema for bookings table to include hotel_id
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE;

-- Backfill hotel_id from rooms table for existing bookings
UPDATE public.bookings 
SET hotel_id = rooms.hotel_id 
FROM public.rooms 
WHERE bookings.room_id = rooms.id AND bookings.hotel_id IS NULL;

-- Make hotel_id NOT NULL for future consistency (optional but recommended)
-- ALTER TABLE public.bookings ALTER COLUMN hotel_id SET NOT NULL;

-- Performance & Scalability Hardening (Re-run)

-- Indexes for fast searches and filtering
CREATE INDEX IF NOT EXISTS idx_hotels_location ON public.hotels(quartier);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels(status);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_hotel_id ON public.hotel_activity_log(hotel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_hotel_id ON public.hotel_alerts(hotel_id) WHERE is_resolved = false;

-- Table for Technical Monitoring (Observability)
CREATE TABLE IF NOT EXISTS public.system_health_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'error', 'slow_query', 'subscription_fail', 'performance'
  component TEXT,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Health Logs (Admin only)
-- Ensure table exists before ALTER
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view health logs') THEN
        CREATE POLICY "Admins can view health logs" ON public.system_health_logs
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
          );
    END IF;
END $$;
