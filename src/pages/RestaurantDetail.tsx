import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Phone, Globe, Accessibility } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  phone_number: string | null;
  website: string | null;
  operating_hours: string | null;
  has_wheelchair_access: boolean | null;
  accessibility_details: string | null;
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
            <CardTitle className="text-4xl font-heading">{restaurant.name}</CardTitle>
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
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold font-heading">Sobre o restaurante</h3>
                <p className="text-muted-foreground mt-2">{restaurant.description || 'Nenhuma descrição fornecida.'}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-xl font-semibold font-heading mb-4">Informações</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground">Horários:</span>
                      <p className="whitespace-pre-line">{restaurant.operating_hours || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="mr-3 text-primary" />
                    <span className="font-semibold text-foreground">Telefone:</span>
                    <span className="ml-2">{restaurant.phone_number || 'Não informado'}</span>
                  </div>
                   <div className="flex items-center">
                    <Globe size={20} className="mr-3 text-primary" />
                    <span className="font-semibold text-foreground">Website:</span>
                    {restaurant.website ? (
                      <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                        Visitar site
                      </a>
                    ) : (
                      <span className="ml-2">Não informado</span>
                    )}
                  </div>
                  <div className="flex items-start">
                    <Accessibility size={20} className="mr-3 mt-1 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground">Acessibilidade:</span>
                      <p>{restaurant.has_wheelchair_access ? 'Acessível para cadeirantes' : 'Informação não disponível'}</p>
                      {restaurant.has_wheelchair_access && restaurant.accessibility_details && (
                        <p className="text-sm">{restaurant.accessibility_details}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
               <Separator />
               <div>
                <h3 className="text-xl font-semibold font-heading">Endereço</h3>
                <p className="text-muted-foreground mt-2">{restaurant.address || 'Endereço não informado.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantDetailPage;