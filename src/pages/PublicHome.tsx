import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

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

const PublicHomePage = () => {
  const session = useAuthStore((state) => state.session);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const RESTAURANTS_PER_PAGE = 6;

  const fetchRestaurants = useCallback(async (pageNum: number) => {
    if (!hasMore || loading) return;
    setLoading(true);
    const from = pageNum * RESTAURANTS_PER_PAGE;
    const to = from + RESTAURANTS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, description, image_url')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching restaurants:', error);
      setHasMore(false);
    } else {
      setRestaurants(prev => [...prev, ...data]);
      setHasMore(data.length === RESTAURANTS_PER_PAGE);
    }
    setLoading(false);
  }, [hasMore, loading]);

  useEffect(() => {
    // Fetch initial data
    fetchRestaurants(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lastRestaurantElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
        fetchRestaurants(page + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, fetchRestaurants]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading text-primary">BonApp</h1>
        {session ? (
          <Button asChild>
            <Link to="/dashboard">Meu Painel</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Entrar</Link>
          </Button>
        )}
      </header>
      <main className="flex-grow container mx-auto p-4">
        <div className="text-center my-8 md:my-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading">Descubra Sabores Incríveis</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Explore os melhores restaurantes da cidade, veja cardápios e faça sua reserva. Tudo em um só lugar.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              variants={itemVariants}
              ref={index === restaurants.length - 1 ? lastRestaurantElementRef : null}
            >
              <Link to={`/restaurant/${restaurant.id}`}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{restaurant.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {restaurant.image_url ? (
                      <img
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    ) : (
                       <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Sem imagem</p>
                       </div>
                    )}
                    <p className="text-muted-foreground line-clamp-3">{restaurant.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {loading && <p className="text-center mt-8">Carregando mais restaurantes...</p>}
        {!hasMore && restaurants.length > 0 && <p className="text-center mt-8 text-muted-foreground">Você chegou ao fim!</p>}
         {restaurants.length === 0 && !loading && (
            <div className="mt-8 p-8 border rounded-lg bg-card text-center">
                <p className="text-lg">Nenhum restaurante encontrado ainda.</p>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PublicHomePage;