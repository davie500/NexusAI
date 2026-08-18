import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'nexus-cookie-consent';
const COOKIE_PREFERENCES_KEY = 'nexus-cookie-preferences';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useLanguage();
  
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const translations = {
    pt: {
      title: 'Nós usamos cookies',
      description: 'Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo.',
      acceptAll: 'Aceitar Todos',
      rejectAll: 'Rejeitar Todos',
      customize: 'Personalizar',
      save: 'Salvar Preferências',
      settingsTitle: 'Configurações de Cookies',
      settingsDescription: 'Escolha quais cookies você deseja permitir',
      necessary: 'Necessários',
      necessaryDesc: 'Essenciais para o funcionamento do site',
      analytics: 'Análise',
      analyticsDesc: 'Ajudam a entender como você usa o site',
      marketing: 'Marketing',
      marketingDesc: 'Usados para exibir anúncios relevantes',
      preferencesLabel: 'Preferências',
      preferencesDesc: 'Lembram suas configurações e preferências',
    },
    en: {
      title: 'We use cookies',
      description: 'We use cookies to improve your experience, analyze site traffic, and personalize content.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      customize: 'Customize',
      save: 'Save Preferences',
      settingsTitle: 'Cookie Settings',
      settingsDescription: 'Choose which cookies you want to allow',
      necessary: 'Necessary',
      necessaryDesc: 'Essential for the site to function',
      analytics: 'Analytics',
      analyticsDesc: 'Help understand how you use the site',
      marketing: 'Marketing',
      marketingDesc: 'Used to display relevant ads',
      preferencesLabel: 'Preferences',
      preferencesDesc: 'Remember your settings and preferences',
    },
    es: {
      title: 'Usamos cookies',
      description: 'Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido.',
      acceptAll: 'Aceptar Todos',
      rejectAll: 'Rechazar Todos',
      customize: 'Personalizar',
      save: 'Guardar Preferencias',
      settingsTitle: 'Configuración de Cookies',
      settingsDescription: 'Elija qué cookies desea permitir',
      necessary: 'Necesarias',
      necessaryDesc: 'Esenciales para el funcionamiento del sitio',
      analytics: 'Análisis',
      analyticsDesc: 'Ayudan a entender cómo usa el sitio',
      marketing: 'Marketing',
      marketingDesc: 'Utilizadas para mostrar anuncios relevantes',
      preferencesLabel: 'Preferencias',
      preferencesDesc: 'Recuerdan sus configuraciones y preferencias',
    },
    fr: {
      title: 'Nous utilisons des cookies',
      description: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu.',
      acceptAll: 'Accepter Tout',
      rejectAll: 'Rejeter Tout',
      customize: 'Personnaliser',
      save: 'Enregistrer les Préférences',
      settingsTitle: 'Paramètres des Cookies',
      settingsDescription: 'Choisissez les cookies que vous souhaitez autoriser',
      necessary: 'Nécessaires',
      necessaryDesc: 'Essentiels au fonctionnement du site',
      analytics: 'Analytiques',
      analyticsDesc: 'Aident à comprendre comment vous utilisez le site',
      marketing: 'Marketing',
      marketingDesc: 'Utilisés pour afficher des publicités pertinentes',
      preferencesLabel: 'Préférences',
      preferencesDesc: 'Mémorisent vos paramètres et préférences',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.pt;

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (!consent) {
      setShowBanner(true);
    } else if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
        <Card className="mx-auto max-w-4xl p-6 shadow-2xl bg-card/95 backdrop-blur-sm border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2 text-foreground">{t.title}</h3>
              <p className="text-sm text-foreground/80 font-medium">
                {t.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1 md:flex-initial hover:bg-destructive hover:text-destructive-foreground"
              >
                {t.rejectAll}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="flex-1 md:flex-initial"
              >
                <Settings className="mr-2 h-4 w-4" />
                {t.customize}
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-initial bg-nexus-purple hover:bg-nexus-purple-dark text-white font-semibold"
              >
                {t.acceptAll}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.settingsTitle}</DialogTitle>
            <DialogDescription>{t.settingsDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <Label className="font-medium">{t.necessary}</Label>
                <p className="text-sm text-muted-foreground">{t.necessaryDesc}</p>
              </div>
              <Switch
                checked={preferences.necessary}
                disabled
                className="opacity-50"
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <Label className="font-medium">{t.analytics}</Label>
                <p className="text-sm text-muted-foreground">{t.analyticsDesc}</p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <Label className="font-medium">{t.marketing}</Label>
                <p className="text-sm text-muted-foreground">{t.marketingDesc}</p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <Label className="font-medium">{t.preferencesLabel}</Label>
                <p className="text-sm text-muted-foreground">{t.preferencesDesc}</p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, preferences: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePreferences} className="bg-nexus-purple hover:bg-nexus-purple-dark text-white font-semibold">
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
