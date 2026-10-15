import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Flame, Shield, LogOut, LogIn, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex h-8 px-2 text-xs rounded-xl text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex h-9 rounded-xl border border-primary-foreground/30 bg-primary-foreground/15 px-4 text-xs font-semibold text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/25 hover:text-primary-foreground"
            >
              <Link to="/login">
                <LogIn className="h-3.5 w-3.5 mr-1" />
                Iniciar sesión
              </Link>
            </Button>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/15"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-primary-foreground/20 px-4 pb-4 pt-2 text-sm font-medium">
          {user && (
            <div className="py-2 text-xs text-primary-foreground/80">
              <span className="font-semibold text-primary-foreground">{user.name}</span> ·{" "}
              {user.role === "admin" ? "Administrador" : "Técnico"}
            </div>
          )}
          <Link to="/" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 hover:bg-primary-foreground/15">
            Inventario
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-primary-foreground/15">
              <Shield className="h-4 w-4" /> Panel Admin
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={() => { setOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-primary-foreground/15"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-primary-foreground/15">
              <LogIn className="h-4 w-4" /> Iniciar sesión
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
