import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MapComponent from '@/components/MapComponent';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from '@/hooks/useDebounce';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { showError } from '@/utils/toast';

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cuisine: string | null;
}

const MapPage = () => {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          showError('Não foi possível obter sua localização.');
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, latitude, longitude, cuisine')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching restaurants for map:', error);
      } else {
        setAllRestaurants(data as Restaurant[]);
      }
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  const availableCuisines = useMemo(() => {
    const cuisines = new Set(allRestaurants.map(r => r.cuisine).filter(Boolean));
    return ['all', ...Array.from(cuisines)] as string[];
  }, [allRestaurants]);

  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCuisine = selectedCuisine === 'all' || r.cuisine === selectedCuisine;
      return matchesSearch && matchesCuisine;
    });
  }, [allRestaurants, debouncedSearchTerm, selectedCuisine]);

  return (
    <div className="h-screen w-screen flex flex-col">
       <header className="relative p-4 bg-card border-b z-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link to="/"><ArrowLeft size={16} /></Link>
          </Button>
          <h1 className="text-xl font-bold font-heading">Mapa de Restaurantes</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-48">
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por culinária..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Culinárias</SelectItem>
                {availableCuisines.filter(c => c !== 'all').map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Buscar restaurante..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Carregando mapa...</p>
          </div>
        ) : (
          <MapComponent restaurants={filteredRestaurants} userPosition={userPosition} />
        )}
      </main>
    </div>
  );
};

export default MapPage;