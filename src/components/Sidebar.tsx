import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Map, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/stores/profileStore';
import { supabase } from '@/integrations/supabase/client';

const Sidebar = () => {
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <aside className="w-64 bg-card border-r flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-primary text-center">BonApp</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/dashboard" end className={navLinkClasses}>
          <Home className="mr-3 h-5 w-5" />
          Meus Restaurantes
        </NavLink>
        <NavLink to="/add-restaurant" className={navLinkClasses}>
          <PlusCircle className="mr-3 h-5 w-5" />
          Adicionar Restaurante
        </NavLink>
        <NavLink to="/map" className={navLinkClasses}>
          <Map className="mr-3 h-5 w-5" />
          Ver no Mapa
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/admin" className={navLinkClasses}>
            <Shield className="mr-3 h-5 w-5" />
            Painel Admin
          </NavLink>
        )}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;