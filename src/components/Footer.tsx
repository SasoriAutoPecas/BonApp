import { Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} BonApp. Todos os direitos reservados.</p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
          <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
          <a href="#" aria-label="Github" className="text-muted-foreground hover:text-primary transition-colors"><Github size={20} /></a>
        </div>
      </div>
    </footer>
  );
};