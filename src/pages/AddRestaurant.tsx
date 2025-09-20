import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  description: z.string().optional(),
  address: z.string().optional(),
  image_url: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }).optional().or(z.literal('')),
});

const AddRestaurantPage = () => {
  const session = useAuthStore((state) => state.session);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      image_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session) {
      showError('Você precisa estar logado para adicionar um restaurante.');
      return;
    }

    const { error } = await supabase
      .from('restaurants')
      .insert([
        { 
          name: values.name,
          description: values.description,
          address: values.address,
          image_url: values.image_url,
          owner_id: session.user.id 
        },
      ]);

    if (error) {
      showError('Ocorreu um erro ao adicionar o restaurante: ' + error.message);
    } else {
      showSuccess('Restaurante adicionado com sucesso!');
      navigate('/');
    }
  };

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
                      <Input placeholder="Ex: Rua das Flores, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                 <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
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