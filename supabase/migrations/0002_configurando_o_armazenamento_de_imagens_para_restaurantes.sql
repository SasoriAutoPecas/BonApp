-- Cria um bucket público para armazenar as imagens dos restaurantes.
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Define políticas de segurança para o bucket.
-- Permite que qualquer pessoa visualize as imagens (necessário para o site público).
CREATE POLICY "Public read access for restaurant images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'restaurant-images' );

-- Permite que usuários autenticados (logados) façam upload de novas imagens.
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'restaurant-images' );

-- Permite que os proprietários atualizem suas próprias imagens.
CREATE POLICY "Owners can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner );

-- Permite que os proprietários excluam suas próprias imagens.
CREATE POLICY "Owners can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );