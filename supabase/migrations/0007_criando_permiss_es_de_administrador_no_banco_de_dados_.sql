-- 1. Criar uma função auxiliar para verificar se o usuário atual é um administrador.
-- Isso torna as políticas de segurança mais limpas e fáceis de gerenciar.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Criar políticas de segurança para a tabela 'profiles'.
-- Esta política permite que administradores realizem qualquer ação (ver, criar, editar, excluir) em qualquer perfil.
CREATE POLICY "Admins podem gerenciar todos os perfis"
ON public.profiles
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Criar políticas de segurança para a tabela 'restaurants'.
-- Esta política permite que administradores gerenciem todos os restaurantes.
CREATE POLICY "Admins podem gerenciar todos os restaurantes"
ON public.restaurants
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());