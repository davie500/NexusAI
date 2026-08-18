import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  source: string;
  url: string;
  postedDate: string;
}

const JobSearch = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Brasil');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, digite o que você procura"
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('job-search', {
        body: { searchTerm, location }
      });

      if (error) throw error;

      if (data.success) {
        setJobs(data.jobs);
        toast({
          title: "Busca concluída!",
          description: `${data.total} vagas encontradas`
        });
      } else {
        throw new Error(data.error || 'Erro ao buscar vagas');
      }
    } catch (error: any) {
      console.error('Erro na busca:', error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar vagas",
        description: error.message || "Tente novamente mais tarde"
      });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-primary/20 shadow-nexus">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Briefcase className="h-6 w-6 text-primary" />
            <span>Busca Inteligente de Vagas</span>
          </CardTitle>
          <CardDescription>
            Encontre oportunidades reais de emprego no Brasil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Ex: Desenvolvedor, Designer, Analista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12"
              />
            </div>
            <div>
              <Input
                placeholder="Localização"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-12"
              />
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Buscando vagas...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Buscar Vagas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {jobs.length > 0 ? `${jobs.length} vagas encontradas` : 'Nenhuma vaga encontrada'}
            </h3>
          </div>

          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-glow cursor-pointer group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {job.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {job.source}
                      </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground font-medium">
                      {job.company}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(job.url, '_blank')}
                    className="group-hover:bg-primary group-hover:text-white transition-all"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver vaga
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(job.postedDate)}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {job.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Requisitos:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Badge className="bg-primary/10 text-primary">
                  {job.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
