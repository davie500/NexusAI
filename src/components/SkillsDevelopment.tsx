import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Star, Plus, BookOpen, Award, Target, Play, Zap, Trophy, Flame, Minus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  target: number;
  description: string;
  resources: string[];
}

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  skills: string[];
  progress: number;
}

interface SkillActivity {
  id: string;
  skillName: string;
  change: number;
  level: number;
  message: string;
}

const SkillsDevelopment = () => {
  const { toast } = useToast();
  const [xp, setXp] = useState(1240);
  const [streak, setStreak] = useState(7);
  const [activityLog, setActivityLog] = useState<SkillActivity[]>([]);
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'JavaScript',
      category: 'Programação',
      level: 6,
      target: 9,
      description: 'Linguagem de programação essencial para desenvolvimento web',
      resources: ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript']
    },
    {
      id: '2',
      name: 'React',
      category: 'Frontend',
      level: 5,
      target: 8,
      description: 'Biblioteca JavaScript para construção de interfaces',
      resources: ['Documentação Oficial', 'React Tutorial', 'React Patterns']
    },
    {
      id: '3',
      name: 'Comunicação',
      category: 'Soft Skills',
      level: 7,
      target: 9,
      description: 'Habilidade essencial para trabalho em equipe',
      resources: ['Curso de Oratória', 'Livros de Comunicação', 'Prática Diária']
    }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'JavaScript Completo ES6+',
      provider: 'Origamid',
      duration: '40 horas',
      level: 'Intermediário',
      skills: ['JavaScript', 'ES6+', 'DOM'],
      progress: 65
    },
    {
      id: '2',
      title: 'React - The Complete Guide',
      provider: 'Udemy',
      duration: '48 horas',
      level: 'Avançado',
      skills: ['React', 'Redux', 'Hooks'],
      progress: 30
    },
    {
      id: '3',
      title: 'Soft Skills para Desenvolvedores',
      provider: 'Alura',
      duration: '20 horas',
      level: 'Iniciante',
      skills: ['Comunicação', 'Liderança', 'Trabalho em Equipe'],
      progress: 80
    }
  ]);

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 1,
    target: 10,
    description: ''
  });

  const clampLevel = (value: number) => Math.min(Math.max(value, 1), 10);
  const clampSkillLevel = (value: number, target: number) => Math.min(Math.max(value, 0), target);

  const addActivity = (activity: Omit<SkillActivity, 'id'>) => {
    setActivityLog((current) => [
      {
        id: Date.now().toString(),
        ...activity,
      },
      ...current,
    ].slice(0, 5));
  };

  const addSkill = () => {
    if (!newSkill.name || !newSkill.category) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o nome e categoria da habilidade"
      });
      return;
    }

    const level = clampLevel(newSkill.level);
    const target = clampLevel(newSkill.target);
    const skill: Skill = {
      id: Date.now().toString(),
      ...newSkill,
      level: Math.min(level, target),
      target,
      resources: []
    };

    setSkills([...skills, skill]);
    setNewSkill({
      name: '',
      category: '',
      level: 1,
      target: 10,
      description: ''
    });

    toast({
      title: "Habilidade adicionada!",
      description: `${skill.name} foi adicionada ao seu plano de desenvolvimento`
    });
  };

  const updateSkillLevel = (skillId: string, newLevel: number) => {
    const handled = adjustSkillLevel(skillId, newLevel);
    if (handled) return;

    setSkills(skills.map(skill => 
      skill.id === skillId ? { ...skill, level: Math.min(Math.max(newLevel, 0), skill.target) } : skill
    ));
    
    toast({
      title: "Progresso atualizado!",
      description: "Parabéns pelo seu desenvolvimento!"
    });
  };

  const adjustSkillLevel = (skillId: string, newLevel: number) => {
    const skill = skills.find((item) => item.id === skillId);
    if (!skill) return false;

    const nextLevel = clampSkillLevel(newLevel, skill.target);
    if (nextLevel === skill.level) {
      toast({
        title: skill.level >= skill.target ? 'Meta ja atingida' : 'Sem alteracao',
        description: skill.level >= skill.target
          ? `${skill.name} ja esta no nivel definido como meta.`
          : 'O nivel dessa habilidade continua igual.',
      });
      return true;
    }

    const change = nextLevel - skill.level;
    setSkills((current) =>
      current.map((item) => (item.id === skillId ? { ...item, level: nextLevel } : item))
    );

    if (change > 0) {
      setXp((current) => current + change * 25);
      setStreak((current) => Math.max(current, 1));
    }

    addActivity({
      skillName: skill.name,
      change,
      level: nextLevel,
      message: change > 0 ? 'evoluiu' : 'foi ajustada',
    });

    toast({
      title: change > 0 ? 'Progresso atualizado!' : 'Nivel ajustado',
      description: nextLevel >= skill.target
        ? `${skill.name} atingiu a meta ${skill.target}/10.`
        : `${skill.name} agora esta no nivel ${nextLevel}/${skill.target}.`
    });
    return true;
  };

  const continueCourse = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;

    const nextProgress = Math.min(course.progress + 15, 100);
    const completedNow = course.progress < 100 && nextProgress === 100;

    setCourses((current) =>
      current.map((item) => (item.id === courseId ? { ...item, progress: nextProgress } : item))
    );

    setXp((current) => current + (completedNow ? 100 : 35));
    setStreak((current) => Math.max(current, 1));

    const relatedSkill = skills.find((skill) =>
      course.skills.some((courseSkill) => courseSkill.toLowerCase() === skill.name.toLowerCase())
    );

    if (relatedSkill && relatedSkill.level < relatedSkill.target) {
      adjustSkillLevel(relatedSkill.id, relatedSkill.level + 1);
    }

    toast({
      title: completedNow ? 'Curso concluido!' : 'Curso atualizado',
      description: completedNow
        ? `${course.title} foi concluido e voce ganhou bonus de XP.`
        : `${course.title} avancou para ${nextProgress}%.`,
    });
  };

  const getSkillProgress = (skill: Skill) => {
    return skill.target > 0 ? Math.min((skill.level / skill.target) * 100, 100) : 0;
  };

  const getRecommendations = (category: string) => {
    const recommendations = {
      'Programação': [
        'Pratique coding challenges diariamente',
        'Contribua para projetos open source',
        'Implemente projetos pessoais'
      ],
      'Frontend': [
        'Construa interfaces responsivas',
        'Aprenda sobre acessibilidade',
        'Estude design patterns'
      ],
      'Soft Skills': [
        'Participe de apresentações',
        'Pratique feedback construtivo',
        'Desenvolva inteligência emocional'
      ]
    };
    return recommendations[category as keyof typeof recommendations] || [];
  };

  const categories = Array.from(new Set(skills.map(skill => skill.category)));
  const averageProgress = skills.length > 0
    ? Math.round(skills.reduce((total, skill) => total + getSkillProgress(skill), 0) / skills.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Desenvolvimento de Habilidades
          </h2>
          <p className="text-muted-foreground">
            Identifique e desenvolva as habilidades mais demandadas
          </p>
        </div>
        <Card className="border-primary/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 animate-fade-in">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sequência</p>
              <h3 className="text-2xl font-bold text-primary flex items-center space-x-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span>{streak} dias</span>
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pontos XP</p>
              <h3 className="text-2xl font-bold text-primary flex items-center space-x-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>{xp.toLocaleString('pt-BR')}</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-2 lg:grid-cols-4">
          <TabsTrigger value="skills">Minhas Habilidades</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="add">Adicionar</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Card className="border-primary/20 hover-scale cursor-pointer">
              <CardContent className="p-3 text-center">
                <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{skills.length}</p>
                <p className="text-[11px] text-muted-foreground">{averageProgress}% medio</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover-scale cursor-pointer">
              <CardContent className="p-3 text-center">
                <Target className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Dominadas</p>
                <p className="text-lg font-bold">{skills.filter(s => s.level >= s.target).length}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover-scale cursor-pointer">
              <CardContent className="p-3 text-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Em Progresso</p>
                <p className="text-lg font-bold">{skills.filter(s => s.level < s.target && s.level > 0).length}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 hover-scale cursor-pointer">
              <CardContent className="p-3 text-center">
                <BookOpen className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Categorias</p>
                <p className="text-lg font-bold">{categories.length}</p>
              </CardContent>
            </Card>
          </div>

          {activityLog.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Atividade recente</CardTitle>
                <CardDescription>Ultimos ajustes feitos nas suas habilidades</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                    <span>{activity.skillName} {activity.message}</span>
                    <Badge variant={activity.change > 0 ? 'default' : 'outline'}>
                      {activity.change > 0 ? '+' : ''}{activity.change} nivel {activity.level}/10
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.id} className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant="secondary">{skill.category}</Badge>
                  </div>
                  <Badge
                    variant={skill.level >= skill.target ? 'default' : 'outline'}
                    className="w-fit"
                  >
                    {skill.level >= skill.target ? 'Meta concluida' : `${skill.target - skill.level} nivel(is) para a meta`}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Nível Atual: {skill.level}/10
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Meta: {skill.target}/10
                      </span>
                    </div>
                    <Progress value={getSkillProgress(skill)} className="h-2" />
                    <Slider
                      className="mt-4"
                      min={0}
                      max={skill.target}
                      step={1}
                      value={[skill.level]}
                      onValueCommit={(value) => updateSkillLevel(skill.id, value[0] ?? skill.level)}
                    />
                  </div>
                  
                  {skill.description && (
                    <p className="text-sm text-muted-foreground">
                      {skill.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Button
                      size="sm"
                      onClick={() => updateSkillLevel(skill.id, Math.min(skill.level + 1, 10))}
                      disabled={skill.level >= skill.target}
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Evoluir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSkillLevel(skill.id, Math.max(skill.level - 1, 0))}
                      disabled={skill.level <= 0}
                    >
                      <Minus className="h-4 w-4 mr-1" />
                      -1
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateSkillLevel(skill.id, skill.target)}
                      disabled={skill.level >= skill.target}
                      className="col-span-2 sm:col-span-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Meta
                    </Button>
                  </div>

                  {skill.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Recursos:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.resources.slice(0, 2).map((resource, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                        {skill.resources.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{skill.resources.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>{course.title}</span>
                  </CardTitle>
                  <CardDescription>
                    {course.provider} • {course.duration} • {course.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Habilidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => continueCourse(course.id)}
                    disabled={course.progress >= 100}
                  >
                    {course.progress >= 100 ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continuar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Recomendações para {category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getRecommendations(category).map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                  {getRecommendations(category).length === 0 && (
                    <li className="text-sm text-muted-foreground">
                      Defina recursos e proximos passos para esta categoria conforme sua meta.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Adicionar Nova Habilidade</span>
              </CardTitle>
              <CardDescription>
                Defina uma nova habilidade para acompanhar seu desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skillName">Nome da Habilidade</Label>
                  <Input
                    id="skillName"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    placeholder="Ex: Python, Liderança, Design..."
                  />
                </div>
                <div>
                  <Label htmlFor="skillCategory">Categoria</Label>
                  <Input
                    id="skillCategory"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                    placeholder="Ex: Programação, Soft Skills..."
                  />
                </div>
                <div>
                  <Label htmlFor="skillLevel">Nível Atual (1-10)</Label>
                  <Input
                    id="skillLevel"
                    type="number"
                    min="1"
                    max="10"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: clampLevel(parseInt(e.target.value, 10) || 1)})}
                  />
                </div>
                <div>
                  <Label htmlFor="skillTarget">Meta (1-10)</Label>
                  <Input
                    id="skillTarget"
                    type="number"
                    min="1"
                    max="10"
                    value={newSkill.target}
                    onChange={(e) => setNewSkill({...newSkill, target: clampLevel(parseInt(e.target.value, 10) || 10)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="skillDescription">Descrição (opcional)</Label>
                <Input
                  id="skillDescription"
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="Breve descrição da habilidade..."
                />
              </div>
              <Button onClick={addSkill} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Habilidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillsDevelopment;
