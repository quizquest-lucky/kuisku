CREATE TABLE public.players (
  player_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  score_sd INTEGER NOT NULL DEFAULT 0,
  score_smp INTEGER NOT NULL DEFAULT 0,
  score_sma INTEGER NOT NULL DEFAULT 0,
  ads_watched INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.players TO anon;
GRANT SELECT ON public.players TO authenticated;
GRANT ALL ON public.players TO service_role;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard is publicly readable"
ON public.players FOR SELECT
USING (true);

CREATE INDEX players_score_sd_idx ON public.players (score_sd DESC);
CREATE INDEX players_score_smp_idx ON public.players (score_smp DESC);
CREATE INDEX players_score_sma_idx ON public.players (score_sma DESC);