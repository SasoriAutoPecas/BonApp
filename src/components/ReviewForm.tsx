import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { showSuccess, showError } from '@/utils/toast';
import { StarRating } from './StarRating';

const reviewSchema = z.object({
  rating: z.number().min(1, { message: 'A avaliação é obrigatória.' }).max(5),
  comment: z.string().min(10, { message: 'O comentário deve ter pelo menos 10 caracteres.' }),
});

// Definindo o tipo da avaliação para garantir consistência
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ReviewFormProps {
  restaurantId: string;
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewForm = ({ restaurantId, onReviewAdded }: ReviewFormProps) => {
  const session = useAuthStore((state) => state.session);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!session) {
      showError('Você precisa estar logado para deixar uma avaliação.');
      return;
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        restaurant_id: restaurantId,
        user_id: session.user.id,
        rating: values.rating,
        comment: values.comment,
      })
      .select('*, profile:profiles(first_name, last_name)')
      .single();

    if (error) {
      showError('Erro ao enviar avaliação: ' + error.message);
    } else if (data) {
      showSuccess('Avaliação enviada com sucesso!');
      form.reset();
      onReviewAdded(data as any);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sua Avaliação</FormLabel>
              <FormControl>
                <StarRating rating={field.value} setRating={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Comentário</FormLabel>
              <FormControl>
                <Textarea placeholder="Conte como foi sua experiência..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
        </Button>
      </form>
    </Form>
  );
};