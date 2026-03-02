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

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_ADMIN: User = {
  id: 1,
  username: "SidneiCosta00",
  passwordHash: simpleHash("Nikebolado@4"),
  email: "admin@luiddev.com",
  role: "admin",
  isActive: true,
  createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  purchasedProductIds: [],
};

const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Discord Moderation Bot",
    description:
      "Bot completo de moderação para Discord com anti-spam, auto-ban, sistema de warns, logs detalhados e comandos personalizáveis. Integração com múltiplos servidores.",
    version: "2.1.0",
    category: "discordBots",
    priceOneTime: 29.99,
    priceSubscription: 9.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    rating: 4.8,
    reviewCount: 142,
    tags: ["discord", "moderação", "anti-spam", "bots"],
  },
  {
    id: 2,
    name: "Music Bot Pro",
    description:
      "Player de música avançado para Discord com suporte a Spotify, YouTube e SoundCloud. Filas ilimitadas, efeitos de áudio, playlists e muito mais.",
    version: "1.5.2",
    category: "discordBots",
    priceOneTime: 19.99,
    priceSubscription: 6.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    rating: 4.6,
    reviewCount: 89,
    tags: ["discord", "música", "spotify", "youtube"],
  },
  {
    id: 3,
    name: "Welcome & Roles Bot",
    description:
      "Sistema completo de boas-vindas, atribuição automática de cargos, verificação de membros e mensagens personalizadas com embeds dinâmicos.",
    version: "3.0.1",
    category: "discordBots",
    priceOneTime: 14.99,
    priceSubscription: 4.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    rating: 4.5,
    reviewCount: 67,
    tags: ["discord", "roles", "onboarding", "verificação"],
  },
  {
    id: 4,
    name: "Web Scraper Pro",
    description:
      "Script Python de alto desempenho para raspagem de dados web. Suporte a JavaScript, proxies rotativos, detecção anti-bot e exportação para CSV/JSON/Database.",
    version: "1.2.0",
    category: "automationScripts",
    priceOneTime: 39.99,
    priceSubscription: 12.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    rating: 4.7,
    reviewCount: 203,
    tags: ["python", "scraping", "dados", "automação"],
  },
  {
    id: 5,
    name: "Social Media Scheduler",
    description:
      "Automatize postagens em Instagram, Twitter, LinkedIn e Facebook. Calendário editorial, análise de engajamento, sugestões de horários e relatórios detalhados.",
    version: "2.0.3",
    category: "automationScripts",
    priceOneTime: 49.99,
    priceSubscription: 15.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
    rating: 4.4,
    reviewCount: 156,
    tags: ["social media", "agendamento", "instagram", "twitter"],
  },
  {
    id: 6,
    name: "Email Automation Suite",
    description:
      "Suite completa para automação de e-mail marketing. Sequências de follow-up, personalização dinâmica, A/B testing, segmentação avançada e analytics.",
    version: "1.8.1",
    category: "automationScripts",
    priceOneTime: 34.99,
    priceSubscription: 11.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 19,
    rating: 4.6,
    reviewCount: 98,
    tags: ["email", "marketing", "automação", "newsletter"],
  },
  {
    id: 7,
    name: "AI Content Generator",
    description:
      "Gerador de conteúdo com IA para blogs, redes sociais, e-mails e páginas web. Múltiplos idiomas, ton de voz configurável e integração direta com WordPress/Shopify.",
    version: "1.0.5",
    category: "aiTools",
    priceOneTime: 59.99,
    priceSubscription: 19.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    rating: 4.9,
    reviewCount: 312,
    tags: ["IA", "conteúdo", "GPT", "escrita"],
  },
  {
    id: 8,
    name: "AI Image Enhancer",
    description:
      "Upscaling de imagens com IA até 4x sem perda de qualidade. Remoção de ruído, restauração de fotos antigas, melhoramento de nitidez e processamento em lote.",
    version: "2.2.0",
    category: "aiTools",
    priceOneTime: 44.99,
    priceSubscription: 14.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    rating: 4.7,
    reviewCount: 178,
    tags: ["IA", "imagem", "upscaling", "restauração"],
  },
  {
    id: 9,
    name: "Crypto Price API",
    description:
      "API REST para preços em tempo real de 5000+ criptomoedas. WebSocket para streaming de dados, histórico completo, alertas de preço e integração fácil.",
    version: "3.1.0",
    category: "apis",
    priceOneTime: 24.99,
    priceSubscription: 8.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    rating: 4.5,
    reviewCount: 234,
    tags: ["crypto", "API", "preços", "websocket"],
  },
  {
    id: 10,
    name: "SMS Gateway API",
    description:
      "Gateway SMS com cobertura global em 190+ países. Envio em massa, verificação por OTP, relatórios de entrega, webhooks e SDKs para múltiplas linguagens.",
    version: "1.4.2",
    category: "apis",
    priceOneTime: 49.99,
    priceSubscription: 16.99,
    isActive: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    rating: 4.3,
    reviewCount: 145,
    tags: ["SMS", "API", "gateway", "OTP"],
  },
];

// ─── Store State ──────────────────────────────────────────────────────────────

export interface AppState {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  licenses: License[];
  login: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  addProduct: (
    data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">,
  ) => Product;
  updateProduct: (
    id: number,
    data: Partial<Product> & { _appendVersionHistory?: VersionHistoryEntry },
  ) => void;
  deleteProduct: (id: number) => void;
  toggleProductActive: (id: number) => void;
  toggleUserActive: (id: number) => void;
  deleteUser: (id: number) => void;
  resetOrders: () => void;
  purchaseProduct: (
    productId: number,
    orderType: OrderType,
  ) => { success: boolean; order?: Order; license?: License; error?: string };
  updateUserEmail: (email: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppStore(): AppState {
  const { actor } = useActor();
  const initializedRef = useRef(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const [users, setUsers] = useState<User[]>([SEED_ADMIN]);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize from backend on mount and set up polling
  useEffect(() => {
    if (actor && !initializedRef.current) {
      initializedRef.current = true;
      actor.initialize().catch(() => {
        // Backend initialization is best-effort; in-memory seed data is the fallback
      });
    }
  }, [actor]);

  // Polling mechanism: every 5 seconds, log sync status
  // Real-time sync will be enabled when backend exposes more query functions
  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      // Polling heartbeat — real data sync will be implemented
      // when backend exposes read functions (getProducts, getUsers, etc.)
      // console.log("[LuidDev] polling...");
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const login = useCallback(
    (
      username: string,
      password: string,
    ): { success: boolean; error?: string } => {
      const user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      );
      if (!user) return { success: false, error: "Usuário não encontrado." };
      if (!user.isActive)
        return {
          success: false,
          error: "Conta desativada. Entre em contato com o suporte.",
        };
      const hash = simpleHash(password);
      if (user.passwordHash !== hash)
        return { success: false, error: "Senha incorreta." };
      setCurrentUser(user);
      return { success: true };
    },
    [users],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const register = useCallback(
    (
      username: string,
      email: string,
      password: string,
    ): { success: boolean; error?: string } => {
      const existingUsername = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      );
      if (existingUsername)
        return { success: false, error: "Nome de usuário já está em uso." };
      const existingEmail = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (existingEmail)
        return { success: false, error: "E-mail já cadastrado." };

      const newUser: User = {
        id: Date.now(),
        username,
        email,
        passwordHash: simpleHash(password),
        role: "user",
        isActive: true,
        createdAt: Date.now(),
        purchasedProductIds: [],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true };
    },
    [users],
  );

  const addProduct = useCallback(
    (
      data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">,
    ): Product => {
      const newProduct: Product = {
        ...data,
        id: Date.now(),
        createdAt: Date.now(),
        rating: 0,
        reviewCount: 0,
      };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    },
    [],
  );

  const updateProduct = useCallback(
    (
      id: number,
      data: Partial<Product> & { _appendVersionHistory?: VersionHistoryEntry },
    ) => {
      const { _appendVersionHistory, ...rest } = data;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const updated = { ...p, ...rest };
          if (_appendVersionHistory) {
            updated.versionHistory = [
              ...(p.versionHistory ?? []),
              _appendVersionHistory,
            ];
          }
          return updated;
        }),
      );
    },
    [],
  );

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleProductActive = useCallback((id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  }, []);

  const toggleUserActive = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
    );
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOrders((prev) => prev.filter((o) => o.userId !== id));
    setLicenses((prev) => prev.filter((l) => l.userId !== id));
  }, []);

  const resetOrders = useCallback(() => {
    setOrders([]);
    setLicenses([]);
    setUsers((prev) => prev.map((u) => ({ ...u, purchasedProductIds: [] })));
    setCurrentUser((prev) =>
      prev ? { ...prev, purchasedProductIds: [] } : prev,
    );
  }, []);

  const purchaseProduct = useCallback(
    (
      productId: number,
      orderType: OrderType,
    ): {
      success: boolean;
      order?: Order;
      license?: License;
      error?: string;
    } => {
      if (!currentUser)
        return { success: false, error: "Usuário não autenticado." };

      const product = products.find((p) => p.id === productId);
      if (!product) return { success: false, error: "Produto não encontrado." };

      const orderId = Date.now();
      const licenseKey = generateLicenseKey(currentUser.id, productId, orderId);
      const amount =
        orderType === "oneTime"
          ? product.priceOneTime
          : product.priceSubscription;

      const newOrder: Order = {
        id: orderId,
        userId: currentUser.id,
        productId,
        orderType,
        amount,
        status: "completed",
        createdAt: Date.now(),
        licenseKey,
      };

      const licenseId = orderId + 1;
      const expiresAt =
        orderType === "subscription"
          ? Date.now() + 1000 * 60 * 60 * 24 * 30
          : undefined;

      const newLicense: License = {
        id: licenseId,
        userId: currentUser.id,
        productId,
        orderId,
        key: licenseKey,
        isActive: true,
        expiresAt,
        createdAt: Date.now(),
      };

      setOrders((prev) => [...prev, newOrder]);
      setLicenses((prev) => [...prev, newLicense]);
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          purchasedProductIds: [...prev.purchasedProductIds, productId],
        };
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? {
                ...u,
                purchasedProductIds: [...u.purchasedProductIds, productId],
              }
            : u,
        ),
      );

      return { success: true, order: newOrder, license: newLicense };
    },
    [currentUser, products],
  );

  const updateUserEmail = useCallback(
    (email: string) => {
      if (!currentUser) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, email } : u)),
      );
      setCurrentUser((prev) => (prev ? { ...prev, email } : prev));
    },
    [currentUser],
  );

  return {
    currentUser,
    users,
    products,
    orders,
    licenses,
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
