import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/RouterContext";
import {
  ArrowRight,
  Bot,
  Code2,
  Cpu,
  Download,
  Globe,
  Headphones,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export function HomePage() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Backgrounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/generated/hero-background.dim_1600x900.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* Floating glows */}
        <div
          className="absolute top-20 left-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl animate-pulse-glow pointer-events-none"
          style={{ background: "oklch(0.56 0.22 278)" }}
        />
        <div
          className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full opacity-15 blur-3xl animate-pulse-glow pointer-events-none"
          style={{ background: "oklch(0.72 0.18 195)", animationDelay: "1.5s" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-4 text-sm font-medium text-primary animate-fade-in">
            <Zap className="h-3.5 w-3.5" />
            Marketplace de Automações
          </div>

          {/* LuidCorporation label */}
          <div
            className="flex justify-center mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Uma divisão da{" "}
              <span className="text-primary font-semibold tracking-wide">
                LuidCorporation
              </span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-5xl md:text-7xl leading-[0.9] tracking-tight mb-6 animate-slide-up">
            <span className="block text-foreground">LuidDeveloper</span>
            <span className="block text-gradient">Platform</span>
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto mb-4 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            O marketplace definitivo para bots, scripts e automações
          </p>
          <p
            className="text-base text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Descubra, compre e implante ferramentas poderosas de automação em
            minutos.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              data-ocid="hero.explore_button"
              size="lg"
              onClick={() => navigate("marketplace")}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-violet-sm"
            >
              <Zap className="mr-2 h-4 w-4" />
              Explorar Scripts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              data-ocid="hero.register_button"
              size="lg"
              variant="outline"
              onClick={() => navigate("register")}
              className="h-12 px-8 border-border hover:bg-accent font-semibold"
            >
              Criar Conta Grátis
            </Button>
          </div>

          {/* Stats Strip */}
          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { icon: Code2, value: "500+", label: "Scripts" },
              { icon: Users, value: "10.000+", label: "Usuários" },
              { icon: Download, value: "50.000+", label: "Downloads" },
              { icon: Star, value: "4.9", label: "Avaliação" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 text-center"
              >
                <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-display font-bold text-xl text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Categorias
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Tudo que você precisa para automatizar
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Bot,
                title: "Bots Discord",
                desc: "Moderação, música, roles e muito mais",
                color: "oklch(0.5 0.19 262)",
                bg: "oklch(0.5 0.19 262 / 0.1)",
                border: "oklch(0.5 0.19 262 / 0.3)",
              },
              {
                icon: Code2,
                title: "Scripts Automação",
                desc: "Web scraping, agendadores e workflows",
                color: "oklch(0.72 0.18 50)",
                bg: "oklch(0.72 0.18 50 / 0.1)",
                border: "oklch(0.72 0.18 50 / 0.3)",
              },
              {
                icon: Cpu,
                title: "Ferramentas IA",
                desc: "Geração de conteúdo, imagens e análises",
                color: "oklch(0.65 0.22 350)",
                bg: "oklch(0.65 0.22 350 / 0.1)",
                border: "oklch(0.65 0.22 350 / 0.3)",
              },
              {
                icon: Globe,
                title: "APIs",
                desc: "Crypto, SMS, pagamentos e integrações",
                color: "oklch(0.72 0.18 195)",
                bg: "oklch(0.72 0.18 195 / 0.1)",
                border: "oklch(0.72 0.18 195 / 0.3)",
              },
            ].map(({ icon: Icon, title, desc, color, bg, border }) => (
              <button
                type="button"
                key={title}
                onClick={() => navigate("marketplace")}
                className="group rounded-xl border p-6 text-left transition-all duration-300 hover:scale-[1.02]"
                style={{ borderColor: border, background: bg }}
              >
                <Icon
                  className="h-8 w-8 mb-3 transition-transform group-hover:scale-110"
                  style={{ color }}
                />
                <h3 className="font-display font-semibold text-sm text-foreground mb-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Por que escolher
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Recursos que fazem a diferença
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Marketplace Curado",
                desc: "Todos os scripts, bots e ferramentas são testados e verificados pela nossa equipe antes de entrarem no marketplace. Qualidade garantida.",
                color: "text-primary",
                glow: "oklch(0.56 0.22 278 / 0.15)",
              },
              {
                icon: Zap,
                title: "Licenças Instantâneas",
                desc: "Após a compra, sua chave de licença é gerada automaticamente em milissegundos. Comece a usar imediatamente sem esperar aprovação manual.",
                color: "text-cyan-400",
                glow: "oklch(0.72 0.18 195 / 0.15)",
              },
              {
                icon: Headphones,
                title: "Suporte Ativo",
                desc: "Comunidade vibrante de desenvolvedores e suporte técnico dedicado. Tutoriais, documentação e chat ao vivo disponíveis 24/7.",
                color: "text-emerald-400",
                glow: "oklch(0.68 0.17 155 / 0.15)",
              },
            ].map(({ icon: Icon, title, desc, color, glow }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 card-glow relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${glow} 0%, transparent 80%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 border border-border">
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Planos
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Escolha o plano ideal
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comece gratuitamente e escale conforme suas necessidades crescem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-display font-bold text-lg text-foreground mb-1">
                Free
              </p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-display font-black text-foreground">
                  $0
                </span>
                <span className="text-muted-foreground mb-1">/mês</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {[
                  "3 downloads/mês",
                  "Acesso básico ao marketplace",
                  "Suporte da comunidade",
                  "Licenças individuais",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-accent"
                onClick={() => navigate("register")}
              >
                Começar Grátis
              </Button>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-xl border-2 border-primary bg-card p-6 relative glow-violet">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  MAIS POPULAR
                </span>
              </div>
              <p className="font-display font-bold text-lg text-foreground mb-1">
                Pro
              </p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-display font-black text-gradient">
                  $19.99
                </span>
                <span className="text-muted-foreground mb-1">/mês</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {[
                  "Downloads ilimitados",
                  "Prioridade no suporte",
                  "Acesso antecipado",
                  "Licenças multi-dispositivo",
                  "Atualizações gratuitas",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <span className="text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => navigate("register")}
              >
                Começar Pro
              </Button>
            </div>

            {/* Enterprise */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="font-display font-bold text-lg text-foreground mb-1">
                Enterprise
              </p>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-display font-black text-foreground">
                  $49.99
                </span>
                <span className="text-muted-foreground mb-1">/mês</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {[
                  "Tudo do Pro",
                  "Acesso à API",
                  "SLA garantido",
                  "Deployments dedicados",
                  "Suporte 24/7",
                  "Licenças ilimitadas",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-border hover:bg-accent"
                onClick={() => navigate("register")}
              >
                Falar com Vendas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="rounded-2xl border border-primary/30 p-12 text-center relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, oklch(0.56 0.22 278 / 0.15) 0%, oklch(0.08 0.012 278) 70%)",
            }}
          >
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4 animate-float" />
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-4">
              Pronto para automatizar?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Junte-se a mais de 10.000 desenvolvedores que já estão usando a
              LuidDeveloperPlatform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("marketplace")}
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-violet-sm"
              >
                <Zap className="mr-2 h-4 w-4" />
                Explorar Scripts
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("register")}
                className="h-12 px-8 border-border hover:bg-accent font-semibold"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
