import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language, t } = useLanguage();

  const copy = {
    pt: {
      description: 'Transformando o futuro profissional de jovens brasileiros atraves da inteligencia artificial e orientacao personalizada.',
      resources: 'Recursos',
      support: 'Suporte',
      helpCenter: 'Central de Ajuda',
      tutorials: 'Tutoriais',
      faq: 'FAQ',
      contact: 'Contato',
      newsletterTitle: 'Receba Dicas de Carreira',
      newsletterDesc: 'Cadastre-se e receba semanalmente dicas exclusivas para acelerar sua carreira.',
      emailPlaceholder: 'Seu melhor e-mail',
      subscribe: 'Inscrever',
      rights: '© 2024 NexusAI. Todos os direitos reservados.',
      privacy: 'Privacidade',
      terms: 'Termos de Uso',
      cookies: 'Cookies',
    },
    en: {
      description: 'Transforming the professional future of young talent through artificial intelligence and personalized guidance.',
      resources: 'Resources',
      support: 'Support',
      helpCenter: 'Help Center',
      tutorials: 'Tutorials',
      faq: 'FAQ',
      contact: 'Contact',
      newsletterTitle: 'Get Career Tips',
      newsletterDesc: 'Subscribe to receive weekly tips to accelerate your career.',
      emailPlaceholder: 'Your best email',
      subscribe: 'Subscribe',
      rights: '© 2024 NexusAI. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms of Use',
      cookies: 'Cookies',
    },
    es: {
      description: 'Transformando el futuro profesional de jovenes talentos a traves de inteligencia artificial y orientacion personalizada.',
      resources: 'Recursos',
      support: 'Soporte',
      helpCenter: 'Centro de Ayuda',
      tutorials: 'Tutoriales',
      faq: 'FAQ',
      contact: 'Contacto',
      newsletterTitle: 'Recibe Consejos de Carrera',
      newsletterDesc: 'Suscribete para recibir semanalmente consejos exclusivos para acelerar tu carrera.',
      emailPlaceholder: 'Tu mejor correo',
      subscribe: 'Suscribirse',
      rights: '© 2024 NexusAI. Todos los derechos reservados.',
      privacy: 'Privacidad',
      terms: 'Terminos de Uso',
      cookies: 'Cookies',
    },
  } as const;

  const text = copy[language as keyof typeof copy] ?? copy.en;

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">NexusAI</span>
            </div>
            <p className="text-background/80 mb-6 max-w-md">{text.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{text.resources}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-all duration-300 hover:translate-x-1 inline-block">{t('features.resume.title')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-all duration-300 hover:translate-x-1 inline-block">{t('features.interview.title')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-all duration-300 hover:translate-x-1 inline-block">{t('features.jobs.title')}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-all duration-300 hover:translate-x-1 inline-block">{t('features.skills.title')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{text.support}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">{text.helpCenter}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">{text.tutorials}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">{text.faq}</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">{text.contact}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-4">{text.newsletterTitle}</h3>
            <p className="text-background/80 mb-4 text-sm">{text.newsletterDesc}</p>
            <div className="flex gap-2">
              <Input placeholder={text.emailPlaceholder} className="bg-background/10 border-background/20 text-background placeholder:text-background/50 transition-all duration-300 focus:bg-background/20 focus:border-background/40" />
              <Button className="bg-gradient-primary hover:opacity-90 px-6 transition-all duration-300 transform hover:scale-105">
                {text.subscribe}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/60 text-sm mb-4 md:mb-0">{text.rights}</p>
          <div className="flex space-x-6">
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">{text.privacy}</a>
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">{text.terms}</a>
            <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">{text.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
