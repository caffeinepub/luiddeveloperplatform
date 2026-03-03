import { useActor } from "@/hooks/useActor";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";
export type Category = "discordBots" | "automationScripts" | "aiTools" | "apis";
export type OrderType = "oneTime" | "subscription";
export type OrderStatus = "completed" | "pending" | "refunded";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  purchasedProductIds: number[];
}

export interface VersionHistoryEntry {
  version: string;
  note?: string;
  updatedAt: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  version: string;
  category: Category;
  priceOneTime: number;
  priceSubscription: number;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  updatedAt?: number;
  updateNote?: string;
  versionHistory?: VersionHistoryEntry[];
  isActive: boolean;
  createdAt: number;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  orderType: OrderType;
  amount: number;
  status: OrderStatus;
  createdAt: number;
  licenseKey: string;
}

export interface License {
  id: number;
  userId: number;
  productId: number;
  orderId: number;
  key: string;
  isActive: boolean;
  expiresAt?: number;
  createdAt: number;
}

// ─── Utils ───────────────────────────────────────────────────────────────────

export function simpleHash(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) + hash + text.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function generateLicenseKey(
  userId: number,
  productId: number,
  orderId: number,
): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const seed = `${userId}-${productId}-${orderId}-${Date.now()}`;
  const hash = simpleHash(seed);
  const parts: string[] = [];
  for (let i = 0; i < 3; i++) {
    let part = "";
    for (let j = 0; j < 4; j++) {
      const idx = Number.parseInt(hash[(i * 4 + j) % hash.length], 16) % 36;
      part += chars[idx];
    }
    parts.push(part);
  }
  return `LUID-${parts.join("-")}`;
}

// ─── Candid Converters ────────────────────────────────────────────────────────

function candidCategoryToTs(c: unknown): Category {
  if (c && typeof c === "object") {
    if ("discordBots" in c) return "discordBots";
    if ("automationScripts" in c) return "automationScripts";
    if ("aiTools" in c) return "aiTools";
  }
  return "apis";
}

function tsCategoryToCandid(c: Category): unknown {
  return { [c]: null };
}

function candidRoleToTs(r: unknown): UserRole {
  if (r && typeof r === "object" && "admin" in r) return "admin";
  return "user";
}

function candidOrderTypeToTs(t: unknown): OrderType {
  if (t && typeof t === "object" && "subscription" in t) return "subscription";
  return "oneTime";
}

function tsOrderTypeToCandid(t: OrderType): unknown {
  return { [t]: null };
}

function candidOrderStatusToTs(s: unknown): OrderStatus {
  if (s && typeof s === "object") {
    if ("refunded" in s) return "refunded";
    if ("completed" in s) return "completed";
  }
  return "pending";
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(u: any): User {
  return {
    id: Number(u.id),
    username: u.username,
    passwordHash: u.passwordHash,
    email: u.email,
    role: candidRoleToTs(u.role),
    isActive: u.isActive,
    createdAt: Number(u.createdAt),
    purchasedProductIds: (u.purchasedProductIds ?? []).map(Number),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  return {
    id: Number(p.id),
    name: p.name,
    description: p.description,
    version: p.version,
    category: candidCategoryToTs(p.category),
    priceOneTime: p.priceOneTime,
    priceSubscription: p.priceSubscription,
    fileId: p.fileId && p.fileId.length > 0 ? p.fileId[0] : undefined,
    fileName: p.fileName && p.fileName.length > 0 ? p.fileName[0] : undefined,
    fileSize:
      p.fileSize && p.fileSize.length > 0 ? Number(p.fileSize[0]) : undefined,
    updatedAt:
      p.updatedAt && p.updatedAt.length > 0
        ? Number(p.updatedAt[0])
        : undefined,
    updateNote:
      p.updateNote && p.updateNote.length > 0 ? p.updateNote[0] : undefined,
    versionHistory: (p.versionHistory ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: any): VersionHistoryEntry => ({
        version: v.version,
        note: v.note && v.note.length > 0 ? v.note[0] : undefined,
        updatedAt: Number(v.updatedAt),
      }),
    ),
    isActive: p.isActive,
    createdAt: Number(p.createdAt),
    rating: p.rating ?? 0,
    reviewCount: Number(p.reviewCount ?? 0),
    tags: p.tags ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(o: any): Order {
  return {
    id: Number(o.id),
    userId: Number(o.userId),
    productId: Number(o.productId),
    orderType: candidOrderTypeToTs(o.orderType),
    amount: o.amount,
    status: candidOrderStatusToTs(o.status),
    createdAt: Number(o.createdAt),
    licenseKey: o.licenseKey,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLicense(l: any): License {
  return {
    id: Number(l.id),
    userId: Number(l.userId),
    productId: Number(l.productId),
    orderId: Number(l.orderId),
    key: l.key,
    isActive: l.isActive,
    expiresAt:
      l.expiresAt && l.expiresAt.length > 0
        ? Number(l.expiresAt[0])
        : undefined,
    createdAt: Number(l.createdAt),
  };
}

// ─── Store State ──────────────────────────────────────────────────────────────

export interface AppState {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  licenses: License[];
  isLoading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  addProduct: (
    data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">,
  ) => Promise<Product>;
  updateProduct: (
    id: number,
    data: Partial<Product> & { _appendVersionHistory?: VersionHistoryEntry },
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleProductActive: (id: number) => Promise<void>;
  toggleUserActive: (id: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  resetOrders: () => Promise<void>;
  purchaseProduct: (
    productId: number,
    orderType: OrderType,
  ) => Promise<{
    success: boolean;
    order?: Order;
    license?: License;
    error?: string;
  }>;
  updateUserEmail: (email: string) => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppStore(): AppState {
  const { actor } = useActor();
  const initializedRef = useRef(false);

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── refreshAll ──────────────────────────────────────────────────────────
  const refreshAll = useCallback(async () => {
    if (!actor) return;
    try {
      const [us, ps, os, ls] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).getUsers(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).getProducts(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).getOrders(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (actor as any).getLicenses(),
      ]);
      setUsers((us as unknown[]).map(mapUser));
      setProducts((ps as unknown[]).map(mapProduct));
      setOrders((os as unknown[]).map(mapOrder));
      setLicenses((ls as unknown[]).map(mapLicense));
    } catch (e) {
      console.error("[LuidDev] refreshAll error:", e);
    }
  }, [actor]);

  // ── Init on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!actor || initializedRef.current) return;
    initializedRef.current = true;
    setIsLoading(true);
    actor
      .initialize()
      .then(() => refreshAll())
      .finally(() => setIsLoading(false));
  }, [actor, refreshAll]);

  // ── Polling every 8s ────────────────────────────────────────────────────
  useEffect(() => {
    if (!actor) return;
    const interval = setInterval(() => {
      refreshAll();
    }, 8000);
    return () => clearInterval(interval);
  }, [actor, refreshAll]);

  // ── Auth ─────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!actor)
        return { success: false, error: "Serviço indisponível. Aguarde..." };
      try {
        const hash = simpleHash(password);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).login(username, hash);
        if ("err" in result) return { success: false, error: result.err };
        const user = mapUser(result.ok);
        setCurrentUser(user);
        return { success: true };
      } catch (e) {
        console.error("[LuidDev] login error:", e);
        return {
          success: false,
          error: "Erro ao fazer login. Tente novamente.",
        };
      }
    },
    [actor],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!actor)
        return { success: false, error: "Serviço indisponível. Aguarde..." };
      try {
        const hash = simpleHash(password);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).register(username, email, hash);
        if ("err" in result) return { success: false, error: result.err };
        const user = mapUser(result.ok);
        setCurrentUser(user);
        // Refresh users list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allUsers = await (actor as any).getUsers();
        setUsers((allUsers as unknown[]).map(mapUser));
        return { success: true };
      } catch (e) {
        console.error("[LuidDev] register error:", e);
        return {
          success: false,
          error: "Erro ao criar conta. Tente novamente.",
        };
      }
    },
    [actor],
  );

  // ── Products ─────────────────────────────────────────────────────────────

  const addProduct = useCallback(
    async (
      data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">,
    ): Promise<Product> => {
      if (!actor) throw new Error("Actor indisponível");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = await (actor as any).addProduct(
        data.name,
        data.description,
        data.version,
        tsCategoryToCandid(data.category),
        data.priceOneTime,
        data.priceSubscription,
        data.fileId ? [data.fileId] : [],
        data.fileName ? [data.fileName] : [],
        data.fileSize ? [BigInt(data.fileSize)] : [],
        data.tags,
      );
      const mapped = mapProduct(p);
      setProducts((prev) => [...prev, mapped]);
      return mapped;
    },
    [actor],
  );

  const updateProduct = useCallback(
    async (
      id: number,
      data: Partial<Product> & { _appendVersionHistory?: VersionHistoryEntry },
    ): Promise<void> => {
      if (!actor) return;
      const { _appendVersionHistory, ...rest } = data;
      const appendEntry = _appendVersionHistory
        ? [
            {
              version: _appendVersionHistory.version,
              note: _appendVersionHistory.note
                ? [_appendVersionHistory.note]
                : [],
              updatedAt: BigInt(_appendVersionHistory.updatedAt),
            },
          ]
        : [];
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).updateProduct(
          BigInt(id),
          rest.name ? [rest.name] : [],
          rest.description ? [rest.description] : [],
          rest.version ? [rest.version] : [],
          rest.category ? [tsCategoryToCandid(rest.category)] : [],
          rest.priceOneTime !== undefined ? [rest.priceOneTime] : [],
          rest.priceSubscription !== undefined ? [rest.priceSubscription] : [],
          rest.fileId !== undefined ? [rest.fileId] : [],
          rest.fileName !== undefined ? [rest.fileName] : [],
          rest.fileSize !== undefined ? [BigInt(rest.fileSize)] : [],
          rest.isActive !== undefined ? [rest.isActive] : [],
          rest.updateNote ? [rest.updateNote] : [],
          appendEntry,
        );
        if (result && "ok" in result) {
          const mapped = mapProduct(result.ok);
          setProducts((prev) => prev.map((p) => (p.id === id ? mapped : p)));
        }
      } catch (e) {
        console.error("[LuidDev] updateProduct error:", e);
      }
    },
    [actor],
  );

  const deleteProduct = useCallback(
    async (id: number): Promise<void> => {
      if (!actor) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).deleteProduct(BigInt(id));
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        console.error("[LuidDev] deleteProduct error:", e);
      }
    },
    [actor],
  );

  const toggleProductActive = useCallback(
    async (id: number): Promise<void> => {
      if (!actor) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).toggleProductActive(BigInt(id));
        if (result && "ok" in result) {
          const mapped = mapProduct(result.ok);
          setProducts((prev) => prev.map((p) => (p.id === id ? mapped : p)));
        }
      } catch (e) {
        console.error("[LuidDev] toggleProductActive error:", e);
      }
    },
    [actor],
  );

  // ── Users ─────────────────────────────────────────────────────────────────

  const toggleUserActive = useCallback(
    async (id: number): Promise<void> => {
      if (!actor) return;
      try {
        const currentActive = users.find((u) => u.id === id)?.isActive ?? true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).updateUser(BigInt(id), [!currentActive], [], []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allUsers = await (actor as any).getUsers();
        setUsers((allUsers as unknown[]).map(mapUser));
      } catch (e) {
        console.error("[LuidDev] toggleUserActive error:", e);
      }
    },
    [actor, users],
  );

  const deleteUser = useCallback(
    async (id: number): Promise<void> => {
      if (!actor) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).deleteUser(BigInt(id));
        await refreshAll();
      } catch (e) {
        console.error("[LuidDev] deleteUser error:", e);
      }
    },
    [actor, refreshAll],
  );

  // ── Orders / Reset ────────────────────────────────────────────────────────

  const resetOrders = useCallback(async (): Promise<void> => {
    if (!actor) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).resetOrders();
      await refreshAll();
    } catch (e) {
      console.error("[LuidDev] resetOrders error:", e);
    }
  }, [actor, refreshAll]);

  // ── Purchase ─────────────────────────────────────────────────────────────

  const purchaseProduct = useCallback(
    async (
      productId: number,
      orderType: OrderType,
    ): Promise<{
      success: boolean;
      order?: Order;
      license?: License;
      error?: string;
    }> => {
      if (!actor) return { success: false, error: "Serviço indisponível." };
      if (!currentUser)
        return { success: false, error: "Usuário não autenticado." };

      const product = products.find((p) => p.id === productId);
      if (!product) return { success: false, error: "Produto não encontrado." };

      try {
        const orderId = Date.now();
        const licenseKey = generateLicenseKey(
          currentUser.id,
          productId,
          orderId,
        );
        const amount =
          orderType === "oneTime"
            ? product.priceOneTime
            : product.priceSubscription;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const order = await (actor as any).createOrder(
          BigInt(currentUser.id),
          BigInt(productId),
          tsOrderTypeToCandid(orderType),
          amount,
          licenseKey,
        );

        const expiresAt: [bigint] | [] =
          orderType === "subscription"
            ? [BigInt(Date.now() + 1000 * 60 * 60 * 24 * 30)]
            : [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const license = await (actor as any).createLicense(
          BigInt(currentUser.id),
          BigInt(productId),
          order.id,
          licenseKey,
          expiresAt,
        );

        // Update user's purchasedProductIds
        const newPurchased = [...currentUser.purchasedProductIds, productId];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).updateUser(
          BigInt(currentUser.id),
          [],
          [],
          [newPurchased.map(BigInt)],
        );

        // Refresh all state
        await refreshAll();

        // Update currentUser in memory
        setCurrentUser((prev) =>
          prev ? { ...prev, purchasedProductIds: newPurchased } : prev,
        );

        return {
          success: true,
          order: mapOrder(order),
          license: mapLicense(license),
        };
      } catch (e) {
        console.error("[LuidDev] purchaseProduct error:", e);
        return {
          success: false,
          error: "Erro ao processar compra. Tente novamente.",
        };
      }
    },
    [actor, currentUser, products, refreshAll],
  );

  // ── Profile ───────────────────────────────────────────────────────────────

  const updateUserEmail = useCallback(
    async (email: string): Promise<void> => {
      if (!actor || !currentUser) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).updateUser(
          BigInt(currentUser.id),
          [],
          [email],
          [],
        );
        setCurrentUser((prev) => (prev ? { ...prev, email } : prev));
        setUsers((prev) =>
          prev.map((u) => (u.id === currentUser.id ? { ...u, email } : u)),
        );
      } catch (e) {
        console.error("[LuidDev] updateUserEmail error:", e);
      }
    },
    [actor, currentUser],
  );

  return {
    currentUser,
    users,
    products,
    orders,
    licenses,
    isLoading,
    login,
    logout,
    register,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    toggleUserActive,
    deleteUser,
    resetOrders,
    purchaseProduct,
    updateUserEmail,
  };
}
