import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, MessageSquare, Search, TrendingUp, Users, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const comingSoon = {
    pt: 'estara disponivel em breve. Cadastre-se para ser notificado.',
    en: 'will be available soon. Sign up to be notified.',
    es: 'estara disponible pronto. Registrate para recibir una notificacion.',
  } as const;

  const features = [
    { icon: FileText, title: t('features.resume.title'), description: t('features.resume.desc'), action: t('features.resume.action') },
    { icon: MessageSquare, title: t('features.interview.title'), description: t('features.interview.desc'), action: t('features.interview.action') },
    { icon: Search, title: t('features.jobs.title'), description: t('features.jobs.desc'), action: t('features.jobs.action') },
    { icon: TrendingUp, title: t('features.skills.title'), description: t('features.skills.desc'), action: t('features.skills.action') },
    { icon: Users, title: t('features.networking.title'), description: t('features.networking.desc'), action: t('features.networking.action') },
    { icon: Zap, title: t('features.mentoring.title'), description: t('features.mentoring.desc'), action: t('features.mentoring.action') },
  ];

  const handleFeatureClick = (featureTitle: string, action: string) => {
    const suffix = comingSoon[language as keyof typeof comingSoon] ?? comingSoon.en;

    toast({
      title: featureTitle,
      description: `${action} ${suffix}`,
      duration: 3000,
    });
  };

  return (
    <section id="recursos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
            <span className="bg-gradient-primary bg-clip-text text-transparent">{t('features.titleHighlight')}</span>
            {t('features.titleEnd')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group hover:shadow-nexus transition-all duration-500 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-primary w-fit group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    onClick={() => handleFeatureClick(feature.title, feature.action)}
                  >
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-nexus text-lg px-8 py-3 h-auto transition-all duration-300 transform hover:scale-105 hover:shadow-glow animate-pulse-glow"
            onClick={() => handleFeatureClick(t('features.cta'), t('features.cta'))}
          >
            {t('features.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
