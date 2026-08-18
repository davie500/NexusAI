import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, Play, CheckCircle, Lightbulb, Send, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: 'Facil' | 'Medio' | 'Dificil';
  tips: string[];
  source: 'default' | 'admin';
}

interface InterviewPrepProps {
  mode?: 'client' | 'admin';
  targetUserId?: string | null;
  targetUserName?: string | null;
}

const defaultQuestions: Question[] = [
  {
    id: 'default-1',
    question: 'Fale sobre voce e sua experiencia profissional.',
    category: 'Apresentacao Pessoal',
    difficulty: 'Facil',
    tips: ['Seja objetivo', 'Foque em experiencias relevantes', 'Demonstre confianca'],
    source: 'default',
  },
  {
    id: 'default-2',
    question: 'Quais sao seus pontos fortes e pontos de melhoria?',
    category: 'Autoconhecimento',
    difficulty: 'Medio',
    tips: ['Use exemplos concretos', 'Mostre evolucao', 'Seja honesto com estrategia'],
    source: 'default',
  },
  {
    id: 'default-3',
    question: 'Por que voce quer trabalhar nesta empresa?',
    category: 'Motivacao',
    difficulty: 'Medio',
    tips: ['Pesquise a empresa', 'Conecte seus valores', 'Mostre contexto do setor'],
    source: 'default',
  },
  {
    id: 'default-4',
    question: 'Como voce lida com situacoes de pressao?',
    category: 'Comportamental',
    difficulty: 'Dificil',
    tips: ['Use a tecnica STAR', 'Cite situacoes reais', 'Demonstre maturidade'],
    source: 'default',
  },
  {
    id: 'default-5',
    question: 'Onde voce se ve em 5 anos?',
    category: 'Planejamento de Carreira',
    difficulty: 'Medio',
    tips: ['Seja realista', 'Conecte com a vaga', 'Mostre visao de crescimento'],
    source: 'default',
  },
];

const additionalDefaultQuestions: Question[] = [
  {
    id: 'default-apresentacao-1',
    question: 'Conte sobre uma conquista profissional recente e o impacto que ela gerou.',
    category: 'Apresentacao Pessoal',
    difficulty: 'Medio',
    tips: ['Explique o contexto', 'Mostre sua contribuicao', 'Traga um resultado concreto'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-2',
    question: 'Como sua trajetoria ate aqui se conecta com esta oportunidade?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Medio',
    tips: ['Conecte experiencia e vaga', 'Evite repetir o curriculo inteiro', 'Mostre intencao de carreira'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-3',
    question: 'Qual problema profissional voce mais gosta de resolver?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Facil',
    tips: ['Seja especifico', 'Mostre motivacao', 'Use um exemplo pratico'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-4',
    question: 'O que voce gostaria que a pessoa entrevistadora lembrasse sobre voce?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Dificil',
    tips: ['Escolha uma mensagem central', 'Seja memoravel sem exagero', 'Conecte com valor para a empresa'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-5',
    question: 'Como voce explicaria seu perfil profissional em um minuto?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Facil',
    tips: ['Use uma estrutura curta', 'Fale de experiencia, foco e diferencial', 'Controle o tempo'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-6',
    question: 'Quais experiencias anteriores mais prepararam voce para esta vaga?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Medio',
    tips: ['Priorize experiencias relevantes', 'Mostre aprendizado', 'Conecte habilidades transferiveis'],
    source: 'default',
  },
  {
    id: 'default-apresentacao-7',
    question: 'Como voce descreve seu jeito de trabalhar?',
    category: 'Apresentacao Pessoal',
    difficulty: 'Facil',
    tips: ['Fale de rotina e colaboracao', 'Evite respostas genericas', 'Mostre autoconsciencia'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-1',
    question: 'Qual feedback dificil voce recebeu e como agiu depois disso?',
    category: 'Autoconhecimento',
    difficulty: 'Dificil',
    tips: ['Mostre abertura', 'Explique a mudanca de comportamento', 'Evite culpar terceiros'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-2',
    question: 'Qual habilidade voce esta desenvolvendo neste momento?',
    category: 'Autoconhecimento',
    difficulty: 'Facil',
    tips: ['Cite uma habilidade real', 'Mostre plano de evolucao', 'Explique por que ela importa'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-3',
    question: 'Em que tipo de ambiente voce costuma performar melhor?',
    category: 'Autoconhecimento',
    difficulty: 'Medio',
    tips: ['Descreva condicoes concretas', 'Mostre flexibilidade', 'Conecte com cultura da empresa'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-4',
    question: 'Como voce percebe quando precisa pedir ajuda?',
    category: 'Autoconhecimento',
    difficulty: 'Medio',
    tips: ['Valorize colaboracao', 'Mostre criterio', 'Traga um exemplo'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-5',
    question: 'Qual erro profissional te ensinou algo importante?',
    category: 'Autoconhecimento',
    difficulty: 'Dificil',
    tips: ['Assuma responsabilidade', 'Explique o aprendizado', 'Mostre prevencao futura'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-6',
    question: 'Como voce organiza prioridades quando tem muitas demandas?',
    category: 'Autoconhecimento',
    difficulty: 'Medio',
    tips: ['Fale de metodo', 'Mostre comunicacao com stakeholders', 'Destaque foco em impacto'],
    source: 'default',
  },
  {
    id: 'default-autoconhecimento-7',
    question: 'Quais valores profissionais voce nao abre mao?',
    category: 'Autoconhecimento',
    difficulty: 'Medio',
    tips: ['Escolha poucos valores', 'Use exemplos', 'Evite discurso abstrato'],
    source: 'default',
  },
  {
    id: 'default-motivacao-1',
    question: 'O que chamou sua atencao nesta vaga?',
    category: 'Motivacao',
    difficulty: 'Facil',
    tips: ['Mostre que leu a vaga', 'Conecte responsabilidades e experiencia', 'Evite falar so de beneficios'],
    source: 'default',
  },
  {
    id: 'default-motivacao-2',
    question: 'Por que este momento da sua carreira combina com essa oportunidade?',
    category: 'Motivacao',
    difficulty: 'Medio',
    tips: ['Contextualize sua fase atual', 'Mostre direcao', 'Conecte crescimento e contribuicao'],
    source: 'default',
  },
  {
    id: 'default-motivacao-3',
    question: 'O que voce sabe sobre nosso produto, mercado ou clientes?',
    category: 'Motivacao',
    difficulty: 'Medio',
    tips: ['Pesquise antes', 'Cite algo especifico', 'Mostre curiosidade genuina'],
    source: 'default',
  },
  {
    id: 'default-motivacao-4',
    question: 'Que tipo de desafio faria voce se sentir motivado aqui?',
    category: 'Motivacao',
    difficulty: 'Facil',
    tips: ['Conecte desafio e vaga', 'Mostre energia para resolver problemas', 'Evite parecer inflexivel'],
    source: 'default',
  },
  {
    id: 'default-motivacao-5',
    question: 'Como voce avalia se uma empresa combina com voce?',
    category: 'Motivacao',
    difficulty: 'Medio',
    tips: ['Fale de cultura e trabalho', 'Mostre criterios maduros', 'Evite respostas apenas pessoais'],
    source: 'default',
  },
  {
    id: 'default-motivacao-6',
    question: 'Por que voce quer sair ou saiu da sua ultima experiencia?',
    category: 'Motivacao',
    difficulty: 'Dificil',
    tips: ['Seja respeitoso', 'Foque em evolucao', 'Nao exponha conflitos desnecessarios'],
    source: 'default',
  },
  {
    id: 'default-motivacao-7',
    question: 'O que faria voce escolher esta empresa entre outras oportunidades?',
    category: 'Motivacao',
    difficulty: 'Dificil',
    tips: ['Mostre criterio', 'Cite pontos reais da empresa', 'Conecte com seu plano profissional'],
    source: 'default',
  },
  {
    id: 'default-comportamental-1',
    question: 'Conte sobre uma vez em que voce precisou resolver um conflito.',
    category: 'Comportamental',
    difficulty: 'Dificil',
    tips: ['Use STAR', 'Mostre escuta', 'Explique o resultado'],
    source: 'default',
  },
  {
    id: 'default-comportamental-2',
    question: 'Descreva uma situacao em que voce teve que aprender algo rapidamente.',
    category: 'Comportamental',
    difficulty: 'Medio',
    tips: ['Mostre metodo de aprendizado', 'Cite aplicacao pratica', 'Destaque resultado'],
    source: 'default',
  },
  {
    id: 'default-comportamental-3',
    question: 'Como voce age quando discorda de uma decisao?',
    category: 'Comportamental',
    difficulty: 'Dificil',
    tips: ['Mostre respeito', 'Explique como argumenta', 'Demonstre maturidade depois da decisao'],
    source: 'default',
  },
  {
    id: 'default-comportamental-4',
    question: 'Conte sobre uma meta dificil que voce conseguiu atingir.',
    category: 'Comportamental',
    difficulty: 'Medio',
    tips: ['Explique a meta', 'Mostre seu plano', 'Traga numeros ou evidencias'],
    source: 'default',
  },
  {
    id: 'default-comportamental-5',
    question: 'Como voce lida com mudancas de prioridade?',
    category: 'Comportamental',
    difficulty: 'Medio',
    tips: ['Mostre adaptabilidade', 'Explique comunicacao', 'Fale de reorganizacao do trabalho'],
    source: 'default',
  },
  {
    id: 'default-comportamental-6',
    question: 'Conte sobre uma vez em que voce tomou iniciativa sem ser solicitado.',
    category: 'Comportamental',
    difficulty: 'Facil',
    tips: ['Mostre contexto', 'Explique por que agiu', 'Destaque impacto'],
    source: 'default',
  },
  {
    id: 'default-comportamental-7',
    question: 'Como voce reage quando recebe uma demanda pouco clara?',
    category: 'Comportamental',
    difficulty: 'Medio',
    tips: ['Fale de perguntas de alinhamento', 'Mostre organizacao', 'Evite assumir sem validar'],
    source: 'default',
  },
  {
    id: 'default-planejamento-1',
    question: 'Quais competencias voce quer fortalecer nos proximos 12 meses?',
    category: 'Planejamento de Carreira',
    difficulty: 'Facil',
    tips: ['Escolha competencias relevantes', 'Mostre plano', 'Conecte com a vaga'],
    source: 'default',
  },
  {
    id: 'default-planejamento-2',
    question: 'Como esta vaga se encaixa no seu plano de carreira?',
    category: 'Planejamento de Carreira',
    difficulty: 'Medio',
    tips: ['Mostre coerencia', 'Fale de contribuicao', 'Evite parecer que a vaga e so ponte'],
    source: 'default',
  },
  {
    id: 'default-planejamento-3',
    question: 'Que tipo de responsabilidade voce quer assumir no futuro?',
    category: 'Planejamento de Carreira',
    difficulty: 'Medio',
    tips: ['Seja realista', 'Mostre ambicao saudavel', 'Conecte com aprendizado'],
    source: 'default',
  },
  {
    id: 'default-planejamento-4',
    question: 'Como voce mede seu proprio crescimento profissional?',
    category: 'Planejamento de Carreira',
    difficulty: 'Medio',
    tips: ['Cite indicadores', 'Inclua feedback e entregas', 'Mostre evolucao continua'],
    source: 'default',
  },
  {
    id: 'default-planejamento-5',
    question: 'Qual seria seu plano para os primeiros 90 dias nesta posicao?',
    category: 'Planejamento de Carreira',
    difficulty: 'Dificil',
    tips: ['Divida em aprender, contribuir e alinhar', 'Mostre proatividade', 'Nao prometa sem contexto'],
    source: 'default',
  },
  {
    id: 'default-planejamento-6',
    question: 'Que tipo de lideranca ou mentoria ajuda voce a crescer?',
    category: 'Planejamento de Carreira',
    difficulty: 'Facil',
    tips: ['Mostre autoconhecimento', 'Fale de feedback', 'Evite exigencias rigidas'],
    source: 'default',
  },
  {
    id: 'default-planejamento-7',
    question: 'Como voce se prepara para oportunidades maiores?',
    category: 'Planejamento de Carreira',
    difficulty: 'Medio',
    tips: ['Fale de aprendizado continuo', 'Mostre entregas atuais', 'Cite desenvolvimento de habilidades'],
    source: 'default',
  },
];

const InterviewPrep = ({
  mode = 'client',
  targetUserId,
  targetUserName,
}: InterviewPrepProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [adminQuestions, setAdminQuestions] = useState<Question[]>([]);
  const [loadingAdminQuestions, setLoadingAdminQuestions] = useState(false);
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [adminQuestionForm, setAdminQuestionForm] = useState({
    question: '',
    category: 'Comportamental',
    difficulty: 'Medio' as Question['difficulty'],
    tips: '',
  });

  const activeTargetUserId = mode === 'admin' ? targetUserId ?? null : user?.id ?? null;

  const loadAdminQuestions = useCallback(async () => {
    if (!activeTargetUserId) {
      setAdminQuestions([]);
      return;
    }

    setLoadingAdminQuestions(true);
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('id, question, category, difficulty, tips')
        .eq('target_user_id', activeTargetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const normalized = (data ?? []).map((item) => ({
        id: item.id,
        question: item.question,
        category: item.category,
        difficulty: (item.difficulty as Question['difficulty']) || 'Medio',
        tips: Array.isArray(item.tips) ? item.tips.map((tip) => String(tip)) : [],
        source: 'admin' as const,
      }));

      setAdminQuestions(normalized);
    } catch (error) {
      console.error('[INTERVIEW_PREP] Failed to load admin questions', error);
      setAdminQuestions([]);
      if (mode === 'admin' || user) {
        toast({
          title: 'Erro ao carregar perguntas',
          description: 'Nao foi possivel carregar as perguntas personalizadas.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoadingAdminQuestions(false);
    }
  }, [activeTargetUserId, mode, toast, user]);

  useEffect(() => {
    loadAdminQuestions();
  }, [loadAdminQuestions]);

  const questions = useMemo(() => [...defaultQuestions, ...additionalDefaultQuestions, ...adminQuestions], [adminQuestions]);
  const categories = useMemo(() => Array.from(new Set(questions.map((question) => question.category))), [questions]);

  const filteredQuestions =
    selectedCategory === 'all'
      ? questions
      : questions.filter((question) => question.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentQuestion(null);
    setIsRecording(false);
  };

  const getRandomQuestion = () => {
    const availableQuestions = filteredQuestions.filter((question) => !answeredQuestions.includes(question.id));
    if (availableQuestions.length === 0) {
      toast({
        title: 'Tudo praticado',
        description: 'Voce ja praticou todas as perguntas dessa categoria.',
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  };

  const markAsAnswered = () => {
    if (!currentQuestion) return;

    setAnsweredQuestions((current) => [...current, currentQuestion.id]);
    setCurrentQuestion(null);
    toast({
      title: 'Pergunta concluida',
      description: 'Continue praticando para fortalecer sua entrevista.',
    });
  };

  const toggleRecording = () => {
    setIsRecording((current) => !current);
    toast({
      title: isRecording ? 'Gravacao finalizada' : 'Gravacao iniciada',
      description: isRecording
        ? 'Sua resposta foi encerrada.'
        : 'Responda a pergunta e pare a gravacao quando terminar.',
    });
  };

  const sendQuestionToClient = async () => {
    if (!user || !targetUserId || !adminQuestionForm.question.trim()) {
      toast({
        title: 'Dados incompletos',
        description: 'Escolha um cliente e escreva uma pergunta antes de enviar.',
        variant: 'destructive',
      });
      return;
    }

    setSendingQuestion(true);
    try {
      const tips = adminQuestionForm.tips
        .split('\n')
        .map((tip) => tip.trim())
        .filter(Boolean);

      const { error } = await supabase.from('interview_questions').insert({
        created_by: user.id,
        target_user_id: targetUserId,
        question: adminQuestionForm.question.trim(),
        category: adminQuestionForm.category,
        difficulty: adminQuestionForm.difficulty,
        tips,
      });

      if (error) throw error;

      setAdminQuestionForm({
        question: '',
        category: 'Comportamental',
        difficulty: 'Medio',
        tips: '',
      });

      toast({
        title: 'Pergunta enviada',
        description: `A pergunta foi enviada para ${targetUserName || 'o cliente'}.`,
      });

      await loadAdminQuestions();
    } catch (error) {
      console.error('[INTERVIEW_PREP] Failed to send question', error);
      toast({
        title: 'Erro ao enviar pergunta',
        description: 'Nao foi possivel salvar a pergunta personalizada.',
        variant: 'destructive',
      });
    } finally {
      setSendingQuestion(false);
    }
  };

  const filteredAnsweredQuestions = filteredQuestions.filter((question) => answeredQuestions.includes(question.id));
  const filteredAnsweredCount = filteredAnsweredQuestions.length;
  const progress = filteredQuestions.length > 0 ? (filteredAnsweredCount / filteredQuestions.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Preparacao para Entrevistas
          </h2>
          <p className="text-muted-foreground">
            {mode === 'admin'
              ? 'Gerencie perguntas, acompanhe a pratica e envie desafios personalizados ao cliente.'
              : 'Pratique com perguntas padrao e com desafios enviados pelo administrador.'}
          </p>
        </div>

        {mode === 'admin' && (
          <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/15">
            <Shield className="mr-2 h-4 w-4" />
            {targetUserName ? `Cliente selecionado: ${targetUserName}` : 'Selecione um cliente no painel admin'}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className={`grid h-auto w-full gap-2 rounded-2xl bg-muted/60 p-2 ${mode === 'admin' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
          <TabsTrigger value="practice">Praticar</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          {mode === 'admin' && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Simulacao de Entrevista</span>
              </CardTitle>
              <CardDescription>
                Escolha uma categoria e gere uma nova pergunta para treinar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="md:w-[320px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={getRandomQuestion} className="flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>Nova Pergunta</span>
                </Button>
              </div>

              {loadingAdminQuestions && (
                <p className="text-sm text-muted-foreground">Carregando perguntas personalizadas...</p>
              )}

              {currentQuestion && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{currentQuestion.category}</Badge>
                        <Badge
                          variant={
                            currentQuestion.difficulty === 'Facil'
                              ? 'default'
                              : currentQuestion.difficulty === 'Medio'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {currentQuestion.difficulty}
                        </Badge>
                        {currentQuestion.source === 'admin' && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Pergunta do Admin</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-lg font-medium">{currentQuestion.question}</div>

                    {currentQuestion.tips.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span>Dicas para uma boa resposta:</span>
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {currentQuestion.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-primary">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={toggleRecording}
                        variant={isRecording ? 'destructive' : 'default'}
                        className="flex items-center space-x-2"
                      >
                        <div className={`h-3 w-3 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
                        <span>{isRecording ? 'Parar Gravacao' : 'Gravar Resposta'}</span>
                      </Button>
                      <Button onClick={markAsAnswered} variant="outline" className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Marcar como Respondida</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Antes da Entrevista',
                items: ['Pesquise a empresa', 'Prepare perguntas', 'Revise o contexto da vaga', 'Teste equipamentos'],
              },
              {
                title: 'Durante a Entrevista',
                items: ['Seja claro', 'Use exemplos reais', 'Mantenha foco', 'Demonstre interesse'],
              },
              {
                title: 'Apos a Entrevista',
                items: ['Registre aprendizados', 'Envie agradecimento', 'Revise pontos fortes', 'Continue praticando'],
              },
              {
                title: 'Comunicacao',
                items: ['Mantenha postura segura', 'Organize respostas', 'Evite respostas vagas', 'Conclua com impacto'],
              },
            ].map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {section.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Seu Progresso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Perguntas praticadas: {filteredAnsweredCount} / {filteredQuestions.length}
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{filteredAnsweredCount}</div>
                    <div className="text-sm text-muted-foreground">Respondidas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.max(filteredQuestions.length - filteredAnsweredCount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Restantes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                    <div className="text-sm text-muted-foreground">Categorias</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {mode === 'admin' && (
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Enviar pergunta ao cliente
                </CardTitle>
                <CardDescription>
                  Crie perguntas personalizadas que aparecerao para o cliente na tela de entrevistas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!targetUserId ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Selecione um cliente na area administrativa para liberar o envio de perguntas.
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Cliente atual</Label>
                      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium">
                        {targetUserName || targetUserId}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-question">Pergunta</Label>
                      <Textarea
                        id="admin-question"
                        value={adminQuestionForm.question}
                        onChange={(event) =>
                          setAdminQuestionForm((current) => ({ ...current, question: event.target.value }))
                        }
                        className="min-h-[120px]"
                        placeholder="Digite a pergunta que o cliente deve praticar..."
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Input
                          value={adminQuestionForm.category}
                          onChange={(event) =>
                            setAdminQuestionForm((current) => ({ ...current, category: event.target.value }))
                          }
                          placeholder="Ex: Lideranca, Tecnica, Produto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Dificuldade</Label>
                        <Select
                          value={adminQuestionForm.difficulty}
                          onValueChange={(value) =>
                            setAdminQuestionForm((current) => ({
                              ...current,
                              difficulty: value as Question['difficulty'],
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Facil">Facil</SelectItem>
                            <SelectItem value="Medio">Medio</SelectItem>
                            <SelectItem value="Dificil">Dificil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-tips">Dicas de resposta</Label>
                      <Textarea
                        id="admin-tips"
                        value={adminQuestionForm.tips}
                        onChange={(event) =>
                          setAdminQuestionForm((current) => ({ ...current, tips: event.target.value }))
                        }
                        placeholder="Uma dica por linha para orientar o cliente."
                      />
                    </div>

                    <Button onClick={sendQuestionToClient} disabled={sendingQuestion}>
                      <Send className="mr-2 h-4 w-4" />
                      {sendingQuestion ? 'Enviando...' : 'Enviar pergunta'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perguntas ja enviadas</CardTitle>
                <CardDescription>
                  Historico das perguntas personalizadas cadastradas para o cliente selecionado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {adminQuestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Nenhuma pergunta personalizada foi enviada ainda.
                  </div>
                ) : (
                  adminQuestions.map((question) => (
                    <div key={question.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary">{question.category}</Badge>
                        <Badge variant="outline">{question.difficulty}</Badge>
                      </div>
                      <p className="font-medium">{question.question}</p>
                      {question.tips.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                          {question.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
