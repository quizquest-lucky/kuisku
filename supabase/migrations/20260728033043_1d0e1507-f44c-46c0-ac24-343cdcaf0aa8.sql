CREATE UNIQUE INDEX IF NOT EXISTS players_username_lower_key ON public.players (lower(username));

CREATE TABLE public.player_credentials (
  player_id text PRIMARY KEY REFERENCES public.players(player_id) ON DELETE CASCADE,
  username_lower text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.player_credentials TO service_role;

ALTER TABLE public.player_credentials ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_player_credentials_updated_at
BEFORE UPDATE ON public.player_credentials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();