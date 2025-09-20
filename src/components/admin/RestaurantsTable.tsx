import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string | null;
  owner: {
    first_name: string | null;
    last_name: string | null;
  }[] | null;
}

export const RestaurantsTable = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, cuisine, owner:profiles!owner_id(first_name, last_name)');
    
    if (error) {
      showError('Erro ao buscar restaurantes.');
      console.error(error);
    } else {
      setRestaurants(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (restaurantId: string) => {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId);

    if (error) {
      showError('Erro ao excluir o restaurante.');
    } else {
      showSuccess('Restaurante excluído com sucesso.');
      fetchRestaurants();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Restaurantes</CardTitle>
        <CardDescription>Visualize e remova restaurantes do sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Restaurante</TableHead>
              <TableHead>Proprietário</TableHead>
              <TableHead>Culinária</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
            ) : (
              restaurants.map(restaurant => (
                <TableRow key={restaurant.id}>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>{(restaurant.owner && restaurant.owner.length > 0) ? `${restaurant.owner[0].first_name} ${restaurant.owner[0].last_name}` : 'Não identificado'}</TableCell>
                  <TableCell>{restaurant.cuisine || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o restaurante {restaurant.name}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(restaurant.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};