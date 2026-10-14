import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Shield, Wrench, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — SoldaCheck" },
      { name: "description", content: "Acceso seguro a la plataforma SoldaCheck." },
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
      <div className="max-w-md mx-auto py-12">
        <Card className="shadow-lift border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle>Sesión activa</CardTitle>
            <CardDescription>
              Has iniciado sesión como <strong className="text-foreground">{user.name}</strong> ({user.email})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-muted p-3 text-sm flex items-center justify-between">
              <span className="text-muted-foreground">Rol actual:</span>
              <span className="font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-background border">
                {user.role === "admin" ? "👑 Administrador" : "👷 Técnico"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {isAdmin ? (
              <Button asChild className="w-full bg-warning text-warning-foreground hover:bg-warning/90 font-semibold">
                <Link to="/admin">Ir al Panel de Administrador</Link>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to="/">Ir al Inventario de Máquinas</Link>
              </Button>
            )}
            <Button variant="outline" onClick={logout} className="w-full">
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="shadow-lift border-muted">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-warning text-warning-foreground mb-2">
            <Flame className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Acceso a SoldaCheck</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a la gestión de máquinas
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2.5">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ej: admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full font-semibold">
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Quick Demo Credentials */}
            <div className="pt-4 border-t space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                Accesos de prueba rápidos
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin@example.com")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border bg-card hover:bg-warning/10 hover:border-warning text-xs transition-all text-left"
                >
                  <span className="font-semibold flex items-center gap-1 text-foreground">
                    <Shield className="h-3.5 w-3.5 text-warning" /> Admin
                  </span>
                  <span className="text-[10px] text-muted-foreground">admin@example.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("user@example.com")}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border bg-card hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20 text-xs transition-all text-left"
                >
                  <span className="font-semibold flex items-center gap-1 text-foreground">
                    <Wrench className="h-3.5 w-3.5 text-blue-500" /> Técnico
                  </span>
                  <span className="text-[10px] text-muted-foreground">user@example.com</span>
                </button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
