import { useState } from "react";
import { Boxes, ClipboardCheck, BarChart3, Users, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminSection = "machines" | "history" | "reports" | "users";

export const SECTION_TITLES: Record<AdminSection, string> = {
  machines: "Inventario",
  history: "Historial de checkups",
  reports: "Reportes de mantenimiento",
  users: "Usuarios",
};

const ITEMS: { key: AdminSection; icon: typeof Boxes }[] = [
  { key: "machines", icon: Boxes },
  { key: "history", icon: ClipboardCheck },
  { key: "reports", icon: BarChart3 },
  { key: "users", icon: Users },
];

export function AdminSidebar({ section, onChange }: { section: AdminSection; onChange: (s: AdminSection) => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "shrink-0 transition-all duration-300 lg:sticky lg:top-20 lg:self-start",
        collapsed ? "lg:w-16" : "lg:w-60",
      )}
    >
      <div className="rounded-2xl border bg-card p-2 shadow-card">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mb-1 hidden w-full items-center justify-end rounded-xl p-2 text-muted-foreground hover:bg-muted lg:flex"
          aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {ITEMS.map(({ key, icon: Icon }) => {
            const active = section === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                title={SECTION_TITLES[key]}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active ? "bg-brand text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn("whitespace-nowrap", collapsed && "lg:hidden")}>{SECTION_TITLES[key]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
