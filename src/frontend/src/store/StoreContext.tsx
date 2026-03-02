import { type ReactNode, createContext, useContext } from "react";
import { type AppState, useAppStore } from "./useAppStore";

const StoreContext = createContext<AppState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): AppState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
