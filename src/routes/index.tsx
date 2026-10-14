import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/machines";
import { MachinePhoto, StatusBadge } from "@/components/machine-ui";

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
  const ok = machines.filter((m) => m.status === "operativa").length;
  return (
    <div className="animate-in-view space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventario de máquinas</h1>
        <p className="text-muted-foreground">Selecciona una máquina para ver su ficha o realizar el chequeo.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total" value={machines.length} className="text-foreground" />
        <Stat label="Operativas" value={ok} className="text-success" />
        <Stat label="Mantenimiento" value={machines.length - ok} className="text-warning-foreground" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
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
                <p className="text-sm text-muted-foreground">{m.brand} · {m.weldType.join(" / ")}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-card">
      <p className={`font-display text-2xl font-bold ${className}`}>{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
