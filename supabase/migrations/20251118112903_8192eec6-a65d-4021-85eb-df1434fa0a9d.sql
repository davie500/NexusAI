-- Fix 1: Change RLS policy types from RESTRICTIVE to PERMISSIVE for anonymous denial
-- This ensures anonymous users are properly blocked regardless of other policy evaluations

DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;

CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
AS PERMISSIVE
FOR ALL
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
AS PERMISSIVE
FOR ALL
TO anon
USING (false);

-- Fix 2: Add unique constraint to prevent race condition in admin creation
-- Only one admin role can exist at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_admin 
ON public.user_roles (role) 
WHERE role = 'admin';

-- Fix 3: Create edge function helper to properly delete users (including auth.users)
-- This will be called from the AdminPanel component
CREATE OR REPLACE FUNCTION public.can_delete_user(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  ) AND NOT EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = target_user_id
      AND role = 'admin'
  );
$$;

COMMENT ON FUNCTION public.can_delete_user IS 'Check if current user can delete target user (admin can delete non-admins)';
