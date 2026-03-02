import { CATEGORY_LABELS, CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import type {
  Category,
  Product,
  VersionHistoryEntry,
} from "@/store/useAppStore";
import {
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  LayoutDashboard,
  Package,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type AdminTab = "dashboard" | "products" | "users";

type ProductFormData = {
  name: string;
  description: string;
  version: string;
  category: Category;
  priceOneTime: string;
  priceSubscription: string;
  tags: string;
  isActive: boolean;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  version: "1.0.0",
  category: "automationScripts",
  priceOneTime: "",
  priceSubscription: "",
  tags: "",
  isActive: true,
};

export function AdminPage() {
  const {
    currentUser,
    users,
    products,
    orders,
    toggleProductActive,
    toggleUserActive,
    deleteUser,
    resetOrders,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteUserConfirmId, setDeleteUserConfirmId] = useState<number | null>(
    null,
  );
  const [resetOrdersConfirm, setResetOrdersConfirm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // File upload state
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update note state
  const [markAsUpdated, setMarkAsUpdated] = useState(false);
  const [updateNote, setUpdateNote] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    navigate("home");
    return null;
  }

  // ── Metrics ──────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const activeUsers = users.filter((u) => u.isActive).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const activeProducts = products.filter((p) => p.isActive).length;

  // Revenue by category
  const categoryRevenue = Object.entries(CATEGORY_LABELS).map(
    ([cat, label]) => {
      const catOrders = orders.filter((o) => {
        const p = products.find((p) => p.id === o.productId);
        return p?.category === cat;
      });
      const rev = catOrders.reduce((s, o) => s + o.amount, 0);
      return {
        category: cat as Category,
        label,
        revenue: rev,
        count: catOrders.length,
      };
    },
  );

  // ── Product Form ──────────────────────────────────────────────────
  const resetFileState = () => {
    setUploadedFileData(null);
    setUploadedFileName("");
    setUploadedFileSize(0);
  };

  const resetUpdateState = () => {
    setMarkAsUpdated(false);
    setUpdateNote("");
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setFormError("");
    resetFileState();
    resetUpdateState();
    setProductFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      version: product.version,
      category: product.category,
      priceOneTime: product.priceOneTime.toString(),
      priceSubscription: product.priceSubscription.toString(),
      tags: product.tags.join(", "),
      isActive: product.isActive,
    });
    setFormError("");
    // Pre-populate file state from existing product
    setUploadedFileName(product.fileName ?? "");
    setUploadedFileSize(product.fileSize ?? 0);
    setUploadedFileData(
      product.fileId ? (localStorage.getItem(product.fileId) ?? null) : null,
    );
    resetUpdateState();
    setProductFormOpen(true);
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedFileData(result);
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFormSubmit = async () => {
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Nome é obrigatório.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Descrição é obrigatória.");
      return;
    }
    if (!formData.version.trim()) {
      setFormError("Versão é obrigatória.");
      return;
    }
    const oneTime = Number.parseFloat(formData.priceOneTime);
    const sub = Number.parseFloat(formData.priceSubscription);
    if (Number.isNaN(oneTime) || oneTime <= 0) {
      setFormError("Preço de compra único inválido.");
      return;
    }
    if (Number.isNaN(sub) || sub <= 0) {
      setFormError("Preço de assinatura inválido.");
      return;
    }

    setFormLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const data = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      version: formData.version.trim(),
      category: formData.category,
      priceOneTime: oneTime,
      priceSubscription: sub,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isActive: formData.isActive,
    };

    if (editingProduct) {
      // Handle file for edit
      let fileUpdates: Partial<Product> = {};
      if (uploadedFileData) {
        const fileKey = `ldp_file_${editingProduct.id}`;
        localStorage.setItem(fileKey, uploadedFileData);
        fileUpdates = {
          fileId: fileKey,
          fileName: uploadedFileName,
          fileSize: uploadedFileSize,
        };
      } else if (!uploadedFileName) {
        // File was cleared
        if (editingProduct.fileId) {
          localStorage.removeItem(editingProduct.fileId);
        }
        fileUpdates = {
          fileId: undefined,
          fileName: undefined,
          fileSize: undefined,
        };
      }

      // Handle update note
      let updateFields: Partial<Product> & {
        _appendVersionHistory?: VersionHistoryEntry;
      } = {};
      if (markAsUpdated) {
        const now = Date.now();
        updateFields = {
          updatedAt: now,
          updateNote: updateNote.trim() || undefined,
          _appendVersionHistory: {
            version: formData.version.trim(),
            note: updateNote.trim() || undefined,
            updatedAt: now,
          },
        };
      }

      updateProduct(editingProduct.id, {
        ...data,
        ...fileUpdates,
        ...updateFields,
      });
      toast.success("Produto atualizado com sucesso!");
    } else {
      const newProduct = addProduct(data);
      if (uploadedFileData) {
        const fileKey = `ldp_file_${newProduct.id}`;
        localStorage.setItem(fileKey, uploadedFileData);
        updateProduct(newProduct.id, {
          fileId: fileKey,
          fileName: uploadedFileName,
          fileSize: uploadedFileSize,
        });
      }
      toast.success("Produto adicionado com sucesso!");
    }

    setFormLoading(false);
    setProductFormOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    toast.success("Produto removido.");
  };

  // ── Tab config ────────────────────────────────────────────────────
  const tabs: {
    value: AdminTab;
    label: string;
    icon: React.ElementType;
    ocid: string;
  }[] = [
    {
      value: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      ocid: "admin.dashboard_tab",
    },
    {
      value: "products",
      label: "Produtos",
      icon: Package,
      ocid: "admin.products_tab",
    },
    { value: "users", label: "Usuários", icon: Users, ocid: "admin.users_tab" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Painel Administrativo
            </p>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            Administração da Plataforma
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto">
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

        {/* ── Dashboard Tab ──────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: Activity,
                  label: "Total Pedidos",
                  value: orders.length.toString(),
                  sub: `${completedOrders} concluídos`,
                  color: "text-primary",
                },
                {
                  icon: DollarSign,
                  label: "Receita Total",
                  value: `R$ ${totalRevenue.toFixed(2)}`,
                  sub: "Todos os pedidos",
                  color: "text-emerald-400",
                },
                {
                  icon: Users,
                  label: "Total Usuários",
                  value: users.length.toString(),
                  sub: `${activeUsers} ativos`,
                  color: "text-cyan-400",
                },
                {
                  icon: Package,
                  label: "Produtos",
                  value: products.length.toString(),
                  sub: `${activeProducts} ativos`,
                  color: "text-amber-400",
                },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <Icon className={`h-6 w-6 ${color} mb-3`} />
                  <p className="font-display font-bold text-2xl text-foreground">
                    {value}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue by category */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Receita por Categoria
                  </h3>
                </div>
                <Button
                  data-ocid="admin.reset_orders_button"
                  size="sm"
                  variant="outline"
                  onClick={() => setResetOrdersConfirm(true)}
                  className="text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <RefreshCw className="mr-1.5 h-3 w-3" />
                  Resetar Receita
                </Button>
              </div>
              <div className="space-y-3">
                {categoryRevenue
                  .sort((a, b) => b.revenue - a.revenue)
                  .map(({ category, revenue, count }) => {
                    const maxRevenue = Math.max(
                      ...categoryRevenue.map((c) => c.revenue),
                      1,
                    );
                    const pct = (revenue / maxRevenue) * 100;
                    return (
                      <div key={category} className="flex items-center gap-4">
                        <div className="w-36 shrink-0">
                          <CategoryBadge category={category} />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0 w-32">
                          <span className="text-sm font-medium text-foreground">
                            R$ {revenue.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({count} pedidos)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {orders.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma venda registrada ainda.
                  </p>
                )}
              </div>
            </div>

            {/* Recent orders */}
            {orders.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground">
                    Pedidos Recentes
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {orders.length} total
                  </span>
                </div>
                <div className="space-y-2">
                  {orders
                    .slice(-5)
                    .reverse()
                    .map((order) => {
                      const user = users.find((u) => u.id === order.userId);
                      const product = products.find(
                        (p) => p.id === order.productId,
                      );
                      return (
                        <div
                          key={order.id}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {product?.name ?? "Produto removido"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              por {user?.username ?? "Usuário removido"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">
                              R$ {order.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Products Tab ───────────────────────────────────── */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {products.length} produtos cadastrados
              </p>
              <Button
                data-ocid="admin.add_product_button"
                onClick={openAddForm}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="sm"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Produto
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                        Categoria
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                        Preço
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, idx) => (
                      <tr
                        key={product.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            {product.updatedAt && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Atualizado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-muted-foreground font-mono">
                              v{product.version}
                            </p>
                            {product.fileName && (
                              <span className="flex items-center gap-0.5 text-xs text-primary">
                                <Paperclip className="h-3 w-3" />
                                <span className="hidden sm:inline truncate max-w-[120px]">
                                  {product.fileName}
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <CategoryBadge category={product.category} />
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <p className="text-foreground font-medium">
                            R$ {product.priceOneTime.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            R$ {product.priceSubscription.toFixed(2)}/mês
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            data-ocid={`admin.product.toggle_button.${idx + 1}`}
                            onClick={() => {
                              toggleProductActive(product.id);
                              toast.success(
                                `Produto ${product.isActive ? "desativado" : "ativado"}.`,
                              );
                            }}
                            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                              product.isActive
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                : "bg-muted text-muted-foreground border border-border hover:bg-accent"
                            }`}
                          >
                            {product.isActive ? "Ativo" : "Inativo"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              data-ocid={`admin.product.edit_button.${idx + 1}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditForm(product)}
                              className="h-7 w-7 p-0 hover:bg-accent"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              data-ocid={`admin.product.delete_button.${idx + 1}`}
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ──────────────────────────────────────── */}
        {activeTab === "users" && (
          <div>
            <p className="text-sm text-muted-foreground mb-6">
              {users.length} usuários cadastrados
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Usuário
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                        E-mail
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                        Tipo
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                        Desde
                      </th>
                      <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => {
                      const isSelf = user.id === currentUser.id;
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {user.username}
                                </p>
                                {isSelf && (
                                  <p className="text-xs text-primary">(você)</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                user.role === "admin"
                                  ? "bg-primary/20 text-primary border border-primary/30"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {user.role === "admin" ? "Admin" : "Usuário"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                            {new Date(user.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                user.isActive
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-destructive/15 text-destructive border border-destructive/30"
                              }`}
                            >
                              {user.isActive ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                data-ocid={`admin.user.toggle_button.${idx + 1}`}
                                size="sm"
                                variant="outline"
                                disabled={isSelf}
                                onClick={() => {
                                  toggleUserActive(user.id);
                                  toast.success(
                                    `Usuário ${user.isActive ? "desativado" : "ativado"}.`,
                                  );
                                }}
                                className={`text-xs h-7 ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {user.isActive ? (
                                  <>
                                    <ChevronDown className="mr-1 h-3 w-3" />{" "}
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <ChevronUp className="mr-1 h-3 w-3" />{" "}
                                    Ativar
                                  </>
                                )}
                              </Button>
                              <Button
                                data-ocid={`admin.user.delete_button.${idx + 1}`}
                                size="sm"
                                variant="ghost"
                                disabled={isSelf}
                                onClick={() => setDeleteUserConfirmId(user.id)}
                                className={`h-7 w-7 p-0 hover:bg-destructive/10 text-destructive ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Form Modal ─────────────────────────────── */}
      <Dialog
        open={productFormOpen}
        onOpenChange={(open) => {
          setProductFormOpen(open);
          if (!open) {
            resetFileState();
            resetUpdateState();
          }
        }}
      >
        <DialogContent className="max-w-xl border-border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              {editingProduct ? (
                <Pencil className="h-5 w-5 text-primary" />
              ) : (
                <Plus className="h-5 w-5 text-primary" />
              )}
              {editingProduct ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Atualize as informações do produto."
                : "Preencha os dados do novo produto."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="pf-name"
                className="text-sm font-medium text-foreground"
              >
                Nome *
              </Label>
              <Input
                id="pf-name"
                data-ocid="admin.product_form.name_input"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Nome do produto"
                className="bg-background border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="pf-desc"
                className="text-sm font-medium text-foreground"
              >
                Descrição *
              </Label>
              <Textarea
                id="pf-desc"
                data-ocid="admin.product_form.description_textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Descreva o produto em detalhes..."
                className="bg-background border-border min-h-[100px] resize-none"
              />
            </div>

            {/* Version + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Versão *
                </Label>
                <Input
                  value={formData.version}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, version: e.target.value }))
                  }
                  placeholder="1.0.0"
                  className="bg-background border-border font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Categoria *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData((p) => ({ ...p, category: v as Category }))
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Preço Único (R$) *
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceOneTime}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, priceOneTime: e.target.value }))
                  }
                  placeholder="29.99"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-foreground">
                  Assinatura/mês (R$) *
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceSubscription}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      priceSubscription: e.target.value,
                    }))
                  }
                  placeholder="9.99"
                  className="bg-background border-border"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Tags
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="discord, moderação, bot (separadas por vírgula)"
                className="bg-background border-border"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Arquivo para Download
              </Label>
              <p className="text-xs text-muted-foreground">
                Arquivo que o comprador poderá fazer download após a compra.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                data-ocid="admin.product_form.upload_button"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  // reset value so same file can be re-selected
                  e.target.value = "";
                }}
              />
              {uploadedFileName ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <Paperclip className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadedFileName}
                    </p>
                    {uploadedFileSize > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFileSize)}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      resetFileState();
                    }}
                    className="h-7 w-7 p-0 shrink-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="admin.product_form.dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className={`w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/20"
                  }`}
                >
                  <Upload
                    className={`h-6 w-6 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Clique para selecionar ou arraste o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qualquer tipo de arquivo aceito
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Mark as Updated (only for editing) */}
            {editingProduct !== null && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Marcar como atualizado
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Exibe badge "Atualizado" para os usuários
                      </p>
                    </div>
                  </div>
                  <Switch
                    data-ocid="admin.product_form.mark_updated_switch"
                    checked={markAsUpdated}
                    onCheckedChange={setMarkAsUpdated}
                  />
                </div>
                {markAsUpdated && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Nota de atualização (opcional)
                    </Label>
                    <Input
                      data-ocid="admin.product_form.update_note_input"
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                      placeholder="Ex: Corrigido bug crítico, nova funcionalidade X..."
                      className="bg-background border-border text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Active toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Produto ativo
                </p>
                <p className="text-xs text-muted-foreground">
                  Visível no marketplace
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData((p) => ({ ...p, isActive: v }))
                }
              />
            </div>

            {/* Error */}
            {formError && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.product_form.cancel_button"
              variant="outline"
              onClick={() => setProductFormOpen(false)}
              disabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              data-ocid="admin.product_form.submit_button"
              onClick={handleFormSubmit}
              disabled={formLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {formLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Salvando...
                </>
              ) : editingProduct ? (
                <>
                  <Pencil className="mr-2 h-4 w-4" /> Salvar Alterações
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Product Confirm Modal ───────────────────── */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Remover Produto
            </DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. O produto será removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {deleteConfirmId && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-foreground font-medium">
                  {products.find((p) => p.id === deleteConfirmId)?.name}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.product.delete_cancel_button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancelar
            </Button>
            <Button
              data-ocid="admin.product.delete_confirm_button"
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete User Confirm Modal ──────────────────────── */}
      <Dialog
        open={deleteUserConfirmId !== null}
        onOpenChange={() => setDeleteUserConfirmId(null)}
      >
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Excluir Usuário
            </DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. O usuário, seus pedidos e licenças serão
              removidos permanentemente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {deleteUserConfirmId && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-foreground font-medium">
                  {users.find((u) => u.id === deleteUserConfirmId)?.username}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {users.find((u) => u.id === deleteUserConfirmId)?.email}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.user.delete_cancel_button"
              variant="outline"
              onClick={() => setDeleteUserConfirmId(null)}
            >
              Cancelar
            </Button>
            <Button
              data-ocid="admin.user.delete_confirm_button"
              variant="destructive"
              onClick={() => {
                if (deleteUserConfirmId) {
                  deleteUser(deleteUserConfirmId);
                  setDeleteUserConfirmId(null);
                  toast.success("Usuário excluído.");
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset Orders Confirm Modal ─────────────────────── */}
      <Dialog
        open={resetOrdersConfirm}
        onOpenChange={() => setResetOrdersConfirm(false)}
      >
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2 text-destructive">
              <RefreshCw className="h-5 w-5" />
              Resetar Registro de Receita
            </DialogTitle>
            <DialogDescription>
              Todos os pedidos, licenças e histórico de compras dos usuários
              serão apagados permanentemente. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-foreground font-medium">
                {orders.length} pedido(s) serão removidos
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receita total: R${" "}
                {orders.reduce((s, o) => s + o.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="admin.reset_orders.cancel_button"
              variant="outline"
              onClick={() => setResetOrdersConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              data-ocid="admin.reset_orders.confirm_button"
              variant="destructive"
              onClick={() => {
                resetOrders();
                setResetOrdersConfirm(false);
                toast.success("Registro de receita resetado com sucesso.");
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
