import { useSyncExternalStore } from "react";

export type MachineStatus = "operativa" | "mantenimiento";
export type WeldType = "MIG" | "TIG" | "MMA";

export interface Inspection {
  id: string;
  machineId: string;
  date: string;
  technician: string;
  checks: Record<CheckKey, boolean>;
  status: MachineStatus;
  notes: string;
}

export interface Machine {
  id: string;
  name: string;
  brand: string;
  model: string;
  weldType: WeldType[];
  voltage: string;
  amperage: string;
  dutyCycle: string;
  location: string;
  status: MachineStatus;
}

export const CHECKS = [
  { key: "cables", label: "¿Cables en buen estado?", hint: "Sin cortes, aislamiento intacto, conexiones firmes" },
  { key: "gas", label: "¿Regulador de gas funcional?", hint: "Manómetro legible, sin fugas audibles" },
  { key: "torch", label: "¿Antorcha / Pinza limpia?", hint: "Boquilla y punta sin salpicaduras" },
  { key: "vent", label: "¿Ventilación libre de obstrucciones?", hint: "Rejillas despejadas, ventilador gira" },
] as const;
export type CheckKey = (typeof CHECKS)[number]["key"];

const MACHINES: Machine[] = [
  { id: "SLD-MIG-001", name: "Soldadora MIG Principal", brand: "Lincoln Electric", model: "Power MIG 360MP", weldType: ["MIG", "TIG", "MMA"], voltage: "220 / 440 V", amperage: "5 – 360 A", dutyCycle: "40% @ 300 A", location: "Nave A · Línea 1", status: "operativa" },
  { id: "SLD-TIG-002", name: "Equipo TIG Inox", brand: "Miller", model: "Dynasty 280 DX", weldType: ["TIG", "MMA"], voltage: "120 – 480 V", amperage: "1 – 280 A", dutyCycle: "40% @ 280 A", location: "Nave A · Cabina 3", status: "operativa" },
  { id: "SLD-MMA-003", name: "Inversor Electrodo Campo", brand: "ESAB", model: "Rogue ES 200i", weldType: ["MMA"], voltage: "220 V", amperage: "16 – 200 A", dutyCycle: "35% @ 200 A", location: "Patio exterior", status: "mantenimiento" },
  { id: "SLD-MIG-004", name: "MIG Pulsada Aluminio", brand: "Fronius", model: "TPS 400i", weldType: ["MIG"], voltage: "400 V", amperage: "3 – 400 A", dutyCycle: "50% @ 400 A", location: "Nave B · Línea 2", status: "operativa" },
  { id: "SLD-TIG-005", name: "TIG AC/DC Taller", brand: "Kemppi", model: "MasterTig 335", weldType: ["TIG", "MMA"], voltage: "400 V", amperage: "3 – 330 A", dutyCycle: "40% @ 330 A", location: "Taller mantenimiento", status: "operativa" },
  { id: "SLD-MIG-006", name: "Multiproceso Portátil", brand: "Lincoln Electric", model: "Flextec 350X", weldType: ["MIG", "MMA"], voltage: "380 – 575 V", amperage: "5 – 425 A", dutyCycle: "100% @ 350 A", location: "Nave B · Estructuras", status: "mantenimiento" },
];

const allOk = { cables: true, gas: true, torch: true, vent: true };
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

let state: { machines: Machine[]; inspections: Inspection[] } = {
  machines: MACHINES,
  inspections: [
    { id: "i1", machineId: "SLD-MIG-001", date: daysAgo(1), technician: "Carlos Rojas", checks: allOk, status: "operativa", notes: "Turno sin novedades." },
    { id: "i2", machineId: "SLD-MIG-001", date: daysAgo(2), technician: "Luisa Gómez", checks: allOk, status: "operativa", notes: "Se cambió boquilla." },
    { id: "i3", machineId: "SLD-MMA-003", date: daysAgo(1), technician: "Jorge Pérez", checks: { ...allOk, cables: false }, status: "mantenimiento", notes: "Cable de masa con aislamiento roto cerca de la pinza. Se retira de servicio." },
    { id: "i4", machineId: "SLD-MIG-006", date: daysAgo(3), technician: "Ana Martínez", checks: { ...allOk, vent: false }, status: "mantenimiento", notes: "Ventilador hace ruido, se reporta a mantenimiento." },
    { id: "i5", machineId: "SLD-TIG-002", date: daysAgo(1), technician: "Carlos Rojas", checks: allOk, status: "operativa", notes: "" },
  ],
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));

export function useStore() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function addInspection(i: Omit<Inspection, "id" | "date">) {
  const insp: Inspection = { ...i, id: crypto.randomUUID(), date: new Date().toISOString() };
  state = {
    inspections: [insp, ...state.inspections],
    machines: state.machines.map((m) => (m.id === i.machineId ? { ...m, status: i.status } : m)),
  };
  listeners.forEach((l) => l());
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
