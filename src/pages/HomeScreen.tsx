import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
          {session && <p className="text-sm text-muted-foreground">Logado como: {session.user.email}</p>}
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
          <div className="mt-8 p-8 border rounded-lg bg-card text-center">
            <p className="text-lg">Nenhum restaurante encontrado ainda. Que tal adicionar o primeiro?</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {restaurants.map((restaurant) => (
              <motion.div key={restaurant.id} variants={itemVariants}>
                <Card>
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
                    <p className="text-muted-foreground">{restaurant.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;