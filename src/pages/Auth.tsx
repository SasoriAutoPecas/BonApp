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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const session = useAuthStore((state) => state.session);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError('E-mail ou senha inválidos.');
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      showError('Por favor, insira seu e-mail.');
      return;
    }
    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsResetting(false);
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Link para redefinição de senha enviado! Verifique seu e-mail.');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-bold font-heading text-primary">BonApp</h1>
          <CardTitle className="text-2xl pt-4">Bem-vindo de volta!</CardTitle>
          <CardDescription>Faça login para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right text-sm -mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal">
                      Esqueceu a senha?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Redefinir Senha</DialogTitle>
                      <DialogDescription>
                        Digite seu e-mail abaixo para receber um link de redefinição de senha.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email-reset" className="text-right">
                          E-mail
                        </Label>
                        <Input
                          id="email-reset"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="col-span-3"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button onClick={handlePasswordReset} disabled={isResetting}>
                        {isResetting ? 'Enviando...' : 'Enviar Link'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/sign-up" className="underline hover:text-primary">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;