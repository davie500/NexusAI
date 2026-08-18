import { Shield, ChevronLeft, Home, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminPanel } from '@/components/AdminPanel';
import { AdminWorkspace } from '@/components/AdminWorkspace';
import ThemeToggle from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [adminUsers, setAdminUsers] = useState<
    Array<{ user_id: string; full_name: string; email: string; role: 'admin' | 'client' }>
  >([]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Admin</p>
              <h1 className="text-xl font-semibold">{t('admin.title')}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              {t('dashboard.settings')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="management" className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-2">
              <TabsTrigger value="management">Gestao</TabsTrigger>
              <TabsTrigger value="workspace">Ferramentas</TabsTrigger>
            </TabsList>

            <TabsContent value="management">
              <AdminPanel onUsersLoaded={setAdminUsers} />
            </TabsContent>

            <TabsContent value="workspace">
              <AdminWorkspace users={adminUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
