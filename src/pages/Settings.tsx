import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Brain, ArrowLeft, User, Bell, Shield, Palette, Save, Mail, Lock, ShieldCheck, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import ProfileCompletion from '@/components/ProfileCompletion';
import LanguageSelector from '@/components/LanguageSelector';
import { AccentColor, FontSizeOption, useAppearance } from '@/contexts/AppearanceContext';
import { colourOptions } from '@/lib/colors';

const fontOptions: FontSizeOption[] = ['small', 'medium', 'large'];

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const { accentColor, fontSize, setAccentColor, setFontSize } = useAppearance();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(true);
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [selectedAccentColor, setSelectedAccentColor] = useState<AccentColor>(accentColor);
  const [selectedFontSize, setSelectedFontSize] = useState<FontSizeOption>(fontSize);

  const [profile, setProfile] = useState({
    fullName: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    courseUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
  });

  const copy = useMemo(() => {
    const translations = {
      pt: {
        back: 'Voltar',
        profileTitle: 'Informacoes do Perfil',
        profileDesc: 'Atualize suas informacoes pessoais e profissionais',
        fullNamePlaceholder: 'Seu nome completo',
        phonePlaceholder: '(00) 00000-0000',
        password: 'Senha',
        changePassword: 'Alterar Senha',
        saveChanges: 'Salvar Alteracoes',
        securityTitle: 'Seguranca da Conta',
        securityDesc: 'Gerencie suas configuracoes de seguranca e autenticacao',
        twoFactorAlert: 'A autenticacao em dois fatores adiciona uma camada extra de seguranca a sua conta.',
        twoFactorLabel: 'Autenticacao em Dois Fatores',
        twoFactorEnabled: 'Protegendo sua conta com codigo TOTP',
        twoFactorDisabled: 'Adicione uma camada extra de seguranca',
        enabled: 'Ativado',
        disable: 'Desativar',
        enable2FA: 'Ativar 2FA',
        notificationTitle: 'Preferencias de Notificacao',
        notificationDesc: 'Gerencie como voce recebe atualizacoes',
        weeklyReportDesc: 'Receba um resumo do seu progresso semanalmente',
        courseUpdatesDesc: 'Notificacoes sobre novos cursos e conteudos',
        savePreferences: 'Salvar Preferencias',
        privacyTitle: 'Privacidade e Seguranca',
        privacyDesc: 'Controle quem pode ver suas informacoes',
        profileVisibilityDesc: 'Quem pode ver seu perfil',
        publicProfile: 'Publico - Todos podem ver',
        privateProfile: 'Privado - Apenas voce',
        showEmailDesc: 'Exibir e-mail no seu perfil publico',
        showPhoneDesc: 'Exibir telefone no seu perfil publico',
        dangerZone: 'Zona de Perigo',
        dangerZoneDesc: 'Acoes irreversiveis da conta',
        deleteAccount: 'Excluir Conta',
        saveSettings: 'Salvar Configuracoes',
        appearanceTitle: 'Aparencia',
        appearanceDesc: 'Personalize a interface do aplicativo',
        theme: 'Tema',
        themeDesc: 'Alternar entre modo claro e escuro',
        language: 'Idioma',
        languageDesc: 'A traducao sera aplicada em todo o site',
        fontSize: 'Tamanho da Fonte',
        fontSizeDesc: 'Ajuste o tamanho do texto na interface inteira',
        color: 'Cor de Destaque',
        colorDesc: 'Escolha a cor principal do aplicativo',
        saveAppearance: 'Salvar Aparencia',
        appearanceSaved: 'Aparencia atualizada!',
        appearanceSavedDesc: 'Cor e tamanho da fonte foram aplicados no site inteiro.',
        small: 'Pequeno',
        medium: 'Medio',
        large: 'Grande',
      },
      en: {
        back: 'Back',
        profileTitle: 'Profile Information',
        profileDesc: 'Update your personal and professional information',
        fullNamePlaceholder: 'Your full name',
        phonePlaceholder: '(00) 00000-0000',
        password: 'Password',
        changePassword: 'Change Password',
        saveChanges: 'Save Changes',
        securityTitle: 'Account Security',
        securityDesc: 'Manage your security and authentication settings',
        twoFactorAlert: 'Two-factor authentication adds an extra layer of security to your account.',
        twoFactorLabel: 'Two-Factor Authentication',
        twoFactorEnabled: 'Your account is protected with a TOTP code',
        twoFactorDisabled: 'Add an extra security layer',
        enabled: 'Enabled',
        disable: 'Disable',
        enable2FA: 'Enable 2FA',
        notificationTitle: 'Notification Preferences',
        notificationDesc: 'Manage how you receive updates',
        weeklyReportDesc: 'Receive a weekly summary of your progress',
        courseUpdatesDesc: 'Notifications about new courses and content',
        savePreferences: 'Save Preferences',
        privacyTitle: 'Privacy and Security',
        privacyDesc: 'Control who can see your information',
        profileVisibilityDesc: 'Who can see your profile',
        publicProfile: 'Public - Everyone can view it',
        privateProfile: 'Private - Only you',
        showEmailDesc: 'Show email on your public profile',
        showPhoneDesc: 'Show phone on your public profile',
        dangerZone: 'Danger Zone',
        dangerZoneDesc: 'Irreversible account actions',
        deleteAccount: 'Delete Account',
        saveSettings: 'Save Settings',
        appearanceTitle: 'Appearance',
        appearanceDesc: 'Customize the app interface',
        theme: 'Theme',
        themeDesc: 'Switch between light and dark mode',
        language: 'Language',
        languageDesc: 'The translation will be applied across the whole site',
        fontSize: 'Font Size',
        fontSizeDesc: 'Adjust text size across the entire interface',
        color: 'Accent Color',
        colorDesc: 'Choose the main color of the app',
        saveAppearance: 'Save Appearance',
        appearanceSaved: 'Appearance updated!',
        appearanceSavedDesc: 'Color and font size have been applied across the entire site.',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
      },
      es: {
        back: 'Volver',
        profileTitle: 'Informacion del Perfil',
        profileDesc: 'Actualiza tu informacion personal y profesional',
        fullNamePlaceholder: 'Tu nombre completo',
        phonePlaceholder: '(00) 00000-0000',
        password: 'Contrasena',
        changePassword: 'Cambiar Contrasena',
        saveChanges: 'Guardar Cambios',
        securityTitle: 'Seguridad de la Cuenta',
        securityDesc: 'Administra la seguridad y autenticacion de tu cuenta',
        twoFactorAlert: 'La autenticacion de dos factores agrega una capa extra de seguridad a tu cuenta.',
        twoFactorLabel: 'Autenticacion de Dos Factores',
        twoFactorEnabled: 'Tu cuenta esta protegida con codigo TOTP',
        twoFactorDisabled: 'Agrega una capa extra de seguridad',
        enabled: 'Activado',
        disable: 'Desactivar',
        enable2FA: 'Activar 2FA',
        notificationTitle: 'Preferencias de Notificacion',
        notificationDesc: 'Administra como recibes actualizaciones',
        weeklyReportDesc: 'Recibe un resumen semanal de tu progreso',
        courseUpdatesDesc: 'Notificaciones sobre nuevos cursos y contenidos',
        savePreferences: 'Guardar Preferencias',
        privacyTitle: 'Privacidad y Seguridad',
        privacyDesc: 'Controla quien puede ver tu informacion',
        profileVisibilityDesc: 'Quien puede ver tu perfil',
        publicProfile: 'Publico - Todos pueden verlo',
        privateProfile: 'Privado - Solo tu',
        showEmailDesc: 'Mostrar correo en tu perfil publico',
        showPhoneDesc: 'Mostrar telefono en tu perfil publico',
        dangerZone: 'Zona de Peligro',
        dangerZoneDesc: 'Acciones irreversibles de la cuenta',
        deleteAccount: 'Eliminar Cuenta',
        saveSettings: 'Guardar Configuracion',
        appearanceTitle: 'Apariencia',
        appearanceDesc: 'Personaliza la interfaz de la aplicacion',
        theme: 'Tema',
        themeDesc: 'Cambiar entre modo claro y oscuro',
        language: 'Idioma',
        languageDesc: 'La traduccion se aplicara en todo el sitio',
        fontSize: 'Tamano de Fuente',
        fontSizeDesc: 'Ajusta el tamano del texto en toda la interfaz',
        color: 'Color Principal',
        colorDesc: 'Elige el color principal de la aplicacion',
        saveAppearance: 'Guardar Apariencia',
        appearanceSaved: 'Apariencia actualizada!',
        appearanceSavedDesc: 'El color y el tamano de fuente ya se aplicaron en todo el sitio.',
        small: 'Pequeno',
        medium: 'Mediano',
        large: 'Grande',
      },
    } as const;

    return translations[language as keyof typeof translations] ?? translations.en;
  }, [language]);

  useEffect(() => {
    setSelectedAccentColor(accentColor);
    setSelectedFontSize(fontSize);
  }, [accentColor, fontSize]);

  useEffect(() => {
    const check2FA = async () => {
      try {
        const { data } = await supabase.auth.mfa.listFactors();
        setMfaEnabled((data?.totp?.length || 0) > 0);
      } catch (error) {
        console.error('[SETTINGS] Failed to check 2FA status', error);
      } finally {
        setLoading2FA(false);
      }
    };

    check2FA();
  }, []);

  const saveProfile = () => {
    toast({ title: t('settings.profileUpdated'), description: t('settings.profileUpdateDesc') });
  };

  const saveNotifications = () => {
    toast({ title: t('settings.notificationsSaved'), description: t('settings.notificationsSavedDesc') });
  };

  const savePrivacy = () => {
    toast({ title: t('settings.privacyUpdated'), description: t('settings.privacyUpdatedDesc') });
  };

  const saveAppearance = () => {
    setAccentColor(selectedAccentColor);
    setFontSize(selectedFontSize);
    toast({ title: copy.appearanceSaved, description: copy.appearanceSavedDesc });
  };

  const handleDisable2FA = async () => {
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactor = factors?.totp?.[0];
      if (!totpFactor) return;

      const { error } = await supabase.auth.mfa.unenroll({ factorId: totpFactor.id });
      if (error) throw error;

      setMfaEnabled(false);
      toast({ title: t('settings.2FADisabled'), description: t('settings.2FADisabledDesc') });
    } catch (error) {
      toast({ title: t('settings.error2FA'), description: t('settings.error2FA'), variant: 'destructive' });
    }
  };

  const defaultTab = searchParams.get('tab') || 'profile';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{copy.back}</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-gradient-primary">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">{t('settings.title')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileCompletion />

          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center space-x-2"><User className="h-4 w-4" /><span className="hidden sm:inline">{t('settings.profile')}</span></TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2"><ShieldCheck className="h-4 w-4" /><span className="hidden sm:inline">{t('settings.security')}</span></TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2"><Bell className="h-4 w-4" /><span className="hidden sm:inline">{t('settings.notifications')}</span></TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2"><Shield className="h-4 w-4" /><span className="hidden sm:inline">{t('settings.privacy')}</span></TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2"><Palette className="h-4 w-4" /><span className="hidden sm:inline">{t('settings.appearance')}</span></TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-primary/20 shadow-nexus animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><User className="h-5 w-5 text-primary" /><span>{copy.profileTitle}</span></CardTitle>
                  <CardDescription>{copy.profileDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('settings.fullName')}</Label>
                      <Input id="fullName" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder={copy.fullNamePlaceholder} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2"><Mail className="h-4 w-4" /><span>{t('settings.email')}</span></Label>
                      <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('settings.phone')}</Label>
                      <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder={copy.phonePlaceholder} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('settings.bio')}</Label>
                    <Input id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder={t('settings.bioPlaceholder')} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2"><Lock className="h-4 w-4" /><span>{copy.password}</span></Label>
                    <Button variant="outline" className="w-full sm:w-auto">{copy.changePassword}</Button>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveProfile} className="flex items-center space-x-2"><Save className="h-4 w-4" /><span>{copy.saveChanges}</span></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              {showSetup2FA ? (
                <TwoFactorSetup onComplete={() => { setShowSetup2FA(false); setMfaEnabled(true); }} onSkip={() => setShowSetup2FA(false)} />
              ) : (
                <Card className="border-primary/20 shadow-nexus animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2"><ShieldCheck className="h-5 w-5 text-primary" /><span>{copy.securityTitle}</span></CardTitle>
                    <CardDescription>{copy.securityDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>{copy.twoFactorAlert}</AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                        <div className="space-y-1">
                          <Label className="text-base font-semibold">{copy.twoFactorLabel}</Label>
                          <p className="text-sm text-muted-foreground">{mfaEnabled ? copy.twoFactorEnabled : copy.twoFactorDisabled}</p>
                          {mfaEnabled && <Badge className="mt-2 bg-green-500/10 text-green-600 hover:bg-green-500/20">{copy.enabled}</Badge>}
                        </div>
                        {!loading2FA && (
                          mfaEnabled ? (
                            <Button variant="outline" onClick={handleDisable2FA} className="text-destructive hover:text-destructive">{copy.disable}</Button>
                          ) : (
                            <Button onClick={() => setShowSetup2FA(true)}>{copy.enable2FA}</Button>
                          )
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2"><Lock className="h-4 w-4" /><span>{copy.changePassword}</span></Label>
                        <Button variant="outline" className="w-full sm:w-auto mt-2">{copy.changePassword}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border-primary/20 shadow-nexus animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><Bell className="h-5 w-5 text-primary" /><span>{copy.notificationTitle}</span></CardTitle>
                  <CardDescription>{copy.notificationDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">{t('settings.emailNotifications')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                      </div>
                      <Switch id="email-notifications" checked={notifications.emailNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.pushNotificationsDesc')}</p>
                      </div>
                      <Switch id="push-notifications" checked={notifications.pushNotifications} onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-report">{t('settings.weeklyReport')}</Label>
                        <p className="text-sm text-muted-foreground">{copy.weeklyReportDesc}</p>
                      </div>
                      <Switch id="weekly-report" checked={notifications.weeklyReport} onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="course-updates">{t('settings.courseUpdates')}</Label>
                        <p className="text-sm text-muted-foreground">{copy.courseUpdatesDesc}</p>
                      </div>
                      <Switch id="course-updates" checked={notifications.courseUpdates} onCheckedChange={(checked) => setNotifications({ ...notifications, courseUpdates: checked })} />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveNotifications} className="flex items-center space-x-2"><Save className="h-4 w-4" /><span>{copy.savePreferences}</span></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="border-primary/20 shadow-nexus animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><Shield className="h-5 w-5 text-primary" /><span>{copy.privacyTitle}</span></CardTitle>
                  <CardDescription>{copy.privacyDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border">
                      <Label className="text-base">{t('settings.profileVisibility')}</Label>
                      <p className="text-sm text-muted-foreground mb-3">{copy.profileVisibilityDesc}</p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="visibility" value="public" checked={privacy.profileVisibility === 'public'} onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })} className="text-primary" />
                          <span className="text-sm">{copy.publicProfile}</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="visibility" value="private" checked={privacy.profileVisibility === 'private'} onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })} className="text-primary" />
                          <span className="text-sm">{copy.privateProfile}</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-email">{t('settings.showEmail')}</Label>
                        <p className="text-sm text-muted-foreground">{copy.showEmailDesc}</p>
                      </div>
                      <Switch id="show-email" checked={privacy.showEmail} onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-phone">{t('settings.showPhone')}</Label>
                        <p className="text-sm text-muted-foreground">{copy.showPhoneDesc}</p>
                      </div>
                      <Switch id="show-phone" checked={privacy.showPhone} onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })} />
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-2">{copy.dangerZone}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{copy.dangerZoneDesc}</p>
                    <Button variant="destructive" size="sm">{copy.deleteAccount}</Button>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={savePrivacy} className="flex items-center space-x-2"><Save className="h-4 w-4" /><span>{copy.saveSettings}</span></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card className="border-primary/20 shadow-nexus animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2"><Palette className="h-5 w-5 text-primary" /><span>{copy.appearanceTitle}</span></CardTitle>
                  <CardDescription>{copy.appearanceDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border">
                      <Label className="text-base mb-3 block">{copy.theme}</Label>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground">{copy.themeDesc}</span>
                        <ThemeToggle />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <Label className="text-base mb-3 block flex items-center gap-2"><Globe className="h-4 w-4" />{copy.language}</Label>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground">{copy.languageDesc}</span>
                        <LanguageSelector />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <Label className="text-base">{copy.fontSize}</Label>
                      <p className="text-sm text-muted-foreground mb-3">{copy.fontSizeDesc}</p>
                      <div className="flex space-x-2">
                        {fontOptions.map((option) => (
                          <Button key={option} variant={selectedFontSize === option ? 'default' : 'outline'} size="sm" onClick={() => setSelectedFontSize(option)}>
                            {copy[option]}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <Label className="text-base">{copy.color}</Label>
                      <p className="text-sm text-muted-foreground mb-3">{copy.colorDesc}</p>
                      <div className="flex flex-wrap gap-3">
                        {colourOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            aria-label={option.value}
                            onClick={() => setSelectedAccentColor(option.value)}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 hover:border-primary transition-colors ${selectedAccentColor === option.value ? 'border-foreground' : 'border-border'}`}
                          >
                            <span className={`h-4 w-4 rounded-full ${option.previewClassName}`} />
                            <span className="text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={saveAppearance} className="flex items-center space-x-2"><Save className="h-4 w-4" /><span>{copy.saveAppearance}</span></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
