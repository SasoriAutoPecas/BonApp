import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MapComponent from '@/components/MapComponent';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const MapPage = () => {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching restaurants for map:', error);
      } else {
        setAllRestaurants(data as Restaurant[]);
        setFilteredRestaurants(data as Restaurant[]);
      }
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = allRestaurants.filter(r =>
        r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(allRestaurants);
    }
  }, [debouncedSearchTerm, allRestaurants]);

  return (
    <div className="h-screen w-screen flex flex-col">
       <header className="p-4 bg-card border-b z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link to="/"><ArrowLeft size={16} /></Link>
          </Button>
          <h1 className="text-xl font-bold font-heading">Mapa de Restaurantes</h1>
        </div>
        <div className="w-full max-w-xs">
          <Input
            placeholder="Buscar restaurante no mapa..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <main className="flex-grow relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Carregando mapa...</p>
          </div>
        ) : (
          <MapComponent restaurants={filteredRestaurants} />
        )}
      </main>
    </div>
  );
};

export default MapPage;