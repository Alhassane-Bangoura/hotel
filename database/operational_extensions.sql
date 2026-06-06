-- Hotel Operational Management Extensions

-- Update Rooms Table for Housekeeping
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_housekeeping_check;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS housekeeping_status TEXT 
  CHECK (housekeeping_status IN ('clean', 'dirty', 'cleaning', 'maintenance')) DEFAULT 'clean';

-- Update Bookings Table for Operational Status
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_operational_status_check;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS operational_status TEXT 
  CHECK (operational_status IN ('pending', 'checked_in', 'checked_out', 'no_show')) DEFAULT 'pending';

-- Function to automatically mark room as 'dirty' on check-out
CREATE OR REPLACE FUNCTION public.handle_checkout_cleanup()
RETURNS trigger AS $$
BEGIN
  IF NEW.operational_status = 'checked_out' AND OLD.operational_status != 'checked_out' THEN
    UPDATE public.rooms SET housekeeping_status = 'dirty' WHERE id = NEW.room_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_checkout_cleanup
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.handle_checkout_cleanup();
