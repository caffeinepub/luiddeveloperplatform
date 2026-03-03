import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store/StoreContext";
import type { OrderType, Product } from "@/store/useAppStore";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CategoryBadge } from "./CategoryBadge";

interface PurchaseModalProps {
  product: Product | null;
  orderType: OrderType;
  open: boolean;
  onClose: () => void;
}

export function PurchaseModal({
  product,
  orderType,
  open,
  onClose,
}: PurchaseModalProps) {
  const { purchaseProduct } = useStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");

  const handleConfirm = async () => {
    if (!product) return;
    setLoading(true);

    const result = await purchaseProduct(product.id, orderType);
    setLoading(false);

    if (result.success && result.license) {
      setLicenseKey(result.license.key);
      setDone(true);
      toast.success("Compra realizada com sucesso! Sua licença foi gerada.");
    } else {
      toast.error(result.error ?? "Erro ao processar compra.");
      onClose();
    }
  };

  const handleClose = () => {
    setDone(false);
    setLicenseKey("");
    onClose();
  };

  const price = product
    ? orderType === "oneTime"
      ? product.priceOneTime
      : product.priceSubscription
    : 0;

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border bg-card">
        {!done ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Confirmar Compra
              </DialogTitle>
              <DialogDescription>
                Revise os detalhes antes de confirmar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-display font-semibold text-foreground">
                    {product.name}
                  </p>
                  <CategoryBadge category={product.category} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {orderType === "oneTime"
                        ? "Compra Única"
                        : "Assinatura Mensal"}
                    </p>
                    <p className="text-2xl font-display font-bold text-foreground">
                      R$ {price.toFixed(2)}
                      {orderType === "subscription" && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /mês
                        </span>
                      )}
                    </p>
                  </div>
                  <RefreshCw
                    className={`h-8 w-8 ${orderType === "subscription" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Ao confirmar, uma chave de licença será gerada instantaneamente
                para sua conta.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                data-ocid="purchase.cancel_button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                data-ocid="purchase.confirm_button"
                onClick={handleConfirm}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Confirmar R$ {price.toFixed(2)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                Compra Concluída!
              </DialogTitle>
              <DialogDescription>
                Sua licença foi gerada com sucesso
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Sua chave de licença
                </p>
                <p className="license-key text-foreground text-center py-2 px-4 rounded bg-background border border-border select-all">
                  {licenseKey}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Você pode acessar sua licença no Dashboard a qualquer momento.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleClose}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                Ir para o Dashboard
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
