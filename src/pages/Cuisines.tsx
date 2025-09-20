import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const cuisines = [
  { name: 'Italiana', description: 'Massas frescas, pizzas autênticas e sabores que transportam para a Itália. Uma culinária rica em história e tradição.' },
  { name: 'Japonesa', description: 'Sushis, sashimis e pratos quentes que equilibram precisão, frescor e arte. Uma experiência delicada e saborosa.' },
  { name: 'Brasileira', description: 'Uma diversidade de sabores regionais, da feijoada ao acarajé. A culinária brasileira é uma festa de cores e temperos.' },
  { name: 'Vegetariana', description: 'Pratos criativos e saborosos que celebram o melhor dos vegetais, grãos e legumes. Saudável, sustentável e delicioso.' },
];

const CuisinesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial</Link>
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-heading">Explore as Culinárias</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra um pouco mais sobre os tipos de cozinha que você pode encontrar em nossa plataforma.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {cuisines.map(cuisine => (
            <Card key={cuisine.name}>
              <CardHeader>
                <CardTitle>{cuisine.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{cuisine.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CuisinesPage;