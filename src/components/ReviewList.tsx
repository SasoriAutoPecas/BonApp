import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ReviewListProps {
  restaurantId: string;
  refreshKey: number;
}

export const ReviewList = ({ restaurantId, refreshKey }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(first_name, last_name)')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        setReviews(data as any[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [restaurantId, refreshKey]);

  if (loading) {
    return <p>Carregando avaliações...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-muted-foreground">Este restaurante ainda não possui avaliações.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <Card key={review.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {review.profiles?.first_name?.[0] || 'U'}
                  {review.profiles?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {review.profiles?.first_name || 'Usuário'} {review.profiles?.last_name || ''}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} readOnly />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{review.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};