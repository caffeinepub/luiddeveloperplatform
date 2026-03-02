import { Button } from "@/components/ui/button";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import type { Product } from "@/store/useAppStore";
import { Eye, ShoppingCart, Tag, Zap } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { StarRating } from "./StarRating";

interface ProductCardProps {
  product: Product;
  index: number;
  onBuy?: (product: Product) => void;
}

export function ProductCard({ product, index, onBuy }: ProductCardProps) {
  const { navigate } = useRouter();
  const { currentUser } = useStore();

  const handleBuy = () => {
    if (!currentUser) {
      navigate("login");
      return;
    }
    onBuy?.(product);
  };

  const handleDetails = () => {
    navigate("product-detail", product.id);
  };

  const alreadyOwned = currentUser?.purchasedProductIds.includes(product.id);

  return (
    <div
      data-ocid={`marketplace.product.item.${index}`}
      className="card-glow group relative flex flex-col rounded-xl border border-border bg-card p-5 overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.56 0.22 278 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-base text-foreground leading-tight line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {product.updatedAt && (
              <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Zap className="h-2.5 w-2.5" />
                Novo
              </span>
            )}
            <span className="text-xs font-mono bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded border border-border">
              v{product.version}
            </span>
          </div>
        </div>
        <CategoryBadge category={product.category} />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
        {product.description}
      </p>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      </div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="mb-4 p-3 rounded-lg bg-background/60 border border-border">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">A partir de</p>
            <p className="text-xl font-display font-bold text-foreground">
              R$ {product.priceOneTime.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              ou R$ {product.priceSubscription.toFixed(2)}/mês
            </p>
          </div>
          {alreadyOwned && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 rounded-full">
              ✓ Adquirido
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          data-ocid={`marketplace.detail_button.${index}`}
          variant="outline"
          size="sm"
          className="flex-1 border-border hover:bg-accent"
          onClick={handleDetails}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Ver Detalhes
        </Button>
        {!alreadyOwned && (
          <Button
            data-ocid={`marketplace.buy_button.${index}`}
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleBuy}
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Comprar
          </Button>
        )}
      </div>
    </div>
  );
}
