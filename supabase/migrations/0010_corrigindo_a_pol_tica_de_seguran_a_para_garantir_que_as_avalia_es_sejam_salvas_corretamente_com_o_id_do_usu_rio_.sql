-- Remove a política de inserção de avaliação antiga e incorreta para evitar conflitos
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;

-- Recria a política com a verificação de segurança correta
CREATE POLICY "Users can insert their own reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);