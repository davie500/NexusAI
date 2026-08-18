import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Crown,
  Globe,
  Mail,
  PencilLine,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  UserCog,
  Users,
} from 'lucide-react';

type UserRole = 'admin' | 'client';

interface UserData {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  career_field: string | null;
  experience_level: string | null;
  preferred_language: string | null;
  bio: string | null;
}

interface AdminPanelProps {
  onUsersLoaded?: (
    users: Array<{
      user_id: string;
      full_name: string;
      email: string;
      role: UserRole;
    }>
  ) => void;
}

interface AuditLogRow {
  id: string;
  action: string;
  actor_id: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const LANGUAGES = ['pt', 'en', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'ko', 'ru', 'ar', 'hi'];
const EXPERIENCE_LEVELS = ['entry', 'junior', 'mid', 'senior', 'lead'];

const initials = (name: string, email: string) =>
  (name || email)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const AdminPanel = ({ onUsersLoaded }: AdminPanelProps) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(true);
  const [savingEmailSetting, setSavingEmailSetting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    career_field: '',
    experience_level: 'entry',
    preferred_language: 'pt',
    bio: '',
    role: 'client' as UserRole,
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [profilesRes, rolesRes, logsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('user_id, email, full_name, created_at, career_field, experience_level, preferred_language, bio')
          .order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
        supabase
          .from('admin_audit_logs')
          .select('id, action, actor_id, target_user_id, details, created_at')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (logsRes.error) throw logsRes.error;

      const roles = new Map((rolesRes.data ?? []).map((item) => [item.user_id, item.role as UserRole]));
      setUsers(
        (profilesRes.data ?? []).map((profile) => ({
          ...profile,
          role: roles.get(profile.user_id) ?? 'client',
        }))
      );
      setAuditLogs((logsRes.data as AuditLogRow[] | null) ?? []);
      onUsersLoaded?.(
        ((profilesRes.data ?? []).map((profile) => ({
          user_id: profile.user_id,
          full_name: profile.full_name,
          email: profile.email,
          role: roles.get(profile.user_id) ?? 'client',
        })) as Array<{
          user_id: string;
          full_name: string;
          email: string;
          role: UserRole;
        }>)
      );
    } catch (error) {
      console.error('[ADMIN_PANEL] Failed to load data', error);
      toast({
        title: t('admin.errorFetch'),
        description: t('admin.errorFetch'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const saved = localStorage.getItem('emailConfirmationRequired');
    if (saved !== null) setEmailConfirmationRequired(saved === 'true');
  }, []);

  const metrics = useMemo(() => {
    const admins = users.filter((user) => user.role === 'admin').length;
    const recent = users.filter((user) => Date.now() - new Date(user.created_at).getTime() < 604800000).length;
    const topLanguage =
      Object.entries(
        users.reduce<Record<string, number>>((acc, user) => {
          const key = user.preferred_language || 'pt';
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pt';

    return { total: users.length, admins, clients: users.length - admins, recent, topLanguage };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = search.toLowerCase();
      const matchesSearch =
        user.full_name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.career_field ?? '').toLowerCase().includes(term);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const actorMap = useMemo(() => new Map(users.map((user) => [user.user_id, user])), [users]);

  const openEditor = (user: UserData) => {
    setSelectedUser(user);
    setForm({
      full_name: user.full_name,
      career_field: user.career_field ?? '',
      experience_level: user.experience_level ?? 'entry',
      preferred_language: user.preferred_language ?? 'pt',
      bio: user.bio ?? '',
      role: user.role,
    });
    setEditorOpen(true);
  };

  const logAction = async (action: string, targetUserId: string | null, details: Record<string, unknown>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('admin_audit_logs').insert({
      actor_id: user.id,
      action,
      target_user_id: targetUserId,
      details,
    });
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setSavingUser(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name.trim(),
          career_field: form.career_field.trim() || null,
          experience_level: form.experience_level || null,
          preferred_language: form.preferred_language || 'pt',
          bio: form.bio.trim() || null,
        })
        .eq('user_id', selectedUser.user_id);
      if (profileError) throw profileError;

      if (form.role !== selectedUser.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: form.role })
          .eq('user_id', selectedUser.user_id);
        if (roleError) throw roleError;
      }

      await logAction('update_user', selectedUser.user_id, {
        email: selectedUser.email,
        role: form.role,
        language: form.preferred_language,
      });

      toast({ title: 'Usuario atualizado', description: 'As alteracoes foram salvas.' });
      setEditorOpen(false);
      await loadAdminData();
    } catch (error) {
      console.error('[ADMIN_PANEL] Failed to save user', error);
      toast({
        title: 'Erro ao atualizar usuario',
        description: 'Nao foi possivel salvar as alteracoes.',
        variant: 'destructive',
      });
    } finally {
      setSavingUser(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessao expirada');

      const response = await fetch('https://bmtmyjxnixujqvoltzia.supabase.co/functions/v1/delete-user', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao deletar usuario');
      }

      toast({ title: t('admin.userDeleted'), description: t('admin.userDeletedDesc') });
      await loadAdminData();
    } catch (error) {
      console.error('[ADMIN_PANEL] Failed to delete user', error);
      toast({
        title: t('admin.errorDelete'),
        description: t('admin.errorDelete'),
        variant: 'destructive',
      });
    } finally {
      setDeleteUserId(null);
    }
  };

  const toggleEmailConfirmation = async (checked: boolean) => {
    setSavingEmailSetting(true);
    try {
      localStorage.setItem('emailConfirmationRequired', String(checked));
      setEmailConfirmationRequired(checked);
      toast({
        title: t('admin.settingsSaved'),
        description: checked ? t('admin.emailConfirmationEnabled') : t('admin.emailConfirmationDisabled'),
      });
    } finally {
      setSavingEmailSetting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card><CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" />
        </CardContent></Card>
        <Card><CardContent className="space-y-4 p-6">
          <Skeleton className="h-10 w-72" /><Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-24 rounded-2xl" />
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl">
        <CardContent className="relative p-6 md:p-8">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit border-0 bg-white/10 text-white"><Sparkles className="mr-2 h-3.5 w-3.5" />Central de controle</Badge>
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">{t('admin.title')}</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                  Um painel completo para acompanhar a plataforma, gerenciar usuários e executar operacoes administrativas.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-slate-400">Usuários</p><p className="mt-2 text-3xl font-semibold">{metrics.total}</p></div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"><p className="text-xs text-emerald-200">Admins</p><p className="mt-2 text-3xl font-semibold">{metrics.admins}</p></div>
              <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4"><p className="text-xs text-sky-200">Semana</p><p className="mt-2 text-3xl font-semibold">{metrics.recent}</p></div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4"><p className="text-xs text-amber-200">Idioma</p><p className="mt-2 text-3xl font-semibold">{metrics.topLanguage.toUpperCase()}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-2 md:grid-cols-4">
          <TabsTrigger value="overview"><UserCog className="mr-2 h-4 w-4" />Visão geral</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Usuários</TabsTrigger>
          <TabsTrigger value="activity"><Activity className="mr-2 h-4 w-4" />Atividade</TabsTrigger>
          <TabsTrigger value="controls"><Shield className="mr-2 h-4 w-4" />Controles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Resumo operacional</CardTitle>
                <CardDescription>Indicadores centrais do ambiente administrativo.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4"><p className="text-sm text-muted-foreground">Clientes</p><p className="mt-2 text-3xl font-semibold">{metrics.clients}</p></div>
                <div className="rounded-2xl border p-4"><p className="text-sm text-muted-foreground">Logs recentes</p><p className="mt-2 text-3xl font-semibold">{auditLogs.length}</p></div>
                <div className="rounded-2xl border p-4"><p className="text-sm text-muted-foreground">Perfis com bio</p><p className="mt-2 text-3xl font-semibold">{users.filter((u) => Boolean(u.bio)).length}</p></div>
                <div className="rounded-2xl border p-4"><p className="text-sm text-muted-foreground">Áreas preenchidas</p><p className="mt-2 text-3xl font-semibold">{users.filter((u) => Boolean(u.career_field)).length}</p></div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Atalhos administrativos</CardTitle>
                <CardDescription>Acesse rapidamente as areas mais usadas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={() => navigate('/dashboard')}>Abrir dashboard<ArrowUpRight className="h-4 w-4" /></Button>
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={() => navigate('/settings')}>Abrir configuracoes<ArrowUpRight className="h-4 w-4" /></Button>
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={() => navigate('/demo')}>Ver demo<ArrowUpRight className="h-4 w-4" /></Button>
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={loadAdminData}>Recarregar painel<RefreshCw className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Últimos usuários</CardTitle>
              <CardDescription>Contas mais recentes da plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.slice(0, 6).map((user) => (
                <button key={user.user_id} type="button" onClick={() => openEditor(user)} className="rounded-2xl border bg-background/60 p-4 text-left transition hover:border-primary/30 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border"><AvatarFallback className="bg-primary/10 text-primary">{initials(user.full_name, user.email)}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.full_name}</p>
                      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">{user.role === 'admin' ? t('admin.admin') : t('admin.client')}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(user.created_at)}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <CardTitle>Gestao de usuários</CardTitle>
                <CardDescription>Pesquise, edite perfis, altere permissao e remova contas.</CardDescription>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
                <div className="relative md:w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, e-mail ou area" className="pl-9" />
                </div>
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as 'all' | UserRole)}>
                  <SelectTrigger className="md:w-40"><SelectValue placeholder="Filtrar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                    <SelectItem value="client">Clientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border bg-background/40">
                <ScrollArea className="max-h-[560px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.name')}</TableHead>
                        <TableHead>{t('admin.email')}</TableHead>
                        <TableHead>{t('admin.role')}</TableHead>
                        <TableHead>Idioma</TableHead>
                        <TableHead>{t('admin.createdAt')}</TableHead>
                        <TableHead className="text-right">{t('admin.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border"><AvatarFallback className="bg-primary/10 text-primary">{initials(user.full_name, user.email)}</AvatarFallback></Avatar>
                              <div className="min-w-0">
                                <p className="truncate font-medium">{user.full_name}</p>
                                <p className="truncate text-xs text-muted-foreground">{user.career_field || 'Sem area definida'}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">{user.email}</TableCell>
                          <TableCell>
                            <Badge className={cn('border-0', user.role === 'admin' ? 'bg-amber-500/15 text-amber-600' : 'bg-slate-500/10 text-slate-600 dark:text-slate-300')}>
                              {user.role === 'admin' ? t('admin.admin') : t('admin.client')}
                            </Badge>
                          </TableCell>
                          <TableCell>{(user.preferred_language || 'pt').toUpperCase()}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openEditor(user)}><PencilLine className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" disabled={user.role === 'admin'} onClick={() => setDeleteUserId(user.user_id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Auditoria recente</CardTitle>
                <CardDescription>Ultimas acoes administrativas registradas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditLogs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhum log administrativo registrado.</div>
                ) : auditLogs.map((log) => {
                  const actor = actorMap.get(log.actor_id);
                  const target = log.target_user_id ? actorMap.get(log.target_user_id) : null;
                  return (
                    <div key={log.id} className="rounded-2xl border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{log.action}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(log.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm">
                        <span className="font-medium">{actor?.full_name || 'Administrador'}</span>
                        {target ? ` alterou ${target.full_name}` : ' executou uma operacao administrativa'}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Estado da plataforma</CardTitle>
                <CardDescription>Leitura rapida do ambiente atual.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border p-4"><div className="flex items-center gap-3"><Globe className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">Idiomas ativos</p><p className="text-2xl font-semibold">{new Set(users.map((u) => u.preferred_language || 'pt')).size}</p></div></div></div>
                <div className="rounded-2xl border p-4"><div className="flex items-center gap-3"><Briefcase className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">Áreas preenchidas</p><p className="text-2xl font-semibold">{users.filter((u) => Boolean(u.career_field)).length}</p></div></div></div>
                <div className="rounded-2xl border p-4"><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><div><p className="text-sm text-muted-foreground">Confirmação de e-mail</p><p className="text-2xl font-semibold">{emailConfirmationRequired ? 'Ativa' : 'Flexivel'}</p></div></div></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><CardTitle>{t('admin.authSettings')}</CardTitle></div>
                <CardDescription>{t('admin.authSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="email-confirmation">{t('admin.requireEmailConfirmation')}</Label>
                      <p className="text-sm text-muted-foreground">{t('admin.emailConfirmationDesc')}</p>
                    </div>
                    <Switch id="email-confirmation" checked={emailConfirmationRequired} onCheckedChange={toggleEmailConfirmation} disabled={savingEmailSetting} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4"><div className="flex items-center gap-3"><Users className="h-4 w-4 text-primary" /><div><p className="text-sm text-muted-foreground">Usuários</p><p className="text-2xl font-semibold">{metrics.total}</p></div></div></div>
                  <div className="rounded-2xl border p-4"><div className="flex items-center gap-3"><Crown className="h-4 w-4 text-amber-500" /><div><p className="text-sm text-muted-foreground">Admins</p><p className="text-2xl font-semibold">{metrics.admins}</p></div></div></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /><CardTitle>Ferramentas do painel</CardTitle></div>
                <CardDescription>Operacoes rapidas para administracao cotidiana.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={loadAdminData}>Recarregar usuários e logs<RefreshCw className="h-4 w-4" /></Button>
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={() => navigate('/settings')}>Abrir configurações<ArrowUpRight className="h-4 w-4" /></Button>
                <Button variant="outline" className="w-full justify-between rounded-2xl" onClick={() => navigate('/dashboard')}>Voltar ao dashboard<ArrowUpRight className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>Ajuste perfil, idioma, experiencia e permissao da conta selecionada.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2"><Label>Nome completo</Label><Input value={form.full_name} onChange={(e) => setForm((c) => ({ ...c, full_name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Area profissional</Label><Input value={form.career_field} onChange={(e) => setForm((c) => ({ ...c, career_field: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Nivel</Label><Select value={form.experience_level} onValueChange={(value) => setForm((c) => ({ ...c, experience_level: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EXPERIENCE_LEVELS.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Idioma</Label><Select value={form.preferred_language} onValueChange={(value) => setForm((c) => ({ ...c, preferred_language: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{LANGUAGES.map((lang) => <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Permissao</Label><Select value={form.role} onValueChange={(value) => setForm((c) => ({ ...c, role: value as UserRole }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="client">Cliente</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm((c) => ({ ...c, bio: e.target.value }))} className="min-h-[120px]" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancelar</Button>
            <Button onClick={saveUser} disabled={savingUser}>{savingUser ? 'Salvando...' : 'Salvar usuario'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteUser')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.deleteConfirm')} {t('admin.deleteDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteUserId && deleteUser(deleteUserId)} className="bg-destructive hover:bg-destructive/90">{t('admin.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
