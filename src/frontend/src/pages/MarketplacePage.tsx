import { ProductCard } from "@/components/ProductCard";
import { PurchaseModal } from "@/components/PurchaseModal";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store/StoreContext";
import type { Category, OrderType, Product } from "@/store/useAppStore";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type CategoryFilter = "all" | Category;

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "discordBots", label: "Bots Discord" },
  { value: "automationScripts", label: "Scripts Automação" },
  { value: "aiTools", label: "Ferramentas IA" },
  { value: "apis", label: "APIs" },
];

export function MarketplacePage() {
  const { products } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
  const [purchaseOrderType, setPurchaseOrderType] =
    useState<OrderType>("oneTime");

  const activeProducts = products.filter((p) => p.isActive);

  const filtered = useMemo(() => {
    return activeProducts.filter((p) => {
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, search, categoryFilter]);

  const handleBuy = (product: Product) => {
    setPurchaseProduct(product);
    setPurchaseOrderType("oneTime");
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Marketplace
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
            Explore as ferramentas
          </h1>
          <p className="text-muted-foreground">
            {activeProducts.length} ferramentas disponíveis · Scripts, bots e
            automações verificados
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-ocid="marketplace.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar scripts, bots, ferramentas..."
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtrar:
            </div>
            {CATEGORY_TABS.map((tab, i) => (
              <button
                type="button"
                key={tab.value}
                data-ocid={`marketplace.category_filter.tab.${i + 1}`}
                onClick={() => setCategoryFilter(tab.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {search && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para
            &quot;{search}&quot;
          </p>
        )}

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx + 1}
                onBuy={handleBuy}
              />
            ))}
          </div>
        ) : (
          <div
            data-ocid="marketplace.product.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-muted/50 border border-border flex items-center justify-center mb-4">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-display font-semibold text-foreground mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Tente ajustar sua busca ou escolher uma categoria diferente.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("all");
              }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        product={purchaseProduct}
        orderType={purchaseOrderType}
        open={!!purchaseProduct}
        onClose={() => setPurchaseProduct(null)}
      />
    </div>
  );
}
