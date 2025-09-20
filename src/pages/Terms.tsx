import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial</Link>
          </Button>
        </div>
        <div className="prose max-w-none">
          <h1 className="text-4xl font-heading">Termos de Uso e Privacidade</h1>
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <h2>1. Termos de Uso</h2>
          <p>Ao acessar e usar o BonApp, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.</p>

          <h2>2. Uso de Licença</h2>
          <p>A permissão é concedida para baixar temporariamente uma cópia dos materiais (informações ou software) no site BonApp, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título...</p>

          <h2>3. Política de Privacidade</h2>
          <p>A sua privacidade é importante para nós. É política do BonApp respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site BonApp, e outros sites que possuímos e operamos.</p>
          <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;