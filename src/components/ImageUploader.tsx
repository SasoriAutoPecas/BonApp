import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface ImageUploaderProps {
  initialImageUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

export const ImageUploader = ({ 
  initialImageUrl, 
  onUploadSuccess,
  onUploadStart,
  onUploadEnd
}: ImageUploaderProps) => {
  const session = useAuthStore((state) => state.session);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session) return;

    setUploading(true);
    onUploadStart?.();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    setPreviewUrl(URL.createObjectURL(file));

    const { error } = await supabase.storage
      .from('restaurant-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
    } else {
      const { data } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(filePath);
      
      if (data.publicUrl) {
        onUploadSuccess(data.publicUrl);
      }
    }
    
    setUploading(false);
    onUploadEnd?.();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUploadSuccess(''); 
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Restaurante</label>
      <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center relative">
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover rounded-lg" />
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full h-8 w-8"
              onClick={removeImage}
              disabled={uploading}
            >
              <X size={16} />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {uploading ? 'Enviando...' : 'Arraste ou clique para enviar'}
            </p>
            <Input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
             <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">
                  {uploading ? <Loader2 className="animate-spin" /> : 'Escolha um arquivo'}
                </span>
            </label>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};