import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/store/RouterContext";
import { useStore } from "@/store/StoreContext";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { currentUser, logout } = useStore();
  const { navigate, currentPage } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("home");
    setMobileOpen(false);
  };

  const navLink = (
    page: Parameters<typeof navigate>[0],
    label: string,
    ocid: string,
  ) => (
    <button
      type="button"
      data-ocid={ocid}
      onClick={() => {
        navigate(page);
        setMobileOpen(false);
      }}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        currentPage === page ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.home_link"
          onClick={() => {
            navigate("home");
            setMobileOpen(false);
          }}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/40 group-hover:bg-primary/30 transition-colors">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            <span className="text-foreground">Luid</span>
            <span className="text-gradient">Dev</span>
            <span className="ml-1.5 text-[10px] font-normal text-muted-foreground hidden sm:inline">
              by LuidCorporation
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLink("home", "Início", "nav.home_link")}
          {navLink("marketplace", "Marketplace", "nav.marketplace_link")}
          {currentUser &&
            navLink("dashboard", "Dashboard", "nav.dashboard_link")}
          {currentUser?.role === "admin" &&
            navLink("admin", "Admin", "nav.admin_link")}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {currentUser.username}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate("dashboard")}
                  data-ocid="nav.dashboard_link"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {currentUser.role === "admin" && (
                  <DropdownMenuItem
                    onClick={() => navigate("admin")}
                    data-ocid="nav.admin_link"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Painel Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  data-ocid="nav.logout_button"
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                data-ocid="nav.login_button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("login")}
              >
                Entrar
              </Button>
              <Button
                data-ocid="nav.register_button"
                size="sm"
                onClick={() => navigate("register")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Criar Conta
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            <button
              type="button"
              data-ocid="nav.home_link"
              onClick={() => {
                navigate("home");
                setMobileOpen(false);
              }}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
            >
              Início
            </button>
            <button
              type="button"
              data-ocid="nav.marketplace_link"
              onClick={() => {
                navigate("marketplace");
                setMobileOpen(false);
              }}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
            >
              Marketplace
            </button>
            {currentUser && (
              <button
                type="button"
                data-ocid="nav.dashboard_link"
                onClick={() => {
                  navigate("dashboard");
                  setMobileOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
              >
                Dashboard
              </button>
            )}
            {currentUser?.role === "admin" && (
              <button
                type="button"
                data-ocid="nav.admin_link"
                onClick={() => {
                  navigate("admin");
                  setMobileOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
              >
                Painel Admin
              </button>
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
              {currentUser ? (
                <button
                  type="button"
                  data-ocid="nav.logout_button"
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 text-left"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair ({currentUser.username})
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    data-ocid="nav.login_button"
                    onClick={() => {
                      navigate("login");
                      setMobileOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left"
                  >
                    Entrar
                  </button>
                  <Button
                    data-ocid="nav.register_button"
                    size="sm"
                    onClick={() => {
                      navigate("register");
                      setMobileOpen(false);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Criar Conta
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
