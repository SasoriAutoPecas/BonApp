import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { ImageUploader } from '@/components/ImageUploader';
import { useDebounce } from '@/hooks/useDebounce';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput } from '@/components/PhoneInput';
import { OperatingHoursInput } from '@/components/OperatingHoursInput';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  description: z.string().optional(),
  address: z.string().optional(),
  cuisine: z.string().optional(),
  image_url: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  phone_number: z.string().optional(),
  website: z.string().url({ message: "Por favor, insira uma URL válida." }).optional().or(z.literal('')),
  operating_hours: z.string().optional(),
  has_wheelchair_access: z.boolean().default(false).optional(),
  accessibility_details: z.string().optional(),
});

const cuisineTypes = ["Italiana", "Japonesa", "Brasileira", "Vegetariana", "Outra"];

type GeocodingStatus = 'idle' | 'loading' | 'success' | 'error';

const AddRestaurantPage = () => {
  const session = useAuthStore((state) => state.session);
  const { profile, loading: profileLoading } = useProfileStore();
  const navigate = useNavigate();
  const [geocodingStatus, setGeocodingStatus] = useState<GeocodingStatus>('idle');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      image_url: '',
      phone_number: '',
      website: '',
      operating_hours: '',
      has_wheelchair_access: false,
      accessibility_details: '',
    },
  });

  const addressValue = form.watch('address');
  const debouncedAddress = useDebounce(addressValue, 1000);

  useEffect(() => {
    if (!profileLoading && profile?.role === 'user') {
      showError("Você não tem permissão para acessar esta página.");
      navigate('/dashboard');
    }
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (debouncedAddress && debouncedAddress.length > 5) {
      const geocodeAddress = async () => {
        setGeocodingStatus('loading');
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedAddress)}&format=json&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            form.setValue('latitude', parseFloat(lat));
            form.setValue('longitude', parseFloat(lon));
            setGeocodingStatus('success');
          } else {
            setGeocodingStatus('error');
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setGeocodingStatus('error');
        }
      };
      geocodeAddress();
    } else {
      setGeocodingStatus('idle');
    }
  }, [debouncedAddress, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) {
      showError('Você precisa estar logado para adicionar um restaurante.');
      return;
    }

    const { error } = await supabase
      .from('restaurants')
      .insert([
        { 
          ...values,
          owner_id: session.user.id 
        },
      ]);

    if (error) {
      showError('Ocorreu um erro ao adicionar o restaurante: ' + error.message);
    } else {
      showSuccess('Restaurante adicionado com sucesso!');
      navigate('/dashboard');
    }
  };

  const renderGeocodingStatus = () => {
    switch (geocodingStatus) {
      case 'loading':
        return <span className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Buscando coordenadas...</span>;
      case 'success':
        return <span className="flex items-center text-sm text-green-600"><CheckCircle2 className="mr-2 h-4 w-4" /> Coordenadas encontradas!</span>;
      case 'error':
        return <span className="flex items-center text-sm text-red-600"><XCircle className="mr-2 h-4 w-4" /> Endereço não encontrado. Verifique.</span>;
      default:
        return <FormDescription>Digite o endereço para buscar as coordenadas automaticamente.</FormDescription>;
    }
  };

  if (profileLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (profile?.role === 'user') {
    return null;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Adicionar Novo Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Restaurante</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cantina da Nona" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Culinária</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de culinária" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cuisineTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o seu restaurante..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Av. Paulista, 900, São Paulo, SP" {...field} />
                    </FormControl>
                    {renderGeocodingStatus()}
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://seurestaurante.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operating_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário de Funcionamento</FormLabel>
                    <FormControl>
                      <OperatingHoursInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="has_wheelchair_access"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Possui acesso para cadeirantes?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessibility_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes de Acessibilidade</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Rampa de acesso na entrada, banheiro adaptado." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader 
                        onUploadSuccess={(url) => form.setValue('image_url', url)}
                        onUploadStart={() => form.formState.isSubmitting}
                        onUploadEnd={() => !form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                 <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || geocodingStatus === 'loading'}>
                  {form.formState.isSubmitting ? 'Adicionando...' : 'Adicionar Restaurante'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRestaurantPage;