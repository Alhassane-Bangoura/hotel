-- Marketplace Extensions for National Scale

-- Regions of Guinea
CREATE TABLE public.regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cities linked to Regions
CREATE TABLE public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(region_id, name)
);

-- Audit Logs for Monitoring
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'hotel', 'booking', 'user', etc.
  resource_id UUID,
  details JSONB,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Incident Management
CREATE TABLE public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'fake_review', 'no_show', 'payment_issue', 'other'
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')) DEFAULT 'open',
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update Hotels to support national scale and verification
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id);
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS documents_url TEXT[];
ALTER TABLE public.hotels ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- RLS Policies for new tables

-- Regions & Cities are public
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON public.cities FOR SELECT USING (true);

-- Audit Logs: Only Super Admin (role='admin' in current schema)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Incidents: Admins and reporters
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all incidents" ON public.incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Users can view incidents they reported" ON public.incidents
  FOR SELECT USING (auth.uid() = reported_by);

-- Insert Initial Regions & Cities
INSERT INTO public.regions (name) VALUES 
('Moyenne-Guinée'), ('Basse-Guinée'), ('Haute-Guinée'), ('Guinée-Forestière');

-- Seed for Labé (Moyenne-Guinée)
DO $$
DECLARE
    moyenne_guinee_id UUID;
BEGIN
    SELECT id INTO moyenne_guinee_id FROM public.regions WHERE name = 'Moyenne-Guinée';
    INSERT INTO public.cities (region_id, name) VALUES (moyenne_guinee_id, 'Labé');
    INSERT INTO public.cities (region_id, name) VALUES (moyenne_guinee_id, 'Dalaba');
    INSERT INTO public.cities (region_id, name) VALUES (moyenne_guinee_id, 'Mamou');
    INSERT INTO public.cities (region_id, name) VALUES (moyenne_guinee_id, 'Pita');
END $$;
