-- Voting / Poll tables for DBARENA News CMS Block Editor

CREATE TABLE IF NOT EXISTS public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_key TEXT NOT NULL,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (poll_id, user_key)
);

-- Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public select polls"        ON public.polls        FOR SELECT USING (true);
CREATE POLICY "Allow public select poll_options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Allow public select poll_votes"   ON public.poll_votes   FOR SELECT USING (true);

-- Write access (anonymous + authenticated)
CREATE POLICY "Allow insert poll_votes"          ON public.poll_votes   FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin manage polls"         ON public.polls        FOR ALL USING (true);
CREATE POLICY "Allow admin manage poll_options"  ON public.poll_options FOR ALL USING (true);

