import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Compass, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_28%),hsl(var(--background))]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <Card className="w-full max-w-3xl overflow-hidden border-primary/20 bg-background/80 shadow-2xl backdrop-blur-xl">
          <CardContent className="grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Pagina nao encontrada
              </div>

              <div className="space-y-4">
                <p className="text-6xl font-semibold tracking-tight text-primary md:text-7xl">404</p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esse caminho nao existe no NexusAI
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                  A rota <span className="font-medium text-foreground">{location.pathname}</span> nao foi encontrada.
                  Voce pode voltar para a pagina inicial, ir ao seu dashboard ou continuar navegando a partir de um ponto seguro.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  Ir para o inicio
                </Button>
                {user && (
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    <Compass className="mr-2 h-4 w-4" />
                    Abrir dashboard
                  </Button>
                )}
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Sugestoes</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="font-medium">Confira o endereco digitado</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Um caractere fora do lugar ja pode levar para uma rota inexistente.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <p className="font-medium">Use os atalhos da plataforma</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Navegue pela home, dashboard ou configuracoes para voltar ao fluxo certo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-950 px-5 py-4 text-slate-100">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rota solicitada</p>
                <p className="mt-2 break-all font-mono text-sm">{location.pathname}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
