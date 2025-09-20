import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  { 
    name: 'Kauê Vinicius Soares da Silva', 
    rm: 'RM 230435', 
    initials: 'KS',
    avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Kaue&skinColor=Light&topType=ShortHairShortWaved&hairColor=BrownDark'
  },
  { 
    name: 'Higor Soares de Oliveira', 
    rm: 'RM 230006', 
    initials: 'HO',
    avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Higor&skinColor=DarkBrown&topType=ShortHairTheCaesar&hairColor=Black'
  },
  { 
    name: 'Diogo Henrique Siqueira da Costa', 
    rm: 'RM 230010', 
    initials: 'DC',
    avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Diogo&skinColor=Pale&topType=LongHairBob&hairColor=Blonde'
  },
  { 
    name: 'Mateus Ferrante Ribeiro', 
    rm: 'RM 230368', 
    initials: 'MR',
    avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Mateus&skinColor=Brown&topType=LongHairAfro&hairColor=Black'
  },
  { 
    name: 'Lucas Pontes Santos', 
    rm: 'RM 203158', 
    initials: 'LS',
    avatarUrl: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Lucas&skinColor=Light&topType=ShortHairFrizzle&hairColor=Black'
  },
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map(member => (
            <Card key={member.name} className="text-center">
              <CardHeader>
                <Avatar className="mx-auto h-24 w-24 mb-4">
                  <AvatarImage src={member.avatarUrl} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <CardTitle>{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-semibold">{member.rm}</p>
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