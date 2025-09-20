import { Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-sm text-center md:text-left">&copy; {new Date().getFullYear()} BonApp. Todos os direitos reservados.</p>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link>
          <Link to="/sobre-nos" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link>
          <Link to="/culinarias" className="text-muted-foreground hover:text-primary transition-colors">Culinárias</Link>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
          <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
          <a href="#" aria-label="Github" className="text-muted-foreground hover:text-primary transition-colors"><Github size={20} /></a>
        </div>
      </div>
    </footer>
  );
};