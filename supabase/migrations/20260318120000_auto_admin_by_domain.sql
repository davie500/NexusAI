DROP INDEX IF EXISTS public.idx_single_admin;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.user_role;
BEGIN
  assigned_role := CASE
    WHEN lower(coalesce(NEW.email, '')) LIKE '%@nexuscareer.com' THEN 'admin'::public.user_role
    ELSE 'client'::public.user_role
  END;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    assigned_role
  );

  RETURN NEW;
END;
$$;

UPDATE public.user_roles ur
SET role = 'admin'::public.user_role
FROM public.profiles p
WHERE p.user_id = ur.user_id
  AND lower(coalesce(p.email, '')) LIKE '%@nexuscareer.com';
