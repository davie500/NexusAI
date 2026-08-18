-- Remove a conta de admin criada anteriormente
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@nexuscareer.com'
);

DELETE FROM public.profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'admin@nexuscareer.com'
);

-- Nota: A remoção do auth.users deve ser feita manualmente no painel do Supabase
-- pois não temos permissão para deletar diretamente dessa tabela via SQL