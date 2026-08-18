import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { Brain } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const Auth = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
      setIsPasswordReset(true);
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const modeParam = searchParams.get('mode');

    if (modeParam === 'reset') {
      setAuthMode('reset');
      return;
    }

    const state = location.state as { mode?: 'login' | 'signup' };
    if (state?.mode) {
      setAuthMode(state.mode);
    }
  }, [location.state, location.search]);

  if (user && !isPasswordReset) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NexusAI
            </span>
          </div>
          <p className="text-muted-foreground">{t('hero.description')}</p>
        </div>

        {isPasswordReset ? (
          <PasswordResetForm />
        ) : (
          <AuthModal open={true} onOpenChange={() => navigate('/')} mode={authMode} />
        )}
      </div>
    </div>
  );
};

export default Auth;
