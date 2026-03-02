import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import { AlertCircle, CheckCircle, UserPlus, Zap } from "lucide-react";
import { useState } from "react";

export function RegisterPage() {
  const { register } = useStore();
  const { navigate } = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || username.trim().length < 3) {
      setError("Nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const result = register(
      username.trim(),
      email.trim().toLowerCase(),
      password,
    );
    setLoading(false);

    if (result.success) {
      navigate("dashboard");
    } else {
      setError(result.error ?? "Erro ao criar conta.");
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthColors = [
    "bg-destructive",
    "bg-destructive",
    "bg-amber-500",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-emerald-400",
  ];
  const strengthLabels = [
    "",
    "Muito fraca",
    "Fraca",
    "Regular",
    "Boa",
    "Forte",
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/40 mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">
              Criar sua conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Junte-se a milhares de desenvolvedores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-username"
                className="text-sm font-medium text-foreground"
              >
                Nome de usuário
              </Label>
              <Input
                id="reg-username"
                data-ocid="register.username_input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="MeuUsuario"
                className="bg-background border-border"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-email"
                className="text-sm font-medium text-foreground"
              >
                E-mail
              </Label>
              <Input
                id="reg-email"
                data-ocid="register.email_input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="bg-background border-border"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-password"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </Label>
              <Input
                id="reg-password"
                data-ocid="register.password_input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-border"
                disabled={loading}
              />
              {password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColors[strength] : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="reg-confirm"
                className="text-sm font-medium text-foreground"
              >
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="reg-confirm"
                  data-ocid="register.confirm_password_input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-border pr-9"
                  disabled={loading}
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="register.error_state"
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              data-ocid="register.submit_button"
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-10 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <button
              type="button"
              data-ocid="register.login_link"
              onClick={() => navigate("login")}
              className="text-primary hover:underline font-medium"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
