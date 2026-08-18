import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, FileText, Download, Linkedin, Github, Mail, Phone, MapPin, Award, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  course: string;
  period: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

const ResumeBuilder = () => {
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: ''
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: '',
      position: '',
      period: '',
      description: ''
    }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      institution: '',
      course: '',
      period: ''
    }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
    }]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const addLanguage = () => {
    setLanguages([...languages, {
      id: Date.now().toString(),
      name: '',
      level: 'Básico'
    }]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const generateResume = () => {
    try {
    const doc = new jsPDF();
    let yPos = 20;

    // Header - Personal Info
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(personalInfo.name || 'Seu Nome', 20, yPos);
    yPos += 10;

    // Contact Info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    let contactLine = '';
    if (personalInfo.email) contactLine += `${personalInfo.email}`;
    if (personalInfo.phone) contactLine += ` | ${personalInfo.phone}`;
    if (personalInfo.address) contactLine += ` | ${personalInfo.address}`;
    if (contactLine) {
      doc.text(contactLine, 20, yPos);
      yPos += 5;
    }
    
    let socialLine = '';
    if (personalInfo.linkedin) socialLine += `LinkedIn: ${personalInfo.linkedin}`;
    if (personalInfo.github) socialLine += ` | GitHub: ${personalInfo.github}`;
    if (personalInfo.portfolio) socialLine += ` | Portfolio: ${personalInfo.portfolio}`;
    if (socialLine) {
      doc.text(socialLine, 20, yPos);
      yPos += 5;
    }
    
    yPos += 5;
    doc.setTextColor(0, 0, 0);

    // Summary
    if (personalInfo.summary) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO PROFISSIONAL', 20, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
      doc.text(summaryLines, 20, yPos);
      yPos += summaryLines.length * 5 + 8;
    }

    // Experience
    if (experiences.length > 0) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIÊNCIA PROFISSIONAL', 20, yPos);
      yPos += 7;
      
      experiences.forEach(exp => {
        if (yPos > 265) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.position, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`${exp.company} | ${exp.period}`, 20, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, 170);
          doc.text(descLines, 20, yPos);
          yPos += descLines.length * 4.5 + 5;
        }
      });
      yPos += 3;
    }

    // Education
    if (education.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FORMAÇÃO ACADÊMICA', 20, yPos);
      yPos += 7;
      
      education.forEach(edu => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.course, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(`${edu.institution} | ${edu.period}`, 20, yPos);
        yPos += 8;
      });
    }

    // Skills
    if (skills.length > 0) {
      if (yPos > 255) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('HABILIDADES', 20, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const skillsText = skills.join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, yPos);
      yPos += skillsLines.length * 5 + 8;
    }

    // Certifications
    if (certifications.length > 0) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('CERTIFICAÇÕES', 20, yPos);
      yPos += 7;
      
      certifications.forEach(cert => {
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(cert.name, 20, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        doc.text(`${cert.issuer} - ${cert.date}`, 20, yPos);
        yPos += 6;
      });
      yPos += 2;
    }

    // Languages
    if (languages.length > 0) {
      if (yPos > 265) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('IDIOMAS', 20, yPos);
      yPos += 7;
      
      languages.forEach(lang => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${lang.name}: ${lang.level}`, 20, yPos);
        yPos += 5;
      });
    }

    const safeName = personalInfo.name
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

    const fileName = safeName ?
      `curriculo_${safeName}.pdf` :
      'curriculo.pdf';
    
    doc.save(fileName);
    
    toast({
      title: "PDF gerado com sucesso!",
      description: "Seu currículo foi baixado no seu computador."
    });
    } catch (error) {
      console.error('[RESUME_BUILDER] Failed to generate PDF', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar PDF',
        description: 'Nao foi possivel baixar o curriculo. Tente novamente.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Construtor de Currículo Inteligente
          </h2>
          <p className="text-muted-foreground">
            Crie um currículo profissional otimizado com IA
          </p>
        </div>
        <Button 
          onClick={generateResume} 
          className="w-full sm:w-auto flex items-center space-x-2 bg-gradient-primary hover:opacity-90 shadow-nexus hover:shadow-glow transition-all hover-scale"
          size="lg"
        >
          <Download className="h-5 w-5" />
          <span>Gerar PDF</span>
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-2 sm:grid-cols-3 xl:grid-cols-6">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="experience">Experiência</TabsTrigger>
          <TabsTrigger value="education">Educação</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="certifications">Certificados</TabsTrigger>
          <TabsTrigger value="languages">Idiomas</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <CardDescription>
                Suas informações de contato e apresentação profissional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                    placeholder="João da Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>E-mail *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Telefone</span>
                  </Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Endereço</span>
                  </Label>
                  <Input
                    id="address"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                    placeholder="Cidade, Estado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center space-x-1">
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </Label>
                  <Input
                    id="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                    placeholder="linkedin.com/in/seuperfil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center space-x-1">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Label>
                  <Input
                    id="github"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                    placeholder="github.com/seuperfil"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="portfolio" className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>Portfolio / Website</span>
                  </Label>
                  <Input
                    id="portfolio"
                    value={personalInfo.portfolio}
                    onChange={(e) => setPersonalInfo({...personalInfo, portfolio: e.target.value})}
                    placeholder="www.seusite.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumo Profissional</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                  placeholder="Descreva sua experiência, objetivos e principais qualificações..."
                  rows={5}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Experiência Profissional</CardTitle>
                  <CardDescription>Adicione suas experiências de trabalho</CardDescription>
                </div>
                <Button onClick={addExperience} size="sm" className="hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma experiência adicionada ainda.</p>
                  <p className="text-sm">Clique em "Adicionar" para começar.</p>
                </div>
              ) : (
                experiences.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Experiência {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeExperience(exp.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Nome da empresa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Seu cargo"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Período</Label>
                        <Input
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                          placeholder="Ex: Janeiro 2020 - Dezembro 2022"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição das Atividades</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Descreva suas principais responsabilidades, conquistas e resultados..."
                        rows={4}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Formação Acadêmica</CardTitle>
                  <CardDescription>Adicione sua formação educacional</CardDescription>
                </div>
                <Button onClick={addEducation} size="sm" className="hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma formação adicionada ainda.</p>
                  <p className="text-sm">Clique em "Adicionar" para começar.</p>
                </div>
              ) : (
                education.map((edu, index) => (
                  <div key={edu.id} className="space-y-4 p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Formação {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEducation(edu.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Instituição</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Nome da instituição"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Curso</Label>
                        <Input
                          value={edu.course}
                          onChange={(e) => updateEducation(edu.id, 'course', e.target.value)}
                          placeholder="Nome do curso"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Período</Label>
                        <Input
                          value={edu.period}
                          onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                          placeholder="Ex: 2018 - 2022"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <CardTitle>Habilidades Técnicas e Competências</CardTitle>
              <CardDescription>
                Adicione suas habilidades, tecnologias e ferramentas que domina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Digite uma habilidade..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} size="sm" className="hover-scale">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="flex items-center space-x-2 px-3 py-1 text-sm hover-scale cursor-pointer hover:bg-primary/20"
                    >
                      <span>{skill}</span>
                      <button 
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma habilidade adicionada ainda.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificações</span>
                  </CardTitle>
                  <CardDescription>Adicione seus certificados e cursos</CardDescription>
                </div>
                <Button onClick={addCertification} size="sm" className="hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma certificação adicionada ainda.</p>
                  <p className="text-sm">Clique em "Adicionar" para começar.</p>
                </div>
              ) : (
                certifications.map((cert, index) => (
                  <div key={cert.id} className="space-y-4 p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Certificado {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeCertification(cert.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Nome da Certificação</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          placeholder="Ex: AWS Certified Solutions Architect"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Emissor</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                          placeholder="Ex: Amazon Web Services"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <Label>Data</Label>
                        <Input
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                          placeholder="Ex: Janeiro 2023"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages">
          <Card className="border-primary/20 shadow-nexus animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Idiomas</CardTitle>
                  <CardDescription>Adicione os idiomas que você domina</CardDescription>
                </div>
                <Button onClick={addLanguage} size="sm" className="hover-scale">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {languages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum idioma adicionado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar" para começar.</p>
                </div>
              ) : (
                languages.map((lang, index) => (
                  <div key={lang.id} className="space-y-4 p-4 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Idioma {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeLanguage(lang.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Input
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          placeholder="Ex: Inglês"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nível</Label>
                        <Input
                          value={lang.level}
                          onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                          placeholder="Ex: Avançado, Fluente, Intermediário"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
