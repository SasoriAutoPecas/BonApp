import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AuthPage = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center font-heading">BonApp</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          variables={{
            default: {
              colors: {
                brand: '#FF6B6B',
                brandAccent: '#E95050'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;