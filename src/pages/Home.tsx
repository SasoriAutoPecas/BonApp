import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';

const HomePage = () => {
  const session = useAuthStore((state) => state.session);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Bem-vindo ao BonApp</h1>
        <Button onClick={handleSignOut} variant="outline">Sair</Button>
      </div>
      {session && <p>Você está logado como: {session.user.email}</p>}
      <div className="mt-8 p-8 border rounded-lg bg-gray-50 text-center">
        <p className="text-lg">Em breve, você verá os restaurantes aqui!</p>
      </div>
    </div>
  );
};

export default HomePage;