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

interface ReviewFormProps {
  restaurantId: string;
  onReviewAdded: () => void;
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

    const { error } = await supabase.from('reviews').insert({
      restaurant_id: restaurantId,
      user_id: session.user.id,
      rating: values.rating,
      comment: values.comment,
    });

    if (error) {
      showError('Erro ao enviar avaliação: ' + error.message);
    } else {
      showSuccess('Avaliação enviada com sucesso!');
      form.reset();
      onReviewAdded();
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