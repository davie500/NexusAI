-- Add language preference column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'pt';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred language for UI (pt, en, es, fr, de, it, zh, ja, ko, ru, ar, hi)';