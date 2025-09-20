import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Map, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/stores/profileStore';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      !isOpen && 'justify-center px-2'
    );

  return (
    <aside className={cn("bg-card border-r flex flex-col p-4 transition-all duration-300", isOpen ? "w-64" : "w-20")}>
      <div className="mb-8 flex justify-center">
        <h1 className={cn("text-2xl font-bold font-heading text-primary text-center transition-opacity duration-300", !isOpen && "opacity-0 hidden")}>BonApp</h1>
        <h1 className={cn("text-2xl font-bold font-heading text-primary text-center transition-opacity duration-300", isOpen && "opacity-0 hidden")}>B</h1>
      </div>
      <nav className="flex-grow space-y-2">
        <NavLink to="/dashboard" end className={navLinkClasses}>
          <Home className="h-5 w-5" />
          <span className={cn("ml-3", !isOpen && "hidden")}>Meus Restaurantes</span>
        </NavLink>
        {(profile?.role === 'admin' || profile?.role === 'owner') && (
          <NavLink to="/add-restaurant" className={navLinkClasses}>
            <PlusCircle className="h-5 w-5" />
            <span className={cn("ml-3", !isOpen && "hidden")}>Adicionar</span>
          </NavLink>
        )}
        <NavLink to="/map" className={navLinkClasses}>
          <Map className="h-5 w-5" />
          <span className={cn("ml-3", !isOpen && "hidden")}>Mapa</span>
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/admin" className={navLinkClasses}>
            <Shield className="h-5 w-5" />
            <span className={cn("ml-3", !isOpen && "hidden")}>Admin</span>
          </NavLink>
        )}
      </nav>
      <div className="mt-auto">
        <Button variant="ghost" className={cn("w-full justify-start", !isOpen && "justify-center")} onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
          <span className={cn("ml-3", !isOpen && "hidden")}>Sair</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;