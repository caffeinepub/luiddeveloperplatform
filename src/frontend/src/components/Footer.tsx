import { useRouter } from "@/store/RouterContext";
import { Heart, Zap } from "lucide-react";

export function Footer() {
  const { navigate } = useRouter();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="flex items-center gap-2 mb-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/40">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-foreground">LuidDeveloper</span>
                <span className="text-gradient">Platform</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              O marketplace definitivo para bots, scripts e ferramentas de
              automação. Descubra, compre e implante com segurança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("marketplace")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Marketplace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("register")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Criar Conta
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate("login")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entrar
                </button>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Categorias
            </h4>
            <ul className="space-y-2">
              {[
                "Bots Discord",
                "Scripts de Automação",
                "Ferramentas de IA",
                "APIs",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => navigate("marketplace")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year}. Feito com{" "}
            <Heart className="inline h-3 w-3 text-destructive fill-destructive" />{" "}
            usando{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            LuidDeveloperPlatform &mdash; Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
