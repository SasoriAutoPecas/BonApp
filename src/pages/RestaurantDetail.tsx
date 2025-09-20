import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
}

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching restaurant details:', error);
      } else {
        setRestaurant(data);
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Restaurante não encontrado</h2>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">{restaurant.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              {restaurant.image_url ? (
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Sem imagem disponível</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Sobre o restaurante</h3>
              <p className="text-muted-foreground">{restaurant.description || 'Nenhuma descrição fornecida.'}</p>
              <h3 className="text-xl font-semibold">Endereço</h3>
              <p className="text-muted-foreground">{restaurant.address || 'Endereço não informado.'}</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;