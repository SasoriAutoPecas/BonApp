import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
  return (
    <header className="flex items-center h-16 px-4 border-b bg-card">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        {isSidebarOpen ? <PanelLeftClose className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
        <span className="sr-only">Alternar menu</span>
      </Button>
    </header>
  );
};