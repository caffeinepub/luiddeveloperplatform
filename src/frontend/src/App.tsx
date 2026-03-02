import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AdminPage } from "@/pages/AdminPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { MarketplacePage } from "@/pages/MarketplacePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { RouterProvider, useRouter } from "@/store/RouterContext";
import { StoreProvider } from "@/store/StoreContext";

function AppContent() {
  const { currentPage } = useRouter();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "marketplace":
        return <MarketplacePage />;
      case "product-detail":
        return <ProductDetailPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "dashboard":
        return <DashboardPage />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.018 278)",
            border: "1px solid oklch(0.22 0.02 278)",
            color: "oklch(0.96 0.008 278)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </StoreProvider>
  );
}
