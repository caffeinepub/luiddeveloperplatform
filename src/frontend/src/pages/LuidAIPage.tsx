import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/RouterContext";
import { BrainCircuit, Sparkles } from "lucide-react";

export function LuidAIPage() {
  const { navigate } = useRouter();

  return (
    <div
      data-ocid="luid-ai.page"
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 pt-16"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
          <BrainCircuit className="h-10 w-10 text-primary" />
          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 border border-primary/40">
            <Sparkles className="h-3 w-3 text-primary" />
          </span>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Em Breve
        </span>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Luid AI
          </h1>
          <p className="text-muted-foreground">
            A inteligência artificial da LuidCorporation está em
            desenvolvimento. Em breve você poderá automatizar tarefas, gerar
            scripts e muito mais diretamente na plataforma.
          </p>
        </div>

        {/* Feature hints */}
        <ul className="flex w-full flex-col gap-2 text-left text-sm text-muted-foreground">
          {[
            "Geração automática de scripts com IA",
            "Assistente inteligente para automações",
            "Integração nativa com o Marketplace",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <Button
          data-ocid="luid-ai.back_button"
          variant="outline"
          size="sm"
          onClick={() => navigate("home")}
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
}
