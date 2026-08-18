import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contato" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('contact.title')}
            <span className="bg-gradient-primary bg-clip-text text-transparent">{t('contact.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted-foreground">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">{t('contact.info')}</h3>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.email')}</h4>
                  <p className="text-muted-foreground">contato@nexusai.com.br</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                  <Phone className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.phone')}</h4>
                  <p className="text-muted-foreground">0800 123 4567</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors duration-300">
                  <MapPin className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.address')}</h4>
                  <p className="text-muted-foreground">Sao Paulo, SP - Brasil</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">{t('contact.form.title')}</h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('contact.form.name')}</Label>
                  <Input id="name" placeholder={t('contact.form.namePlaceholder')} className="transition-all duration-300 focus:shadow-glow" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('contact.form.email')}</Label>
                  <Input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} className="transition-all duration-300 focus:shadow-glow" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                <Input id="subject" placeholder={t('contact.form.subjectPlaceholder')} className="transition-all duration-300 focus:shadow-glow" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t('contact.form.message')}</Label>
                <Textarea id="message" placeholder={t('contact.form.messagePlaceholder')} rows={5} className="transition-all duration-300 focus:shadow-glow" />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-nexus transition-all duration-300 transform hover:scale-105 hover:shadow-glow">
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('contact.form.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
