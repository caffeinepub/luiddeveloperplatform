import { type ReactNode, createContext, useContext, useState } from "react";

export type Page =
  | "home"
  | "marketplace"
  | "product-detail"
  | "login"
  | "register"
  | "dashboard"
  | "admin"
  | "luid-ai";

interface RouterState {
  currentPage: Page;
  selectedProductId: number | null;
  navigate: (page: Page, productId?: number) => void;
}

const RouterContext = createContext<RouterState | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const navigate = (page: Page, productId?: number) => {
    setCurrentPage(page);
    if (productId !== undefined) setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RouterContext.Provider
      value={{ currentPage, selectedProductId, navigate }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}
