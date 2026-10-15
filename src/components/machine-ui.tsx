import { Camera, CheckCircle2, Wrench, AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MachineStatus } from "@/lib/machines";

export function MachinePhoto({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 bg-placeholder text-muted-foreground", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card/90 shadow-card">
        <Camera className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em]">Foto de la máquina</span>
    </div>
  );
}

const BADGES = {
  operativa: { icon: CheckCircle2, label: "Buen estado", cls: "bg-success/15 text-success ring-success/25" },
  en_revision: { icon: AlertTriangle, label: "Para revisión", cls: "bg-warning/20 text-warning-strong ring-warning/30" },
  mantenimiento: { icon: Wrench, label: "En mantenimiento", cls: "bg-destructive/12 text-destructive ring-destructive/25" },
} as const;

export function StatusBadge({ status, className }: { status: MachineStatus | string; className?: string }) {
  const b = BADGES[(status in BADGES ? status : "mantenimiento") as keyof typeof BADGES];
  const Icon = b.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 backdrop-blur-sm",
        b.cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {b.label}
    </span>
  );
}

const TONES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/20 text-warning-strong",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export function KpiCard({
  icon: Icon,
  tone,
  value,
  label,
  active,
  onClick,
  className,
}: {
  icon: LucideIcon;
  tone: keyof typeof TONES;
  value: number;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-transparent bg-card p-4 text-left shadow-card transition-all duration-200",
        onClick && "hover:-translate-y-0.5 hover:shadow-lift",
        active && "border-primary/40 ring-2 ring-primary/20",
        className,
      )}
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-display text-2xl font-bold leading-none">{value}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
      </span>
    </Comp>
  );
}
