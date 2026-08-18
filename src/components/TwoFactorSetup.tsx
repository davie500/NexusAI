import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2, Copy, CheckCircle2, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cleanupUnverifiedTotpFactors } from '@/lib/mfa';

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
  requireSetup?: boolean;
}

export const TwoFactorSetup = ({ onComplete, onSkip, requireSetup = false }: TwoFactorSetupProps) => {
  const enrollmentStartedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [step, setStep] = useState<'enroll' | 'verify' | 'complete' | 'error'>('enroll');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const resetEnrollmentState = () => {
    setQrCode('');
    setSecret('');
    setFactorId('');
    setVerificationCode('');
  };

  const startEnrollment = async () => {
    if (enrollmentStartedRef.current) {
      return;
    }

    enrollmentStartedRef.current = true;
    setLoading(true);
    setErrorMessage('');
    resetEnrollmentState();

    try {
      await cleanupUnverifiedTotpFactors();

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Autenticador App',
      });

      const nextQrCode = data?.totp?.qr_code;
      const nextSecret = data?.totp?.secret;
      const nextFactorId = data?.id;

      if (error || !nextQrCode || !nextSecret || !nextFactorId) {
        throw error || new Error('Nao foi possivel iniciar a configuracao do 2FA.');
      }

      setQrCode(nextQrCode);
      setSecret(nextSecret);
      setFactorId(nextFactorId);
      setStep('verify');
    } catch (error: any) {
      const message = error?.message || 'Falha ao iniciar 2FA';
      setErrorMessage(message);
      enrollmentStartedRef.current = false;
      setStep('error');
      toast({
        title: 'Erro',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
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
      const { data, error } = await supabase.auth.mfa.challenge({ factorId });
      if (error) throw error;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      const codes = Array.from({ length: 8 }, () => Math.random().toString(36).substring(2, 10).toUpperCase());
      setBackupCodes(codes);
      setStep('complete');

      toast({
        title: 'Sucesso!',
        description: '2FA ativado com sucesso',
      });
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

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copiado!',
      description: 'Codigos de backup copiados',
    });
  };

  const handleBack = () => {
    const cleanup = async () => {
      try {
        if (factorId) {
          await supabase.auth.mfa.unenroll({ factorId });
        } else {
          await cleanupUnverifiedTotpFactors();
        }
      } catch (error) {
        console.error('[2FA_SETUP] Failed to cleanup factor', error);
      } finally {
        enrollmentStartedRef.current = false;
        resetEnrollmentState();
        setErrorMessage('');
        setStep('enroll');
        onSkip?.();
      }
    };

    void cleanup();
  };

  useEffect(() => {
    if (step === 'enroll') {
      void startEnrollment();
    }
  }, [step]);

  if (step === 'verify') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Configure Autenticacao em Dois Fatores</CardTitle>
          </div>
          <CardDescription>Escaneie o QR code com seu aplicativo autenticador</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>Use Google Authenticator, Authy, ou outro app compativel com TOTP</AlertDescription>
          </Alert>

          <div className="flex flex-col items-center space-y-4">
            <img src={qrCode} alt="QR Code" className="w-full max-w-64 aspect-square border rounded-lg object-contain bg-white p-2" />

            <div className="w-full text-center space-y-2">
              <p className="text-sm text-muted-foreground">Nao consegue escanear? Digite manualmente:</p>
              <code className="block p-2 bg-muted rounded text-xs break-all">{secret}</code>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Codigo de Verificacao</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-xl sm:text-2xl tracking-[0.4em]"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            {!requireSetup && onSkip && (
              <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            <Button onClick={verifyAndEnable} disabled={loading || verificationCode.length !== 6} className="w-full sm:flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar e Ativar'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Erro ao iniciar o 2FA</CardTitle>
          </div>
          <CardDescription>O QR code so aparece quando a configuracao e iniciada com sucesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertDescription>{errorMessage || 'Nao foi possivel iniciar a configuracao do 2FA.'}</AlertDescription>
          </Alert>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            {!requireSetup && onSkip && (
              <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            <Button
              onClick={() => {
                enrollmentStartedRef.current = false;
                setStep('enroll');
              }}
              className="w-full sm:flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>2FA Ativado!</CardTitle>
          </div>
          <CardDescription>Guarde seus codigos de backup em local seguro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              <strong>IMPORTANTE:</strong> Salve estes codigos em local seguro. Voce pode usa-los se perder acesso ao seu autenticador.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Codigos de Backup</Label>
            <div className="bg-muted p-4 rounded-lg space-y-1 font-mono text-sm">
              {backupCodes.map((code, i) => (
                <div key={i}>{code}</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={copyBackupCodes} variant="outline" className="w-full sm:flex-1">
              {copied ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Codigos
                </>
              )}
            </Button>
            <Button onClick={onComplete} className="w-full sm:flex-1">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
