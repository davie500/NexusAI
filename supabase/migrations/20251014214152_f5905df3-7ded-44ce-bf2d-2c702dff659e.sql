-- Instrução SQL para inserir manualmente o primeiro administrador
-- Após executar esta migração, você deve:
-- 1. Criar um usuário via interface (signup)
-- 2. Copiar o UUID do usuário da tabela auth.users
-- 3. Executar manualmente no SQL Editor:
--    UPDATE public.user_roles SET role = 'admin' WHERE user_id = 'SEU_UUID_AQUI';

-- Comentário: Este é um comentário de instrução, não requer alterações no banco

-- Garantir que a função handle_new_user sempre cria clientes por padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into profiles - sempre como cliente
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    'client'::user_role  -- Sempre cliente, independente do metadata
  );
  
  -- Insert into user_roles - sempre como cliente
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    'client'::user_role  -- Sempre cliente, independente do metadata
  );
  
  RETURN NEW;
END;
$function$;