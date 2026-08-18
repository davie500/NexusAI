import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TwoFactorPromptProps {
  onSetup: () => void;
  onDismiss: () => void;
}

export const TwoFactorPrompt = ({ onSetup, onDismiss }: TwoFactorPromptProps) => {
  return (
    <Card className="border-amber-500/50 bg-amber-500/5 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-900 dark:text-amber-100">
              Proteja sua Conta de Administrador
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-amber-800 dark:text-amber-200">
          Como administrador, recomendamos fortemente ativar a autenticação em dois fatores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-500/30">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            Contas de administrador têm acesso a dados sensíveis. A 2FA adiciona uma camada 
            crucial de proteção contra acessos não autorizados.
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button 
            onClick={onSetup}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            Ativar 2FA Agora
          </Button>
          <Button variant="outline" onClick={onDismiss}>
            Depois
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
