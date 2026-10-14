import { Camera, CheckCircle2, Wrench, AlertTriangle } from "lucide-react";
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

export function StatusBadge({ status, className }: { status: MachineStatus | string; className?: string }) {
  if (status === "operativa") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-success text-success-foreground",
          className,
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Buen estado / Operativa
      </span>
    );
  }

  if (status === "en_revision") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white",
          className,
        )}
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        Para revisión
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-destructive text-destructive-foreground",
        className,
      )}
    >
      <Wrench className="h-3.5 w-3.5" />
      En mantenimiento
    </span>
  );
}
