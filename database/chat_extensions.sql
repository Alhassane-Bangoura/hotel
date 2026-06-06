-- Real-time Communication Extensions (Chat & Calls)

-- Conversations Table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(booking_id) -- One conversation per booking
);

-- Messages Table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT,
  type TEXT CHECK (type IN ('text', 'voice', 'image', 'file', 'call_log')) DEFAULT 'text',
  media_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb, -- duration for voice, file size, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies

-- Conversations: Participants only
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view their conversations" ON public.conversations
  FOR SELECT USING (
    auth.uid() = client_id OR 
    EXISTS (
      SELECT 1 FROM public.hotels 
      WHERE hotels.id = conversations.hotel_id AND hotels.user_id = auth.uid()
    )
  );

-- Messages: Participants only
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages in their conversations" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id AND (
        conversations.client_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.hotels 
          WHERE hotels.id = conversations.hotel_id AND hotels.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id AND (
        conversations.client_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.hotels 
          WHERE hotels.id = conversations.hotel_id AND hotels.user_id = auth.uid()
        )
      )
    )
  );

-- Supabase Realtime Publication
-- Note: Must be enabled in dashboard for 'messages' and 'conversations'
