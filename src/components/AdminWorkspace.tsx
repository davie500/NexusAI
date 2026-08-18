import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Briefcase, FileText, Target, TrendingUp, UserRound } from 'lucide-react';
import ResumeBuilder from '@/components/ResumeBuilder';
import InterviewPrep from '@/components/InterviewPrep';
import SkillsDevelopment from '@/components/SkillsDevelopment';
import JobSearch from '@/components/JobSearch';

interface AdminWorkspaceProps {
  users: Array<{
    user_id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'client';
  }>;
}

export const AdminWorkspace = ({ users }: AdminWorkspaceProps) => {
  const clientUsers = useMemo(() => users.filter((user) => user.role === 'client'), [users]);
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<string>(clientUsers[0]?.user_id ?? '');

  const selectedTargetUser =
    clientUsers.find((user) => user.user_id === selectedTargetUserId) ?? clientUsers[0] ?? null;

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Laboratorio administrativo
            </CardTitle>
            <CardDescription>
              Acesse como admin as áreas de curriculo, entrevistas, habilidades e vagas em um unico ambiente.
            </CardDescription>
          </div>

          <div className="w-full max-w-sm space-y-2">
            <Label>Cliente para acompanhar na aba de entrevistas</Label>
            <Select value={selectedTargetUser?.user_id ?? ''} onValueChange={setSelectedTargetUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientUsers.length === 0 ? (
                  <SelectItem value="no-client" disabled>
                    Nenhum cliente disponivel
                  </SelectItem>
                ) : (
                  clientUsers.map((user) => (
                    <SelectItem key={user.user_id} value={user.user_id}>
                      {user.full_name} - {user.email}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">
            <UserRound className="mr-2 h-4 w-4" />
            {selectedTargetUser ? `Cliente atual: ${selectedTargetUser.full_name}` : 'Escolha um cliente para entrevistas'}
          </Badge>
          <Badge variant="outline">{clientUsers.length} cliente(s) disponivel(is)</Badge>
        </CardContent>
      </Card>

      <Tabs defaultValue="resume" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-2 lg:grid-cols-4">
          <TabsTrigger value="resume">
            <FileText className="mr-2 h-4 w-4" />
            Otimizar curriculo
          </TabsTrigger>
          <TabsTrigger value="interview">
            <Target className="mr-2 h-4 w-4" />
            Entrevistas
          </TabsTrigger>
          <TabsTrigger value="skills">
            <TrendingUp className="mr-2 h-4 w-4" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            Buscar vagas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume">
          <ResumeBuilder />
        </TabsContent>

        <TabsContent value="interview">
          <InterviewPrep
            mode="admin"
            targetUserId={selectedTargetUser?.user_id ?? null}
            targetUserName={selectedTargetUser?.full_name ?? null}
          />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsDevelopment />
        </TabsContent>

        <TabsContent value="jobs">
          <JobSearch />
        </TabsContent>
      </Tabs>
    </div>
  );
};
