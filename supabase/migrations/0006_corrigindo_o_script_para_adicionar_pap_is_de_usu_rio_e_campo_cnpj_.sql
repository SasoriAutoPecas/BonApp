-- 1. Criar um tipo personalizado (enum) para os papéis de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'owner', 'user');

-- 2. Adicionar as novas colunas à tabela de perfis
ALTER TABLE public.profiles
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user',
ADD COLUMN cnpj TEXT;

-- Adicionar uma restrição para garantir que o CNPJ seja único, se preenchido
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_cnpj_key UNIQUE (cnpj);

-- 3. Primeiro, remover o gatilho existente para poder atualizar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Agora, atualizar a função que cria o perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role, cnpj)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    new.raw_user_meta_data ->> 'cnpj'
  );
  RETURN new;
END;
$$;

-- 5. Recriar o gatilho para usar a nova função
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();