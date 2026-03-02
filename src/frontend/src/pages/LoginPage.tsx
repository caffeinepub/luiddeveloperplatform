import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import { AlertCircle, LogIn, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function LoginPage() {
  const { login, currentUser } = useStore();
  const { navigate } = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate("dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Informe o nome de usuário.");
      return;
    }
    if (!password) {
      setError("Informe a senha.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const result = login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate("dashboard");
    } else {
      setError(result.error ?? "Erro ao fazer login.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/40 mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">
              Entrar na plataforma
            </h1>
            <p className="text-sm text-muted-foreground">
              Acesse sua conta para gerenciar suas licenças
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="login-username"
                className="text-sm font-medium text-foreground"
              >
                Nome de usuário
              </Label>
              <Input
                id="login-username"
                data-ocid="login.username_input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="SeuUsuario"
                className="bg-background border-border"
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="login-password"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </Label>
              <Input
                id="login-password"
                data-ocid="login.password_input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-border"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="login.error_state"
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              data-ocid="login.submit_button"
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <button
              type="button"
              data-ocid="login.register_link"
              onClick={() => navigate("register")}
              className="text-primary hover:underline font-medium"
            >
              Criar conta grátis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
