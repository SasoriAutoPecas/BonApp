import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  { name: 'Ana Silva', role: 'Desenvolvedora Full-Stack', initials: 'AS' },
  { name: 'Bruno Costa', role: 'Designer UX/UI', initials: 'BC' },
  { name: 'Carla Dias', role: 'Gerente de Produto', initials: 'CD' },
];

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial</Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-heading">Nossa Equipe</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos apaixonados por tecnologia e gastronomia, unidos para criar a melhor experiência para você encontrar seu próximo restaurante favorito.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map(member => (
            <Card key={member.name} className="text-center">
              <CardHeader>
                <Avatar className="mx-auto h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${member.name}`} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <CardTitle>{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;