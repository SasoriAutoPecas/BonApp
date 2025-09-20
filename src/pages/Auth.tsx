import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AuthPage = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center font-heading">BonApp</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF6B6B',
                  brandAccent: '#E95050'
                }
              }
            }
          }}
          providers={[]}
          theme="light"
          view="sign_in"
        />
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/sign-up" className="underline hover:text-primary">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;