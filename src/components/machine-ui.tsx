import { Camera, CheckCircle2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MachineStatus } from "@/lib/machines";

export function MachinePhoto({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 bg-placeholder text-muted-foreground", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card/80 shadow-card">
        <Camera className="h-5 w-5" />
      </span>
      <span className="text-xs font-medium uppercase tracking-wider">Foto de la máquina</span>
    </div>
  );
}

export function StatusBadge({ status, className }: { status: MachineStatus; className?: string }) {
  const ok = status === "operativa";
  const Icon = ok ? CheckCircle2 : Wrench;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
        ok ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {ok ? "Operativa" : "En mantenimiento"}
    </span>
  );
}
