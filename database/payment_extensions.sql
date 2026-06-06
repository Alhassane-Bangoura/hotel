-- Payment System Extensions (Simulated & Future-Ready)

-- Drop the old constraint to allow new statuses and methods
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_method_check;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_status_check;

-- Re-add with expanded methods and statuses
ALTER TABLE public.payments ADD CONSTRAINT payments_method_check 
  CHECK (method IN ('orange_money', 'mtn_money', 'card', 'cash', 'transfer'));

ALTER TABLE public.payments ADD CONSTRAINT payments_status_check 
  CHECK (status IN ('pending', 'simulated_paid', 'pay_at_hotel', 'success', 'failed'));

-- Add proof of payment support
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount DECIMAL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- RLS for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "Hotels can view payments for their bookings" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      JOIN public.rooms ON bookings.room_id = rooms.id
      JOIN public.hotels ON rooms.hotel_id = hotels.id
      WHERE bookings.id = payments.booking_id AND hotels.user_id = auth.uid()
    )
  );
