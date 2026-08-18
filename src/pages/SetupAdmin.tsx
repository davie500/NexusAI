import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { ADMIN_EMAIL_DOMAIN, isAdminEmail } from '@/lib/admin';

const setupAdminSchema = z.object({
  fullName: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function SetupAdmin() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkForAdmin();
  }, []);

  const checkForAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setHasAdmin(true);
      }
    } catch (error) {
      console.error('[SETUP_ADMIN] Failed to check existing admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const validation = setupAdminSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: 'Erro de validação',
        description: validation.error.issues[0].message,
        variant: 'destructive'
      });
      return;
    }

    // Enforce corporate email domain
    if (!isAdminEmail(formData.email)) {
      toast({
        title: 'Erro',
        description: `O e-mail do administrador deve ser ${ADMIN_EMAIL_DOMAIN}`,
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      // Criar usuário
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Falha ao criar conta');

      // Wait for the database trigger to create profile and user_roles entries
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Criar admin de forma segura via função RPC
      const { error: adminError } = await supabase.rpc('create_first_admin', {
        admin_user_id: authData.user.id
      });

      if (adminError) {
        console.error('[SETUP_ADMIN] RPC error');
        // If admin already exists, redirect to login
        if (adminError.message.includes('Admin already exists')) {
          toast({
            variant: "destructive",
            title: "Admin já existe",
            description: "Já existe um administrador no sistema. Faça login."
          });
          // Sign out the newly created user
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }
        throw adminError;
      }

      // Registrar auditoria (non-critical)
      try {
        await supabase.from('admin_audit_logs').insert({
          actor_id: authData.user.id,
          action: 'create_admin',
          target_user_id: authData.user.id,
          details: {
            email: formData.email,
            full_name: formData.fullName
          }
        });
      } catch (auditError) {
        console.error('[SETUP_ADMIN] Audit log failed');
      }

      toast({
        title: 'Sucesso!',
        description: 'Conta de administrador criada com sucesso'
      });

      // Fazer login automaticamente
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message === 'Admin already exists'
          ? 'Já existe um administrador cadastrado'
          : 'Não foi possível criar a conta de administrador',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrador já configurado
            </CardTitle>
            <CardDescription>
              Já existe um administrador cadastrado no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurar Administrador
          </CardTitle>
          <CardDescription>
            Crie a primeira conta de administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Conta de Administrador'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
