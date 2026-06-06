-- Hotel Business Management Extensions

-- Update Hotels Table
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS rating_average DECIMAL DEFAULT 0;
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS email_pro TEXT;
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS website TEXT;

-- Update Rooms Table
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check 
  CHECK (status IN ('draft', 'published', 'suspended', 'maintenance'));
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Standard';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Functions for Analytics
CREATE OR REPLACE FUNCTION get_hotel_revenue(hotel_id_param UUID, start_date TIMESTAMP, end_date TIMESTAMP)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(total_price), 0)
    FROM public.bookings
    WHERE hotel_id = hotel_id_param 
    AND status = 'confirmed'
    AND created_at BETWEEN start_date AND end_date
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_hotel_occupancy(hotel_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_rooms INTEGER;
  booked_rooms INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_rooms FROM public.rooms WHERE hotel_id = hotel_id_param AND status = 'published';
  SELECT COUNT(DISTINCT room_id) INTO booked_rooms 
  FROM public.bookings 
  WHERE hotel_id = hotel_id_param 
  AND status = 'confirmed' 
  AND CURRENT_DATE BETWEEN check_in AND check_out;
  
  IF total_rooms = 0 THEN RETURN 0; END IF;
  RETURN (booked_rooms::DECIMAL / total_rooms::DECIMAL) * 100;
END;
$$ LANGUAGE plpgsql;
