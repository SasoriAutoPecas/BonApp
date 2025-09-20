import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [hasPasswordRecoveryToken, setHasPasswordRecoveryToken] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasPasswordRecoveryToken(true);
      }
    });

    if (window.location.hash.includes('type=recovery')) {
        setHasPasswordRecoveryToken(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!hasPasswordRecoveryToken) {
        showError("Token de recuperação inválido ou expirado.");
        navigate('/auth');
        return;
    }

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Senha atualizada com sucesso! Você já pode fazer login.');
      await supabase.auth.signOut();
      navigate('/auth');
    }
  };

  if (!hasPasswordRecoveryToken) {
      return (
          <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
              <Card className="w-full max-w-md text-center">
                  <CardHeader>
                      <CardTitle>Link Inválido ou Expirado</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p>O link de recuperação de senha pode ser inválido ou já ter sido usado. Por favor, solicite um novo.</p>
                      <Button onClick={() => navigate('/auth')} className="mt-4">Voltar para o Login</Button>
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Crie uma Nova Senha</CardTitle>
          <CardDescription>Digite sua nova senha abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a Nova Senha</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;