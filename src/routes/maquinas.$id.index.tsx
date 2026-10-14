import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";
import { CHECKS, formatDate, useStore } from "@/lib/machines";
import { MachinePhoto, StatusBadge } from "@/components/machine-ui";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/maquinas/$id/")({
  head: ({ params }) => ({
    meta: [
      { title: `Ficha ${params.id} — SoldaCheck` },
      { name: "description", content: `Ficha técnica e historial de chequeos de la máquina ${params.id}.` },
      { property: "og:title", content: `Ficha ${params.id} — SoldaCheck` },
      { property: "og:description", content: `Ficha técnica e historial de la máquina ${params.id}.` },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { machines, inspections } = useStore();
  const m = machines.find((x) => x.id === id);
  if (!m) throw notFound();
  const history = inspections.filter((i) => i.machineId === id).slice(0, 5);
  const specs = [
    ["Marca", m.brand], ["Modelo", m.model], ["Proceso", m.weldType.join(" / ")],
    ["Voltaje", m.voltage], ["Amperaje", m.amperage], ["Ciclo de trabajo", m.dutyCycle], ["Ubicación", m.location],
  ];

  return (
    <div className="animate-in-view space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Inventario
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          <MachinePhoto className="h-56 sm:h-72" />
          <div className="space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-sm font-semibold text-primary">{m.id}</p>
              <StatusBadge status={m.status} />
            </div>
            <h1 className="text-3xl font-bold">{m.name}</h1>
            <Button asChild size="lg" className="h-12 w-full text-base">
              <Link to="/maquinas/$id/chequeo" params={{ id: m.id }}>
                <ClipboardCheck className="h-5 w-5" /> Iniciar chequeo diario
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-xl font-semibold">Ficha técnica</h2>
          <dl className="divide-y">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section className="rounded-lg border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-xl font-semibold">Últimos chequeos</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay inspecciones registradas.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={h.id} className="rounded-lg border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{h.technician} <span className="font-normal text-muted-foreground">· {formatDate(h.date)}</span></p>
                  <StatusBadge status={h.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {CHECKS.map((c) => (
                    <span key={c.key} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      {h.checks[c.key] ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                      {c.label.replace(/[¿?]/g, "")}
                    </span>
                  ))}
                </div>
                {h.notes && <p className="mt-2 text-sm">{h.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
