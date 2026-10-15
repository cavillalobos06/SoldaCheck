import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useStore, formatDate } from "@/lib/machines";
import { StatusBadge } from "@/components/machine-ui";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function AdminAnalytics() {
  const { machines, inspections } = useStore();

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const day = inspections.filter((x) => new Date(x.date).toDateString() === key);
    return {
      dia: DAYS[d.getDay()],
      checkups: day.length,
      incidencias: day.filter((x) => x.status !== "operativa").length,
    };
  });

  const pie = [
    { name: "Buen estado", value: machines.filter((m) => m.status === "operativa").length, color: "var(--success)" },
    { name: "Revisión", value: machines.filter((m) => m.status === "en_revision").length, color: "var(--warning)" },
    { name: "Mantenimiento", value: machines.filter((m) => m.status === "mantenimiento").length, color: "var(--destructive)" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border bg-card p-5 shadow-card lg:col-span-2">
        <h3 className="font-semibold">Checkups e incidencias · últimos 7 días</h3>
        <p className="text-xs text-muted-foreground">Inspecciones registradas por día</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={24} />
              <Tooltip cursor={{ fill: "var(--muted)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
              <Bar dataKey="checkups" name="Checkups" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="incidencias" name="Incidencias" fill="var(--warning)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <h3 className="font-semibold">Estado de la flota</h3>
        <p className="text-xs text-muted-foreground">Distribución actual</p>
        <div className="mt-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pie} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                {pie.map((p) => (
                  <Cell key={p.name} fill={p.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1.5 text-sm">
          {pie.map((p) => (
            <li key={p.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                {p.name}
              </span>
              <span className="font-semibold">{p.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function InspectionHistory() {
  const { inspections, machines } = useStore();
  if (inspections.length === 0) {
    return <p className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">Aún no hay checkups registrados.</p>;
  }
  return (
    <div className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
      {inspections.map((i) => {
        const m = machines.find((x) => x.id === i.machineId);
        return (
          <div key={i.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold text-primary">{i.machineId}</p>
              <p className="font-medium">{m?.name ?? "Máquina"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(i.date)} · {i.technician}
                {i.notes ? ` · ${i.notes}` : ""}
              </p>
            </div>
            <StatusBadge status={i.status} />
          </div>
        );
      })}
    </div>
  );
}
