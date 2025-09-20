-- Criar a tabela de avaliações (reviews)
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar a segurança em nível de linha (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para a tabela de avaliações

-- 1. Permitir que todos leiam as avaliações
CREATE POLICY "Public read access for reviews" ON public.reviews
FOR SELECT USING (true);

-- 2. Permitir que usuários autenticados insiram suas próprias avaliações
CREATE POLICY "Users can insert their own reviews" ON public.reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Permitir que usuários atualizem suas próprias avaliações
CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Permitir que usuários excluam suas próprias avaliações
CREATE POLICY "Users can delete their own reviews" ON public.reviews
FOR DELETE TO authenticated USING (auth.uid() = user_id);