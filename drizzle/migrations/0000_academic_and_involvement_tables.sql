-- Allow both Reichman student domains
CREATE OR REPLACE FUNCTION public.enforce_runi_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF lower(split_part(NEW.email, '@', 2)) NOT IN ('runi.ac.il', 'post.runi.ac.il') THEN
    RAISE EXCEPTION 'Only @runi.ac.il and @post.runi.ac.il email addresses are allowed.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END; $function$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;

CREATE TABLE public.academic_details (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school text,
  degree_level text,
  degree text,
  year integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academic_details TO authenticated;
GRANT ALL ON public.academic_details TO service_role;

ALTER TABLE public.academic_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own academic details" ON public.academic_details
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own academic details" ON public.academic_details
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own academic details" ON public.academic_details
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER academic_details_set_updated_at
  BEFORE UPDATE ON public.academic_details
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.campus_involvement (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  special_programs text[] NOT NULL DEFAULT '{}'::text[],
  clubs text[] NOT NULL DEFAULT '{}'::text[],
  volunteering text[] NOT NULL DEFAULT '{}'::text[],
  skills text[] NOT NULL DEFAULT '{}'::text[],
  interests text[] NOT NULL DEFAULT '{}'::text[],
  looking_for text[] NOT NULL DEFAULT '{}'::text[],
  availability text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.campus_involvement TO authenticated;
GRANT ALL ON public.campus_involvement TO service_role;

ALTER TABLE public.campus_involvement ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own involvement" ON public.campus_involvement
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own involvement" ON public.campus_involvement
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own involvement" ON public.campus_involvement
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER campus_involvement_set_updated_at
  BEFORE UPDATE ON public.campus_involvement
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();