import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import {
  AlertCircle,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  ExternalLink,
  History,
  Key,
  Mail,
  Package,
  RefreshCw,
  Save,
  ShoppingBag,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Tab = "purchases" | "licenses" | "profile";

export function DashboardPage() {
  const {
    currentUser,
    orders,
    licenses,
    products,
    updateUserEmail,
    isLoading,
  } = useStore();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("purchases");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [newEmail, setNewEmail] = useState(currentUser?.email ?? "");
  const [emailSaving, setEmailSaving] = useState(false);
  const [expandedHistoryOrderId, setExpandedHistoryOrderId] = useState<
    number | null
  >(null);

  if (!currentUser) {
    navigate("login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div
          data-ocid="dashboard.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Carregando seu painel...
          </p>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const userLicenses = licenses.filter((l) => l.userId === currentUser.id);

  const getProductName = (id: number) =>
    products.find((p) => p.id === id)?.name ?? "Produto removido";
  const getProduct = (id: number) => products.find((p) => p.id === id);

  const copyKey = (key: string, id: number) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedId(id);
      toast.success("Chave copiada!");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSaveEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setEmailSaving(true);
    await updateUserEmail(newEmail);
    setEmailSaving(false);
    toast.success("E-mail atualizado com sucesso!");
  };

  const totalSpent = userOrders.reduce((sum, o) => sum + o.amount, 0);

  const tabs: {
    value: Tab;
    label: string;
    icon: React.ElementType;
    ocid: string;
  }[] = [
    {
      value: "purchases",
      label: "Minhas Compras",
      icon: ShoppingBag,
      ocid: "dashboard.purchases_tab",
    },
    {
      value: "licenses",
      label: "Minhas Licenças",
      icon: Key,
      ocid: "dashboard.licenses_tab",
    },
    {
      value: "profile",
      label: "Meu Perfil",
      icon: User,
      ocid: "dashboard.profile_tab",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Dashboard
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Olá, <span className="text-gradient">{currentUser.username}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentUser.email}
            </p>
          </div>
          {/* Summary cards */}
          <div className="flex gap-3 flex-wrap">
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {userOrders.length}
              </p>
              <p className="text-xs text-muted-foreground">Compras</p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-center">
              <p className="text-xl font-display font-bold text-foreground">
                {userLicenses.filter((l) => l.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground">Licenças Ativas</p>
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-center">
              <p className="text-xl font-display font-bold text-foreground">
                R$ {totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Total Gasto</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.map(({ value, label, icon: Icon, ocid }) => (
            <button
              type="button"
              key={value}
              data-ocid={ocid}
              onClick={() => setActiveTab(value)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                activeTab === value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Purchases ─────────────────────────────────────── */}
        {activeTab === "purchases" && (
          <div>
            {userOrders.length === 0 ? (
              <div
                data-ocid="dashboard.purchases.empty_state"
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center"
              >
                <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="font-display font-semibold text-foreground mb-2">
                  Nenhuma compra ainda
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Explore o marketplace e encontre ferramentas incríveis para
                  automatizar seu trabalho.
                </p>
                <Button
                  onClick={() => navigate("marketplace")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Explorar Marketplace
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order, idx) => {
                  const product = getProduct(order.productId);

                  const handleDownload = () => {
                    toast.info(
                      "Arquivo em migração. Por favor, contate o suporte para acesso ao arquivo.",
                    );
                  };

                  return (
                    <div
                      key={order.id}
                      data-ocid={`dashboard.purchases.item.${idx + 1}`}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-semibold text-foreground truncate">
                              {getProductName(order.productId)}
                            </p>
                            {product && (
                              <CategoryBadge category={product.category} />
                            )}
                            {product?.updatedAt && (
                              <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <Zap className="h-2.5 w-2.5" />
                                Atualizado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              {order.orderType === "subscription" ? (
                                <>
                                  <RefreshCw className="h-3 w-3" /> Assinatura
                                </>
                              ) : (
                                <>
                                  <Package className="h-3 w-3" /> Compra Única
                                </>
                              )}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "completed"
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {order.status === "completed"
                                ? "Concluído"
                                : order.status}
                            </span>
                          </div>
                          {product?.updatedAt && product.updateNote && (
                            <p className="text-xs text-emerald-400/80 mt-1.5 flex items-center gap-1">
                              <Zap className="h-3 w-3 shrink-0" />
                              {product.updateNote}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="font-display font-bold text-foreground">
                            R$ {order.amount.toFixed(2)}
                          </p>
                          <p className="text-xs font-mono text-muted-foreground truncate max-w-[160px]">
                            {order.licenseKey}
                          </p>
                          <div className="flex items-center gap-1">
                            {product?.fileName && (
                              <Button
                                data-ocid={`dashboard.purchases.download_button.${idx + 1}`}
                                size="sm"
                                variant="outline"
                                onClick={handleDownload}
                                className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                              >
                                <Download className="mr-1 h-3 w-3" />
                                Baixar
                              </Button>
                            )}
                            {product?.versionHistory &&
                              product.versionHistory.length > 0 && (
                                <Button
                                  data-ocid={`dashboard.purchases.history_button.${idx + 1}`}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    setExpandedHistoryOrderId(
                                      expandedHistoryOrderId === order.id
                                        ? null
                                        : order.id,
                                    )
                                  }
                                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <History className="mr-1 h-3 w-3" />
                                  Histórico
                                  {expandedHistoryOrderId === order.id ? (
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  )}
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                      {/* end inner flex row */}
                      {/* Version History Expanded */}
                      {expandedHistoryOrderId === order.id &&
                        product?.versionHistory &&
                        product.versionHistory.length > 0 && (
                          <div
                            data-ocid={`dashboard.purchases.history_panel.${idx + 1}`}
                            className="mt-3 pt-3 border-t border-border space-y-2"
                          >
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              <History className="h-3.5 w-3.5" />
                              Histórico de Versões
                            </p>
                            <div className="space-y-2">
                              {[...product.versionHistory]
                                .reverse()
                                .map((entry, hIdx) => (
                                  <div
                                    key={`${entry.version}-${entry.updatedAt}`}
                                    className="flex gap-3 items-start"
                                  >
                                    <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                      {hIdx <
                                        product.versionHistory!.length - 1 && (
                                        <div className="w-px bg-border h-3" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-xs font-semibold text-foreground">
                                          v{entry.version}
                                        </span>
                                        {hIdx === 0 && (
                                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                            Atual
                                          </span>
                                        )}
                                        <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {new Date(
                                            entry.updatedAt,
                                          ).toLocaleDateString("pt-BR")}
                                        </span>
                                      </div>
                                      {entry.note && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                          {entry.note}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Licenses ──────────────────────────────────────── */}
        {activeTab === "licenses" && (
          <div>
            {userLicenses.length === 0 ? (
              <div
                data-ocid="dashboard.licenses.empty_state"
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center"
              >
                <Key className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <p className="font-display font-semibold text-foreground mb-2">
                  Nenhuma licença ativa
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Suas licenças aparecerão aqui após a compra de qualquer
                  produto.
                </p>
                <Button
                  onClick={() => navigate("marketplace")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Ir ao Marketplace
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userLicenses.map((license, idx) => {
                  const product = getProduct(license.productId);
                  const isCopied = copiedId === license.id;
                  return (
                    <div
                      key={license.id}
                      data-ocid={`dashboard.licenses.item.${idx + 1}`}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-foreground text-sm">
                              {getProductName(license.productId)}
                            </p>
                            {product?.updatedAt && (
                              <span className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <Zap className="h-2.5 w-2.5" />
                                Atualizado
                              </span>
                            )}
                          </div>
                          {product && (
                            <div className="mt-1">
                              <CategoryBadge category={product.category} />
                            </div>
                          )}
                          {product?.updatedAt && product.updateNote && (
                            <p className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1">
                              <Zap className="h-3 w-3 shrink-0" />
                              {product.updateNote}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                            license.isActive
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {license.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <code className="flex-1 license-key text-xs text-foreground bg-background border border-border rounded-lg px-3 py-2 truncate">
                          {license.key}
                        </code>
                        <Button
                          data-ocid={`dashboard.license.copy_button.${idx + 1}`}
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => copyKey(license.key, license.id)}
                        >
                          {isCopied ? (
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>

                      {license.expiresAt && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expira:{" "}
                          {new Date(license.expiresAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-border"
                          onClick={() =>
                            navigate("product-detail", license.productId)
                          }
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Ver produto
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Profile ───────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-lg space-y-6">
            {/* Info card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-primary">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-foreground">
                    {currentUser.username}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      currentUser.role === "admin"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentUser.role === "admin" ? "Administrador" : "Usuário"}
                  </span>
                </div>
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Usuário</dt>
                  <dd className="font-medium text-foreground">
                    {currentUser.username}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Membro desde</dt>
                  <dd className="font-medium text-foreground">
                    {new Date(currentUser.createdAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="text-emerald-400 font-medium">Ativo</dd>
                </div>
              </dl>
            </div>

            {/* Edit email */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Editar E-mail
              </h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">
                    E-mail atual
                  </Label>
                  <p className="text-sm text-foreground font-medium">
                    {currentUser.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="new-email"
                    className="text-sm text-foreground"
                  >
                    Novo e-mail
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-background border-border"
                    placeholder="novo@email.com"
                  />
                </div>
                <Button
                  onClick={handleSaveEmail}
                  disabled={emailSaving || newEmail === currentUser.email}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  {emailSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />{" "}
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-3.5 w-3.5" /> Salvar E-mail
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Alert */}
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Para alterar seu nome de usuário ou senha, entre em contato com
                o suporte.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
