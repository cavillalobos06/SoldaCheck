import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Search, Shield } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/machines";
import { useAuth } from "@/lib/auth-context";
import { MachinePhoto, StatusBadge } from "@/components/machine-ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inventario de máquinas — SoldaCheck" },
      { name: "description", content: "Listado de máquinas de soldadura y su último estado de inspección." },
      { property: "og:title", content: "Inventario de máquinas — SoldaCheck" },
      { property: "og:description", content: "Listado de máquinas de soldadura y su último estado de inspección." },
    ],
  }),
  component: Index,
});

function Index() {
  const { machines } = useStore();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const total = machines.length;
  const operativas = machines.filter((m) => m.status === "operativa").length;
  const enRevision = machines.filter((m) => m.status === "en_revision").length;
  const mantenimiento = machines.filter((m) => m.status === "mantenimiento").length;

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-in-view space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario de máquinas</h1>
          <p className="text-muted-foreground">
            Consulta el estado operativo, especificaciones y fichas técnicas de los equipos.
          </p>
        </div>
        {isAdmin && (
          <Button asChild className="bg-warning text-warning-foreground hover:bg-warning/90 font-semibold self-start sm:self-auto">
            <Link to="/admin">
              <Shield className="h-4 w-4 mr-2" />
              Administrar recursos
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-left rounded-lg border p-3.5 transition-all ${
            statusFilter === "all" ? "ring-2 ring-primary border-primary bg-primary/5" : "bg-card hover:border-muted-foreground/30"
          }`}
        >
          <p className="font-display text-2xl font-bold text-foreground">{total}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total máquinas</p>
        </button>

        <button
          onClick={() => setStatusFilter("operativa")}
          className={`text-left rounded-lg border p-3.5 transition-all ${
            statusFilter === "operativa" ? "ring-2 ring-success border-success bg-success/5" : "bg-card hover:border-muted-foreground/30"
          }`}
        >
          <p className="font-display text-2xl font-bold text-success">{operativas}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">En buen estado</p>
        </button>

        <button
          onClick={() => setStatusFilter("en_revision")}
          className={`text-left rounded-lg border p-3.5 transition-all ${
            statusFilter === "en_revision" ? "ring-2 ring-amber-500 border-amber-500 bg-amber-500/5" : "bg-card hover:border-muted-foreground/30"
          }`}
        >
          <p className="font-display text-2xl font-bold text-amber-500">{enRevision}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Para revisión</p>
        </button>

        <button
          onClick={() => setStatusFilter("mantenimiento")}
          className={`text-left rounded-lg border p-3.5 transition-all ${
            statusFilter === "mantenimiento" ? "ring-2 ring-destructive border-destructive bg-destructive/5" : "bg-card hover:border-muted-foreground/30"
          }`}
        >
          <p className="font-display text-2xl font-bold text-destructive">{mantenimiento}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">En mantenimiento</p>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar máquina por código, modelo, marca o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-11 bg-card"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-lg border bg-card p-6">
          <p className="text-lg font-semibold text-muted-foreground">No se encontraron máquinas con los filtros actuales.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="mt-4"
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Link
              key={m.id}
              to="/maquinas/$id"
              params={{ id: m.id }}
              className="group overflow-hidden rounded-lg border bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lift"
            >
              <div className="relative">
                <MachinePhoto className="h-40" />
                <StatusBadge status={m.status} className="absolute right-3 top-3" />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-mono text-xs font-semibold text-primary">{m.id}</p>
                  <h2 className="text-lg font-semibold leading-tight">{m.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {m.brand} · {Array.isArray(m.weldType) ? m.weldType.join(" / ") : m.weldType}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-1">📍 {m.location}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
