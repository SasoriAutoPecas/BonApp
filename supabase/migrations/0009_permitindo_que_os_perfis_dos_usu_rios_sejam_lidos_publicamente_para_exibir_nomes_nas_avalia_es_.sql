-- Adicionar uma política para permitir que todos leiam os perfis (apenas leitura)
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);