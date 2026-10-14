import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 bg-steel text-industrial-foreground shadow-card">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning text-warning-foreground">
            <Flame className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide">SoldaCheck</span>
        </Link>
        <span className="text-xs uppercase tracking-widest opacity-70">Inspección diaria</span>
      </div>
    </header>
  );
}
