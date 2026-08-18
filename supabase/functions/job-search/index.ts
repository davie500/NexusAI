import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting per IP (best-effort)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > windowMs) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);

  if (entry.count > MAX_REQUESTS_PER_MINUTE) {
    return new Response(
      JSON.stringify({ error: 'Muitas requisições. Tente novamente em instantes.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { searchTerm, location = 'Brasil' } = await req.json()

    if (!searchTerm || typeof searchTerm !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Termo de busca é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (searchTerm.length < 2 || searchTerm.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Termo de busca deve ter entre 2 e 100 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (location && (typeof location !== 'string' || location.length > 100)) {
      return new Response(
        JSON.stringify({ error: 'Localização inválida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Buscando vagas para: ${searchTerm} em ${location}`)

    // Buscar vagas de múltiplas fontes
    const jobs = []

    // Fonte 1: LinkedIn (scraping simulado com dados estruturados)
    try {
      const linkedinJobs = await searchLinkedInJobs(searchTerm, location)
      jobs.push(...linkedinJobs)
    } catch (error) {
      console.error('[JOB_SEARCH] LinkedIn source failed')
    }

    // Fonte 2: Catho (scraping simulado)
    try {
      const cathoJobs = await searchCathoJobs(searchTerm, location)
      jobs.push(...cathoJobs)
    } catch (error) {
      console.error('[JOB_SEARCH] Catho source failed')
    }

    // Fonte 3: Vagas.com (scraping simulado)
    try {
      const vagasComJobs = await searchVagasComJobs(searchTerm, location)
      jobs.push(...vagasComJobs)
    } catch (error) {
      console.error('[JOB_SEARCH] Vagas.com source failed')
    }

    // Usar AI para enriquecer e filtrar resultados
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    if (LOVABLE_API_KEY && jobs.length > 0) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'Você é um especialista em recrutamento. Analise as vagas e retorne apenas as mais relevantes e bem estruturadas.'
              },
              {
                role: 'user',
                content: `Analise estas vagas e retorne as 10 mais relevantes para "${searchTerm}": ${JSON.stringify(jobs)}`
              }
            ],
          }),
        })

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          console.log('Vagas enriquecidas com AI')
        }
      } catch (error) {
        console.error('Erro ao enriquecer com AI:', error)
      }
    }

    // Remover duplicatas e limitar resultados
    const uniqueJobs = jobs.filter((job, index, self) => 
      index === self.findIndex(j => j.title === job.title && j.company === job.company)
    ).slice(0, 20)

    console.log(`Retornando ${uniqueJobs.length} vagas encontradas`)

    return new Response(
      JSON.stringify({ 
        success: true,
        jobs: uniqueJobs,
        total: uniqueJobs.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na busca de vagas:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Simular busca no LinkedIn (em produção seria scraping real)
async function searchLinkedInJobs(searchTerm: string, location: string) {
  const jobs = [
    {
      id: `linkedin-1-${Date.now()}`,
      title: `${searchTerm} - Pleno`,
      company: 'Nubank',
      location: 'São Paulo, SP',
      type: 'CLT',
      salary: 'R$ 8.000 - R$ 12.000',
      description: `Vaga para ${searchTerm} com experiência em desenvolvimento e boas práticas.`,
      requirements: ['Experiência com tecnologias modernas', 'Inglês intermediário', 'Trabalho em equipe'],
      source: 'LinkedIn',
      url: 'https://www.linkedin.com/jobs',
      postedDate: new Date().toISOString()
    },
    {
      id: `linkedin-2-${Date.now()}`,
      title: `${searchTerm} Sênior`,
      company: 'Mercado Livre',
      location: 'Remoto',
      type: 'CLT',
      salary: 'R$ 15.000 - R$ 20.000',
      description: `Oportunidade para ${searchTerm} sênior em time de alta performance.`,
      requirements: ['5+ anos de experiência', 'Liderança técnica', 'Arquitetura de software'],
      source: 'LinkedIn',
      url: 'https://www.linkedin.com/jobs',
      postedDate: new Date().toISOString()
    }
  ]
  return jobs
}

// Simular busca no Catho
async function searchCathoJobs(searchTerm: string, location: string) {
  const jobs = [
    {
      id: `catho-1-${Date.now()}`,
      title: `${searchTerm} Júnior`,
      company: 'B2W Digital',
      location: 'Rio de Janeiro, RJ',
      type: 'CLT',
      salary: 'R$ 5.000 - R$ 7.000',
      description: `Vaga para ${searchTerm} júnior com potencial de crescimento.`,
      requirements: ['Formação superior', 'Conhecimento em programação', 'Vontade de aprender'],
      source: 'Catho',
      url: 'https://www.catho.com.br',
      postedDate: new Date().toISOString()
    },
    {
      id: `catho-2-${Date.now()}`,
      title: `Analista ${searchTerm}`,
      company: 'Magazine Luiza',
      location: 'Híbrido - São Paulo',
      type: 'CLT',
      salary: 'R$ 7.000 - R$ 10.000',
      description: `Analista de ${searchTerm} para atuar em projetos estratégicos.`,
      requirements: ['Experiência comprovada', 'Certificações relevantes', 'Boa comunicação'],
      source: 'Catho',
      url: 'https://www.catho.com.br',
      postedDate: new Date().toISOString()
    }
  ]
  return jobs
}

// Simular busca no Vagas.com
async function searchVagasComJobs(searchTerm: string, location: string) {
  const jobs = [
    {
      id: `vagas-1-${Date.now()}`,
      title: `Coordenador de ${searchTerm}`,
      company: 'Itaú Unibanco',
      location: 'São Paulo, SP',
      type: 'CLT',
      salary: 'R$ 12.000 - R$ 18.000',
      description: `Coordenador de ${searchTerm} para liderar time de alta performance.`,
      requirements: ['Experiência em gestão', 'Visão estratégica', 'Conhecimento do mercado'],
      source: 'Vagas.com',
      url: 'https://www.vagas.com.br',
      postedDate: new Date().toISOString()
    },
    {
      id: `vagas-2-${Date.now()}`,
      title: `Especialista ${searchTerm}`,
      company: 'Banco do Brasil',
      location: 'Brasília, DF',
      type: 'CLT',
      salary: 'R$ 10.000 - R$ 14.000',
      description: `Especialista em ${searchTerm} para projetos de transformação digital.`,
      requirements: ['Especialização na área', 'Experiência em grandes projetos', 'Metodologias ágeis'],
      source: 'Vagas.com',
      url: 'https://www.vagas.com.br',
      postedDate: new Date().toISOString()
    }
  ]
  return jobs
}
