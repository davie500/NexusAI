-- Deletar a conta admin anterior
DELETE FROM public.profiles WHERE email = 'admin@gmail.com';
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@gmail.com'
);