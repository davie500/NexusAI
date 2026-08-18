-- Limpar qualquer admin anterior com o email admin@nexuscareer.com
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT user_id FROM public.profiles WHERE email = 'admin@nexuscareer.com'
);

DELETE FROM public.profiles WHERE email = 'admin@nexuscareer.com';

DELETE FROM auth.users WHERE email = 'admin@nexuscareer.com';

-- Criar usuário admin diretamente no banco
-- Email: admin@nexuscareer.com
-- Senha: Admin@2025!

-- Inserir usuário na tabela auth.users (o trigger criará o profile e user_roles automaticamente)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@nexuscareer.com',
  crypt('Admin@2025!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Administrador do Sistema"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Atualizar o perfil para role admin
UPDATE public.profiles 
SET role = 'admin'::user_role
WHERE email = 'admin@nexuscareer.com';

-- Atualizar o user_roles para role admin
UPDATE public.user_roles 
SET role = 'admin'::user_role
WHERE user_id IN (SELECT user_id FROM public.profiles WHERE email = 'admin@nexuscareer.com');

-- Criar políticas RLS para admins

-- Admins podem ver todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::user_role
  )
);

-- Admins podem deletar perfis
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::user_role
  )
);

-- Admins podem ver todas as roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'::user_role
  )
);

-- Admins podem deletar roles
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'::user_role
  )
);

-- Admins podem atualizar perfis
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles" ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::user_role
  )
);