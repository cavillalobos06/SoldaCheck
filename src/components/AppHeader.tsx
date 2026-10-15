import { Link, useRouter } from "@tanstack/react-router";
import { Flame, Shield, LogOut, LogIn, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 bg-brand text-primary-foreground shadow-glow">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/30 backdrop-blur">
              <Flame className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-wide">SoldaCheck</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <Link
              to="/"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Inventario
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors font-semibold"
              >
                <Shield className="h-4 w-4" />
                Panel Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-primary-foreground">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-primary-foreground/70 flex items-center gap-1">
                  {user.role === "admin" ? (
                    <span className="font-bold">Administrador</span>
                  ) : (
                    <span>Técnico</span>
                  )}
                </span>
              </div>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="sm:hidden flex items-center justify-center h-8 w-8 rounded-xl bg-primary-foreground/15"
                  title="Panel Admin"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-xs rounded-xl text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-9 rounded-xl border border-primary-foreground/30 bg-primary-foreground/15 px-4 text-xs font-semibold text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/25 hover:text-primary-foreground"
            >
              <Link to="/login">
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Iniciar sesión
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
