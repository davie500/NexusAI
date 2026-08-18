import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Target, Lightbulb, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const startJourneyDescriptions = {
    pt: "Clique em 'Cadastrar' no menu para criar sua conta e comecar a usar o NexusAI.",
    en: "Click 'Sign Up' in the menu to create your account and start using NexusAI.",
    es: "Haz clic en 'Registrarse' en el menu para crear tu cuenta y empezar a usar NexusAI.",
  } as const;

  const handleStartJourney = () => {
    toast({
      title: t('about.cta'),
      description: startJourneyDescriptions[language as keyof typeof startJourneyDescriptions] ?? startJourneyDescriptions.en,
      duration: 5000,
    });
  };

  return (
    <section id="sobre" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('about.title')}
            <span className="bg-gradient-primary bg-clip-text text-transparent">{t('about.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">{t('about.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group hover:bg-muted/50 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{t('about.data.title')}</h3>
                  <p className="text-muted-foreground">{t('about.data.desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:bg-muted/50 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors duration-300">
                  <Target className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{t('about.focus.title')}</h3>
                  <p className="text-muted-foreground">{t('about.focus.desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:bg-muted/50 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{t('about.learning.title')}</h3>
                  <p className="text-muted-foreground">{t('about.learning.desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:bg-muted/50 p-4 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors duration-300">
                  <Heart className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{t('about.support.title')}</h3>
                  <p className="text-muted-foreground">{t('about.support.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-primary text-white border-0 hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-2 group-hover:scale-100 transition-transform duration-300">0</div>
                <div className="text-white/90 mb-4">{t('about.stat1')}</div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                    IA
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                    Results
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary text-white border-0 hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="text-3xl font-bold mb-2 group-hover:scale-100 transition-transform duration-300">0%</div>
                <div className="text-white/90 mb-4">{t('about.stat2')}</div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                    Interview
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30 transition-colors">
                    Growth
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-nexus text-lg px-8 py-3 h-auto transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
            onClick={handleStartJourney}
          >
            {t('about.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
