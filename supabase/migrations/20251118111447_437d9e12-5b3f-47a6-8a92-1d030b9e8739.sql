-- Fix 1: Add explicit anonymous denial policies
CREATE POLICY "Deny anonymous access to profiles"
ON profiles FOR ALL
TO anon
USING (false);

CREATE POLICY "Deny anonymous access to user_roles"
ON user_roles FOR ALL
TO anon
USING (false);

-- Fix 2: Remove role column from profiles (it should only be in user_roles)
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Fix 3: Secure the get_user_role function to only allow checking own role or admin access
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow checking own role or if caller is admin
  SELECT role FROM user_roles 
  WHERE user_id = user_uuid 
  AND (
    user_uuid = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  LIMIT 1;
$$;

-- Fix 4: Create secure admin creation function
CREATE OR REPLACE FUNCTION public.create_first_admin(
  admin_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if any admin already exists
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE role = 'admin'
  ) INTO admin_exists;
  
  -- If admin exists, reject
  IF admin_exists THEN
    RAISE EXCEPTION 'Admin already exists';
  END IF;
  
  -- Verify the user exists and is the caller
  IF admin_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Can only create admin for own account';
  END IF;
  
  -- Update user_roles to admin
  UPDATE user_roles 
  SET role = 'admin' 
  WHERE user_id = admin_user_id;
  
  RETURN true;
END;
$$;