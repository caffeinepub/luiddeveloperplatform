import { CategoryBadge } from "@/components/CategoryBadge";
import { PurchaseModal } from "@/components/PurchaseModal";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import type { OrderType } from "@/store/useAppStore";
import {
  ArrowLeft,
  CheckCheck,
  Copy,
  Download,
  Key,
  RefreshCw,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { products, currentUser, licenses } = useStore();
  const { navigate, selectedProductId } = useRouter();
  const [purchaseOrderType, setPurchaseOrderType] =
    useState<OrderType>("oneTime");
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = products.find((p) => p.id === selectedProductId);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Produto não encontrado.</p>
          <Button variant="outline" onClick={() => navigate("marketplace")}>
            Voltar ao Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const isOwned =
    currentUser?.purchasedProductIds.includes(product.id) ?? false;
  const userLicense = isOwned
    ? licenses.find(
        (l) => l.productId === product.id && l.userId === currentUser?.id,
      )
    : null;

  const handleBuy = (orderType: OrderType) => {
    if (!currentUser) {
      navigate("login");
      return;
    }
    setPurchaseOrderType(orderType);
    setPurchaseOpen(true);
  };

  const copyLicense = () => {
    if (!userLicense) return;
    navigator.clipboard.writeText(userLicense.key).then(() => {
      setCopied(true);
      toast.success("Chave copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("marketplace")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <CategoryBadge category={product.category} />
                    <span className="text-xs font-mono bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                      v{product.version}
                    </span>
                    {!product.isActive && (
                      <span className="text-xs text-destructive bg-destructive/10 border border-destructive/30 px-2 py-0.5 rounded-full">
                        Indisponível
                      </span>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
                    {product.name}
                  </h1>
                  <StarRating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    size="md"
                  />
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* License info if owned */}
            {isOwned && userLicense && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-display font-semibold text-emerald-400">
                    Produto Adquirido
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Sua chave de licença ativa:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 license-key text-foreground bg-background border border-border rounded-lg px-4 py-2.5 text-sm">
                    {userLicense.key}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyLicense}
                    className="shrink-0"
                  >
                    {copied ? (
                      <CheckCheck className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {userLicense.expiresAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Expira em:{" "}
                    {new Date(userLicense.expiresAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download do Arquivo
                </Button>
              </div>
            )}
          </div>

          {/* Pricing Sidebar */}
          <div className="space-y-4">
            {!isOwned ? (
              <>
                {/* One-time */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Compra Única
                  </p>
                  <p className="font-display font-black text-3xl text-foreground mb-1">
                    R$ {product.priceOneTime.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Pagamento único · acesso vitalício
                  </p>
                  <Button
                    data-ocid="product.buy_onetime_button"
                    onClick={() => handleBuy("oneTime")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={!product.isActive}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar Agora
                  </Button>
                </div>

                {/* Subscription */}
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                  <p className="text-xs text-primary/80 uppercase tracking-wider mb-1">
                    Assinatura Mensal
                  </p>
                  <p className="font-display font-black text-3xl text-gradient mb-1">
                    R$ {product.priceSubscription.toFixed(2)}
                    <span className="text-lg font-normal text-muted-foreground">
                      /mês
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Renovação mensal · cancele quando quiser
                  </p>
                  <Button
                    data-ocid="product.buy_subscription_button"
                    onClick={() => handleBuy("subscription")}
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    disabled={!product.isActive}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Assinar
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
                <div className="text-3xl mb-2">✓</div>
                <p className="font-display font-bold text-emerald-400">
                  Já adquirido
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Acesse sua licença no Dashboard
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full border-emerald-500/30 text-emerald-400"
                  onClick={() => navigate("dashboard")}
                >
                  Ver no Dashboard
                </Button>
              </div>
            )}

            {/* Info */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h4 className="font-display font-semibold text-sm text-foreground mb-3">
                Informações
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Versão</dt>
                  <dd className="font-mono text-foreground">
                    v{product.version}
                  </dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Avaliações</dt>
                  <dd className="text-foreground">{product.reviewCount}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Publicado</dt>
                  <dd className="text-foreground">
                    {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <PurchaseModal
        product={product}
        orderType={purchaseOrderType}
        open={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
      />
    </div>
  );
}
