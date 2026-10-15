import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Search, Shield, MapPin, Factory, CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/machines";
import { useAuth } from "@/lib/auth-context";
import { MachinePhoto, StatusBadge, KpiCard } from "@/components/machine-ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inventario de máquinas — SoldaCheck" },
      { name: "description", content: "Listado de máquinas de soldadura y su último estado de inspección." },
      { property: "og:title", content: "Inventario de máquinas — SoldaCheck" },
      { property: "og:description", content: "Listado de máquinas de soldadura y su último estado de inspección." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
          <Button asChild className="rounded-xl bg-brand text-primary-foreground shadow-glow hover:opacity-95 font-semibold self-start sm:self-auto">
            <Link to="/admin">
              <Shield className="h-4 w-4 mr-2" />
              Administrar recursos
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard icon={Factory} tone="primary" value={total} label="Total máquinas" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
        <KpiCard icon={CheckCircle2} tone="success" value={operativas} label="Buen estado" active={statusFilter === "operativa"} onClick={() => setStatusFilter("operativa")} />
        <KpiCard icon={AlertTriangle} tone="warning" value={enRevision} label="Para revisión" active={statusFilter === "en_revision"} onClick={() => setStatusFilter("en_revision")} />
        <KpiCard icon={Wrench} tone="destructive" value={mantenimiento} label="En mantenimiento" active={statusFilter === "mantenimiento"} onClick={() => setStatusFilter("mantenimiento")} />
      </div>

      <div className="group relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" strokeWidth={2.25} />
        <Input
          placeholder="Buscar por código, modelo, marca o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-12 rounded-2xl border-transparent bg-card pl-11 shadow-card transition-all focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/15"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-card p-6 shadow-card">
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
              className="group overflow-hidden rounded-2xl border border-transparent bg-card shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
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
                  <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary/70" />{m.location}</p>
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
