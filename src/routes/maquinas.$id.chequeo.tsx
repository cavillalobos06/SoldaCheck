import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { addInspection, CHECKS, type CheckKey, type MachineStatus, useStore } from "@/lib/machines";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/maquinas/$id/chequeo")({
  head: ({ params }) => ({
    meta: [
      { title: `Chequeo ${params.id} — SoldaCheck` },
      { name: "description", content: `Formulario de inspección diaria para la máquina ${params.id}.` },
      { property: "og:title", content: `Chequeo ${params.id} — SoldaCheck` },
      { property: "og:description", content: `Inspección diaria de la máquina ${params.id}.` },
    ],
  }),
  component: Checklist,
});

function Checklist() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { machines } = useStore();
  const m = machines.find((x) => x.id === id);
  const [technician, setTechnician] = useState("");
  const [checks, setChecks] = useState<Partial<Record<CheckKey, boolean>>>({});
  const [status, setStatus] = useState<MachineStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  if (!m) throw notFound();

  const anyFail = Object.values(checks).some((v) => v === false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!technician.trim()) return setError("Indica el nombre del técnico.");
    if (CHECKS.some((c) => checks[c.key] === undefined)) return setError("Responde todos los puntos de inspección.");
    if (!status) return setError("Selecciona el estado general de la máquina.");
    if ((status === "mantenimiento" || anyFail) && notes.trim().length < 10)
      return setError("Describe la falla en observaciones (mínimo 10 caracteres).");
    addInspection({ machineId: m.id, technician: technician.trim(), checks: checks as Record<CheckKey, boolean>, status, notes: notes.trim() });
    setDone(true);
    setTimeout(() => navigate({ to: "/maquinas/$id", params: { id: m.id } }), 1400);
  };

  if (done)
    return (
      <div className="animate-in-view mx-auto max-w-md rounded-lg border bg-card p-8 text-center shadow-card">
        <ShieldCheck className="mx-auto h-14 w-14 text-success" />
        <h1 className="mt-3 text-2xl font-bold">Chequeo registrado</h1>
        <p className="text-muted-foreground">Volviendo a la ficha de {m.id}…</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="animate-in-view mx-auto max-w-2xl space-y-5">
      <Link to="/maquinas/$id" params={{ id: m.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Ficha de la máquina
      </Link>

      <div className="rounded-lg bg-steel p-5 text-industrial-foreground shadow-card">
        <p className="text-xs uppercase tracking-widest opacity-70">Inspección diaria</p>
        <h1 className="text-2xl font-bold">{m.name}</h1>
        <p className="font-mono text-sm opacity-90">{m.id} · {m.location}</p>
      </div>

      <Section title="Técnico responsable">
        <input
          value={technician}
          onChange={(e) => setTechnician(e.target.value)}
          placeholder="Nombre y apellido"
          className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </Section>

      <Section title="Puntos de inspección">
        <div className="space-y-3">
          {CHECKS.map((c) => (
            <div key={c.key} className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.hint}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:w-44">
                <Choice active={checks[c.key] === true} tone="ok" onClick={() => setChecks({ ...checks, [c.key]: true })}>
                  <CheckCircle2 className="h-4 w-4" /> Sí
                </Choice>
                <Choice active={checks[c.key] === false} tone="fail" onClick={() => setChecks({ ...checks, [c.key]: false })}>
                  <XCircle className="h-4 w-4" /> No
                </Choice>
              </div>
            </div>
          ))}
        </div>
        {anyFail && (
          <p className="mt-3 flex items-center gap-2 rounded-lg bg-warning/20 p-3 text-sm text-warning-foreground">
            <AlertTriangle className="h-4 w-4" /> Hay puntos con falla. Justifica el reporte en observaciones.
          </p>
        )}
      </Section>

      <Section title="Estado general">
        <div className="grid gap-3 sm:grid-cols-2">
          <BigStatus active={status === "operativa"} tone="ok" onClick={() => setStatus("operativa")} title="Buen estado" sub="Operativa" />
          <BigStatus active={status === "mantenimiento"} tone="fail" onClick={() => setStatus("mantenimiento")} title="Requiere atención" sub="Fuera de servicio" />
        </div>
      </Section>

      <Section title="Observaciones">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Notas del turno, novedades o descripción de la falla encontrada…"
          className="w-full resize-y rounded-lg border border-input bg-background p-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </Section>

      {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="h-14 w-full text-base">Enviar chequeo</Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-5 shadow-card">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Choice({ active, tone, onClick, children }: { active: boolean; tone: "ok" | "fail"; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-all",
        !active && "bg-card text-muted-foreground hover:border-primary",
        active && tone === "ok" && "border-success bg-success text-success-foreground",
        active && tone === "fail" && "border-destructive bg-destructive text-destructive-foreground",
      )}
    >
      {children}
    </button>
  );
}

function BigStatus({ active, tone, onClick, title, sub }: { active: boolean; tone: "ok" | "fail"; onClick: () => void; title: string; sub: string }) {
  const Icon = tone === "ok" ? ShieldCheck : AlertTriangle;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 p-5 text-left transition-all hover:shadow-lift",
        !active && "border-border bg-background",
        active && tone === "ok" && "border-success bg-success text-success-foreground",
        active && tone === "fail" && "border-destructive bg-destructive text-destructive-foreground",
      )}
    >
      <Icon className={cn("h-8 w-8 shrink-0", !active && (tone === "ok" ? "text-success" : "text-destructive"))} />
      <span>
        <span className="block font-display text-lg font-bold">{title}</span>
        <span className="block text-sm opacity-80">{sub}</span>
      </span>
    </button>
  );
}
