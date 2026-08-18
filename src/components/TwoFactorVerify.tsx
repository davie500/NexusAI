import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getVerifiedTotpFactors } from '@/lib/mfa';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorVerify = ({ onSuccess, onCancel }: TwoFactorVerifyProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Erro',
        description: 'Digite o codigo de 6 digitos',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const verifiedFactors = await getVerifiedTotpFactors();
      const totpFactor = verifiedFactors[0];

      if (!totpFactor) {
        throw new Error('2FA nao configurado');
      }

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      toast({
        title: 'Sucesso!',
        description: 'Codigo verificado',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Codigo invalido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Verificacao em Dois Fatores</CardTitle>
        </div>
        <CardDescription>Digite o codigo do seu aplicativo autenticador</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>Abra seu app autenticador e digite o codigo de 6 digitos</AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="verify-code">Codigo de Verificacao</Label>
          <Input
            id="verify-code"
            type="text"
            placeholder="000000"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="text-center text-2xl tracking-widest"
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              'Verificar'
            )}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
