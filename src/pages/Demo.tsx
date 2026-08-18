import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, FileText, MessageSquare, TrendingUp, CheckCircle, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";

const Demo = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeDemo, setActiveDemo] = useState<'resume' | 'interview' | 'skills'>('resume');
  const [showVideo, setShowVideo] = useState(false);

  const demoFeatures = {
    resume: {
      icon: FileText,
      title: t('demo.resume.title'),
      description: t('demo.resume.desc'),
      steps: [
        t('demo.resume.step1'),
        t('demo.resume.step2'),
        t('demo.resume.step3'),
        t('demo.resume.step4')
      ],
      stats: [
        { label: t('demo.resume.stat1'), value: "0%" },
        { label: t('demo.resume.stat2'), value: "2 min" },
        { label: t('demo.resume.stat3'), value: "0" }
      ],
      videoId: "dQw4w9WgXcQ" // Example YouTube video ID
    },
    interview: {
      icon: MessageSquare,
      title: t('demo.interview.title'),
      description: t('demo.interview.desc'),
      steps: [
        t('demo.interview.step1'),
        t('demo.interview.step2'),
        t('demo.interview.step3'),
        t('demo.interview.step4')
      ],
      stats: [
        { label: t('demo.interview.stat1'), value: "0%" },
        { label: t('demo.interview.stat2'), value: "0" },
        { label: t('demo.interview.stat3'), value: "0%" }
      ],
      videoId: "ScMzIvxBSi4" // Example YouTube video ID
    },
    skills: {
      icon: TrendingUp,
      title: t('demo.skills.title'),
      description: t('demo.skills.desc'),
      steps: [
        t('demo.skills.step1'),
        t('demo.skills.step2'),
        t('demo.skills.step3'),
        t('demo.skills.step4')
      ],
      stats: [
        { label: t('demo.skills.stat1'), value: "0" },
        { label: t('demo.skills.stat2'), value: "0" },
        { label: t('demo.skills.stat3'), value: "0%" }
      ],
      videoId: "9bZkp7q19f0" // Example YouTube video ID
    }
  };

  const currentDemo = demoFeatures[activeDemo];
  const Icon = currentDemo.icon;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="gap-2 hover-scale"
              >
                <ArrowLeft className="h-5 w-5" />
                {t('dashboard.backHome')}
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('demo.title')}
              </h1>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-primary hover:opacity-90"
              >
                {t('hero.getStarted')}
              </Button>
            </div>
          </div>
        </header>

        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t('demo.hero')}
                <span className="bg-gradient-primary bg-clip-text text-transparent">{t('demo.heroHighlight')}</span>
                {t('demo.heroEnd')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('demo.heroDesc')}
              </p>
            </div>

            {/* Demo Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {(Object.keys(demoFeatures) as Array<keyof typeof demoFeatures>).map((key) => {
                const feature = demoFeatures[key];
                const FeatureIcon = feature.icon;
                return (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-300 hover-scale ${
                      activeDemo === key ? 'border-primary shadow-glow' : ''
                    }`}
                    onClick={() => setActiveDemo(key)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          activeDemo === key ? 'bg-gradient-primary' : 'bg-muted'
                        }`}>
                          <FeatureIcon className={`h-6 w-6 ${
                            activeDemo === key ? 'text-white' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Demo Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Demo Video/Preview */}
              <Card className="overflow-hidden animate-fade-in">
                <CardContent className="p-0">
                  {showVideo ? (
                    <div className="relative aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${currentDemo.videoId}?autoplay=1`}
                        title="Demo Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer"
                         onClick={() => setShowVideo(true)}>
                      <div className="absolute inset-0 bg-grid-white/10" />
                      <Button
                        size="lg"
                        className="relative z-10 bg-gradient-primary hover:opacity-90 shadow-glow gap-2"
                      >
                        <Play className="h-5 w-5" />
                        {t('demo.watchDemo')}
                      </Button>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gradient-primary">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{currentDemo.title}</h3>
                        <p className="text-muted-foreground">{currentDemo.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Steps */}
              <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>{t('demo.howItWorks')}</CardTitle>
                  <CardDescription>{t('demo.stepByStep')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentDemo.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                          {index + 1}
                        </div>
                        <p className="text-foreground pt-1 transition-all duration-300 group-hover:translate-x-2">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {currentDemo.stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center animate-fade-in hover-scale"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-6 text-center">
                <h3 className="text-3xl font-bold mb-4">
                  {t('demo.cta.title')}
                </h3>
                <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t('demo.cta.desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 shadow-nexus text-lg px-8 h-auto py-3"
                    onClick={() => navigate('/auth')}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {t('demo.cta.start')}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 h-auto py-3"
                    onClick={() => navigate('/')}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    {t('demo.cta.learn')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Demo;