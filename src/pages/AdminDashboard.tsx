import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/stores/profileStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from '@/components/admin/UsersTable';
import { RestaurantsTable } from '@/components/admin/RestaurantsTable';
import { showError } from '@/utils/toast';

const AdminDashboard = () => {
  const { profile, loading } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile?.role !== 'admin') {
      showError("Acesso negado.");
      navigate('/dashboard');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Verificando acesso...</div>;
  }

  if (profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <p className="text-muted-foreground">Gerencie usuários e restaurantes da plataforma.</p>
      </header>
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
          <TabsTrigger value="restaurants">Gerenciar Restaurantes</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UsersTable />
        </TabsContent>
        <TabsContent value="restaurants" className="mt-4">
           <RestaurantsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;