import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const HomeScreen = () => {
  const session = useAuthStore((state) => state.session);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, description, image_url');

      if (error) {
        console.error('Error fetching restaurants:', error);
      } else {
        setRestaurants(data || []);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">BonApp</h1>
        <div className="flex items-center gap-4">
          {session && <p className="text-sm text-gray-600">Logado como: {session.user.email}</p>}
          <Button onClick={handleSignOut} variant="outline">Sair</Button>
        </div>
      </header>

      <main>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Restaurantes</h2>
          <Button asChild>
            <Link to="/add-restaurant">Adicionar Restaurante</Link>
          </Button>
        </div>
        {loading ? (
          <p>Carregando restaurantes...</p>
        ) : restaurants.length === 0 ? (
          <div className="mt-8 p-8 border rounded-lg bg-gray-50 text-center">
            <p className="text-lg">Nenhum restaurante encontrado ainda. Que tal adicionar o primeiro?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {restaurant.image_url && (
                    <img 
                      src={restaurant.image_url} 
                      alt={restaurant.name} 
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <p className="text-gray-700">{restaurant.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;