import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Shield, Wrench, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CenteredCard, CardActions } from "@/components/CenteredCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — SoldaCheck" },
      { name: "description", content: "Acceso seguro a la plataforma SoldaCheck." },
      { property: "og:title", content: "Iniciar sesión — SoldaCheck" },
      { property: "og:description", content: "Acceso seguro a la plataforma SoldaCheck." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, login, logout, isAdmin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === "admin") {
        router.navigate({ to: "/admin" });
      } else {
        router.navigate({ to: "/" });
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setError(null);
  };

  if (user) {
    return (
      <CenteredCard className="mx-4 my-6 sm:mx-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold sm:text-2xl">Sesión activa</h1>
        <p className="mt-2 break-words text-sm text-muted-foreground">
          Has iniciado sesión como <strong className="text-foreground">{user.name}</strong>
          <span className="block break-all">{user.email}</span>
        </p>
        <div className="mt-5 flex flex-col items-center justify-between gap-2 rounded-xl border border-border bg-muted/60 p-3 text-sm sm:flex-row">
          <span className="text-muted-foreground">Rol actual</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            {user.role === "admin" ? <Shield className="h-3.5 w-3.5" /> : <Wrench className="h-3.5 w-3.5" />}
            {user.role === "admin" ? "Administrador" : "Técnico"}
          </span>
        </div>
        <CardActions>
          <Button variant="outline" onClick={logout} className="h-11 rounded-xl">
            Cerrar sesión
          </Button>
          <Button asChild className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
            {isAdmin ? <Link to="/admin">Ir al Panel Admin</Link> : <Link to="/">Ir al Inventario</Link>}
          </Button>
        </CardActions>
      </CenteredCard>
    );
  }

  return (
<<<<<<< HEAD
    <div className="relative left-1/2 right-1/2 -mx-[50vw] -my-6 flex min-h-[calc(100vh-3.5rem)] w-screen items-center justify-center overflow-hidden bg-aurora px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-card/60 bg-card/60 shadow-lift backdrop-blur-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-brand p-10 text-primary-foreground md:flex">
=======
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="grid w-full min-w-0 max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lift md:max-w-5xl md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="hidden min-w-0 flex-col justify-between gap-12 bg-brand p-8 text-primary-foreground md:flex lg:p-12">
>>>>>>> efeb7eaca2837470274262db445fc871495bb002
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/30">
            <Flame className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Cada máquina, revisada a tiempo.</h2>
            <p className="mt-3 text-sm text-primary-foreground/75">
              Checklists diarios, historial de inspecciones y estado de la flota en un solo lugar.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/60">SoldaCheck · Gestión de soldadura</p>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-5 p-5 sm:p-8 lg:p-12">
          <div>
            <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
            <p className="mt-1 text-sm text-muted-foreground">Ingresa para gestionar tus máquinas.</p>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl py-2.5">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Código de empleado / Correo</Label>
            <div className="group relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                type="email"
                placeholder="ej: admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-card pl-11 transition-all focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-card pl-11 transition-all focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/15"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-brand font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 hover:opacity-95"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="space-y-2 border-t pt-4">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accesos de prueba</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleQuickLogin("admin@example.com")}
                className="h-auto min-w-0 flex-col gap-1 whitespace-normal rounded-xl bg-card p-2.5 text-xs hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="flex items-center gap-1 font-semibold"><Shield className="h-3.5 w-3.5 text-primary" /> Admin</span>
                <span className="max-w-full break-all text-[10px] text-muted-foreground">admin@example.com</span>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleQuickLogin("user@example.com")}
                className="h-auto min-w-0 flex-col gap-1 whitespace-normal rounded-xl bg-card p-2.5 text-xs hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="flex items-center gap-1 font-semibold"><Wrench className="h-3.5 w-3.5 text-primary" /> Técnico</span>
                <span className="max-w-full break-all text-[10px] text-muted-foreground">user@example.com</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
